"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FileText, UploadCloud, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const THEMES = {
  lkti: [
    "Industri Manufaktur, Otomasi, dan IoT",
    "Infrastruktur, Geospasial, dan Mitigasi Bencana",
    "Energi Terbarukan dan Teknologi Lingkungan",
    "Agraria, Teknologi Pangan, dan Bioteknologi",
    "Teknologi Medis dan Alat Kesehatan",
    "Teknologi Edukasi dan Media Pembelajaran"
  ],
  essay: [
    "Agraria dan Pangan: Rekayasa Inovasi Teknologi Terapan",
    "Energi dan Lingkungan: Pemberdayaan Energi Bersih",
    "Publik dan Kesehatan: Optimalisasi Tingkat Komponen",
    "Pendidikan dan SDM: Inovasi Teknologi",
    "Mitigasi Bencana dan Geospasial: Pengembangan Teknologi Cerdas"
  ]
};

export default function AbstrakPage() {
  const [user, setUser] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const [subtema, setSubtema] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("tip_current_user");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const DRIVE_FOLDER_ID = useMemo(() => {
    const v = process.env.NEXT_PUBLIC_DRIVE_ABSTRAK_FOLDER_ID;
    return v || "";
  }, []);
  
  const getDriveUploadUrl = () => {
    return `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true`;
  };
  
  const GOOGLE_CLIENT_ID = useMemo(() => {
    return process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  }, []);

  useEffect(() => {
      // Load Google Identity Services script + initialize OAuth
    if (!GOOGLE_CLIENT_ID) return;

    const existing = document.getElementById("google-identity-services");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "google-identity-services";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const interval = window.setInterval(() => {
      const g = (window as any).google;
      if (!g?.accounts?.oauth2) return;

      window.clearInterval(interval);

      try {
        (window as any).google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "https://www.googleapis.com/auth/drive.file",
          callback: (resp: any) => {
            const token = resp?.access_token;
            setGoogleAccessToken(token || null);
          },
        });
      } catch {
        // ignore; init will fail if called twice
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [GOOGLE_CLIENT_ID]);

  const ensureDriveToken = async () => {
    if (googleAccessToken) return googleAccessToken;
    if (!GOOGLE_CLIENT_ID) throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID belum diset.");

    const tokenClient = (window as any).google?.accounts?.oauth2?.initTokenClient
      ? null
      : null;

    setGoogleSigningIn(true);

    // Request a new token
    const g = (window as any).google;
    const tc = g?.accounts?.oauth2?.__tokenClient;
    if (g?.accounts?.oauth2?.initTokenClient && !tc) {
      // Fallback: create a client and request token
      const created = g.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: (resp: any) => {
          const token = resp?.access_token;
          setGoogleAccessToken(token || null);
          setGoogleSigningIn(false);
        },
      });
      created.requestAccessToken();
      return await new Promise<string>((resolve, reject) => {
        const start = Date.now();
        const check = () => {
          if ((window as any).google === undefined) return;
          if (googleAccessToken) return resolve(googleAccessToken);
          if (Date.now() - start > 15000) return reject(new Error("Timeout mendapatkan access token Google."));
          requestAnimationFrame(check);
        };
        check();
      });
    }

    setGoogleSigningIn(false);
    const finalToken = googleAccessToken;
    if (!finalToken) throw new Error("Tidak dapat access token Google.");
    return finalToken;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user?.teamName) {
      setError("Data tim tidak ditemukan. Silakan login ulang.");
      return;
    }
    if (!subtema.trim() || !title.trim()) {
      setError("Subtema dan judul abstrak wajib diisi.");
      return;
    }
    if (!selectedFile) {
      setError("File abstrak wajib dipilih.");
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      setError("Format file harus .pdf");
      return;
    }
    const maxBytes = 2 * 1024 * 1024; // 2MB client-side limit
    if (selectedFile.size > maxBytes) {
      setError("Ukuran file abstrak maksimal 2MB.");
      return;
    }

    setIsLoading(true);
    try {
      if (!DRIVE_FOLDER_ID) {
        setError("Drive folder ID belum diset. (NEXT_PUBLIC_DRIVE_ABSTRAK_FOLDER_ID)");
        return;
      }

      // 1) upload ke Google Drive pakai token OAuth pengguna
      // NOTE: ini belum mengimplementasikan OAuth login UI; implementasi token
      // diasumsikan tersedia via cookie/session atau mekanisme lain.
      // 1) ambil/refresh access token Drive via OAuth token client
      const accessToken = await ensureDriveToken();
      if (!accessToken) {
        setError("Belum ada access token Google.");
        return;
      }

      const metadata = {
        name: selectedFile.name,
        mimeType: selectedFile.type || "application/pdf",
        parents: [DRIVE_FOLDER_ID],
      };

      const boundary = `-------${crypto.randomUUID()}-------`;

      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const fileBytes = await selectedFile.arrayBuffer();
      const bodyParts: Array<Uint8Array> = [];

      const enc = new TextEncoder();

      bodyParts.push(enc.encode(delimiter));
      bodyParts.push(
        enc.encode(
          `Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`
        )
      );

      bodyParts.push(enc.encode(delimiter));
      bodyParts.push(
        enc.encode(
          `Content-Type: ${selectedFile.type || "application/pdf"}\r\n\r\n`
        )
      );

      bodyParts.push(new Uint8Array(fileBytes));
      bodyParts.push(enc.encode(closeDelimiter));

      const multipartBody = concatUint8Arrays(bodyParts);

      const uploadRes = await fetch(getDriveUploadUrl(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartBody,
      });

      if (!uploadRes.ok) {
        const t = await uploadRes.text().catch(() => "");
        throw new Error(`Drive upload failed: ${uploadRes.status} ${t}`);
      }

      const uploadJson = await uploadRes.json();
      const fileId = uploadJson?.id as string | undefined;
      const webViewLink = uploadJson?.webViewLink as string | undefined;
      const fileName = uploadJson?.name as string | undefined;

      if (!fileId) {
        throw new Error("Drive upload berhasil tapi fileId tidak ditemukan.");
      }

      // 2) simpan metadata ke RTDB
      const res = await fetch("/api/abstrak/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: user.teamName,
          subtema,
          title,
          file: {
            fileName,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            fileId,
            webViewLink,
          },
          status: "submitted",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        setError(json?.error || "Gagal mengirim abstrak.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal mengirim abstrak.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  function concatUint8Arrays(chunks: Uint8Array[]) {
    const total = chunks.reduce((sum, c) => sum + c.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      out.set(c, offset);
      offset += c.length;
    }
    return out;
  }

  if (!user) return <div className="p-8">Memuat halaman...</div>;

  const userCategory = user.category as "lkti" | "essay";
  const themesList = THEMES[userCategory] || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-entrance relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="text-white drop-shadow-md" size={28} />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">Pengumpulan Abstrak</h1>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] space-y-6">
          <div className="bg-blue-500/20 text-blue-100 p-4 rounded-[1.2rem] text-sm mb-6 border border-blue-400/50 shadow-inner backdrop-blur-md leading-relaxed">
            Halo <strong className="text-white">{user.teamName}</strong>! Pastikan file abstrak Anda berformat <strong className="text-white">.pdf</strong> dan ukurannya tidak melebihi <strong className="text-white">5MB</strong>.
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-bold text-white drop-shadow-sm">Pilih Subtema <span className="text-red-500">*</span></label>
            <select
              className="flex h-12 w-full rounded-[0.8rem] border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:border-white/40 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer [&>option]:text-slate-900"
              required
              value={subtema}
              onChange={(e) => setSubtema(e.target.value)}
            >
              <option value="">-- Pilih Subtema --</option>
              {themesList.map((theme, idx) => (
                <option key={idx} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <Input
            label="Judul Karya Abstrak"
            placeholder="Masukkan judul abstrak secara lengkap"
            variant="glass"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="pt-4">
            <label className="text-sm font-bold text-white mb-2 block drop-shadow-sm">Upload File Abstrak <span className="text-red-500">*</span></label>
            <div className="border border-dashed border-white/30 bg-white/5 rounded-[1.5rem] p-10 text-center hover:bg-white/10 transition-colors cursor-pointer group shadow-sm backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 text-white border border-white/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <UploadCloud size={32} />
              </div>
              <p className="text-lg font-bold text-white">Klik atau drag file ke sini</p>
              <p className="text-sm text-white/70 mt-2 font-medium">Maks. 2MB (Format: .pdf)</p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setSelectedFile(f);
                }}
                required
              />
              {selectedFile && (
                <p className="text-xs text-white/70 mt-3 font-medium">
                  Dipilih: <span className="text-white/90">{selectedFile.name}</span>
                </p>
              )}
              {googleSigningIn && (
                <p className="text-xs text-white/70 mt-3 font-medium">
                  Menyiapkan akses Google Drive...
                </p>
              )}
              {!googleAccessToken && (
                <p className="text-xs text-white/70 mt-2 font-medium">
                  Klik “Kirim Abstrak” untuk login Google Drive.
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/20 mt-8">
            <Button type="submit" className="w-full bg-white/20 border border-white/30 text-white font-bold hover:bg-white/30 hover:-translate-y-1 py-4 rounded-[1.2rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300">
              Kirim Abstrak
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-white/20 text-white border-2 border-white/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner backdrop-blur-md">
              <CheckCircle size={48} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mb-4 drop-shadow-md pb-1">Abstrak Berhasil Terkirim!</h2>
            <p className="text-white/80 mb-10 max-w-md mx-auto text-lg leading-relaxed font-medium">
              Terima kasih telah mengumpulkan abstrak. Pengumuman lolos ke tahap selanjutnya akan diinformasikan pada menu Beranda tanggal 30 September 2026.
            </p>
            <Button variant="outline" onClick={() => setSubmitted(false)} className="border border-white/40 bg-white/10 text-white font-bold hover:bg-white/20 hover:text-white px-8 py-3 rounded-xl backdrop-blur-md transition-all shadow-sm">
              Kirim Ulang / Perbarui Abstrak
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
