"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useSessionUser } from "@/app/(utils)/hooks/useSessionUser";
import { useTimeLock } from "@/app/(utils)/hooks/useTimeLock";
import { Warnscreen } from "@/app/(utils)/components/ui/Warnscreen";
import { SubmitSuccess } from "@/app/(utils)/components/ui/SubmitSuccess";
import { FileDropUpload } from "@/app/(utils)/components/ui/FileDropUpload";
import { Input } from "@/app/(utils)/components/ui/Input";
import { Button } from "@/app/(utils)/components/ui/Button";
import { getCurrentWaveInfo } from "@/app/(utils)/hooks/wavePricing";

const THEMES_POSTER = [
  "Energi Terbarukan & Teknologi Hijau",
  "Teknologi Pangan & Pertanian Presisi",
  "Smart Mobility & Manufacturing",
  "Infrastruktur & Material Berkelanjutan untuk Pemberdayaan UMKM",
  "AI & Machine Learning on Medical Activities",
];

export default function PosterPage() {
  const user = useSessionUser();
  const { isLocked, lockMessage } = useTimeLock(
    user?.category || "poster",
    "pengumpulan_poster",
  );

  const [submitted, setSubmitted] = useState(false);
  const [subtema, setSubtema] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<any>(null);
  const [deskripsi, setDeskripsi] = useState<any>(null);
  const [biodata, setBiodata] = useState<any>(null);
  const [orisinalitas, setOrisinalitas] = useState<any>(null);
  const [buktiPembayaran, setBuktiPembayaran] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTeam() {
      const { getMyTeam } = await import("@/app/lib/action/auth");
      const team = await getMyTeam();
      if (team && team.poster) {
        setSubmitted(true);
      }
    }
    loadTeam();
  }, []);

  const waveInfo = getCurrentWaveInfo(user?.category || "poster");

  if (!user) return <div className="p-8">Memuat halaman...</div>;
  if (isLocked) {
    return (
      <Warnscreen title="Pengumpulan Poster Belum Dibuka">
        {lockMessage}
      </Warnscreen>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !biodata || !orisinalitas || !buktiPembayaran || !deskripsi) return;
    setLoading(true);
    try {
      const { submitPoster } = await import("@/app/lib/action/submissions");
      const res = await submitPoster({
        teamName: user.user_name,
        subtema,
        title,
        file,
        biodata,
        orisinalitas,
        buktiPembayaran,
        deskripsi,
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-entrance relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <ImageIcon className="text-white drop-shadow-md" size={28} />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
          Pengumpulan Poster
        </h1>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)] space-y-6">
          <div className="bg-pink-500/20 text-pink-100 p-4 rounded-[1.2rem] text-sm mb-6 border border-pink-400/50 shadow-inner backdrop-blur-md leading-relaxed">
            Tim <strong className="text-white">{user.user_name}</strong>,
            pastikan resolusi gambar poster tinggi agar tidak pecah saat dinilai.
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-bold text-white drop-shadow-sm">
              Pilih Subtema Poster <span className="text-red-500">*</span>
            </label>
            <select
              className="flex h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:border-white/40 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer [&>option]:text-slate-900"
              required
              value={subtema}
              onChange={(e) => setSubtema(e.target.value)}
            >
              <option value="">-- Pilih Subtema --</option>
              {THEMES_POSTER.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <Input label="Judul Poster" placeholder="Ketik judul poster karya Anda" variant="glass" required value={title} onChange={(e) => setTitle(e.target.value)} />

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileDropUpload label="Upload Desain Poster" accept="image/*" maxSizeMB={4} teamName={user.user_name} stage="penyisihan" onUpload={setFile} />
            <FileDropUpload label="Upload Deskripsi Poster" accept=".pdf" maxSizeMB={2} teamName={user.user_name} stage="penyisihan" onUpload={setDeskripsi} />
            <FileDropUpload label="Upload Biodata" accept=".pdf" maxSizeMB={2} teamName={user.user_name} stage="penyisihan" onUpload={setBiodata} />
            <FileDropUpload label="Upload Lembar Orisinalitas" accept=".pdf" maxSizeMB={2} teamName={user.user_name} stage="penyisihan" onUpload={setOrisinalitas} />
          </div>

          <div className="bg-white/5 border border-white/20 p-6 rounded-[1.2rem] mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Informasi Pembayaran ({waveInfo.waveName})</h3>
            <p className="text-white/80 mb-2">Biaya Pendaftaran: <strong className="text-yellow-300 text-xl ml-2">{waveInfo.formattedPrice}</strong></p>
            <div className="text-white/80 mb-4">
              <p>Transfer ke Rekening:</p>
              <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                <li>Bank BRI: <strong className="text-white">3539 0104 7607 530</strong></li>
                <li>Bank Mandiri: <strong className="text-white">1370 0261 3874 9</strong></li>
              </ul>
              <p className="mt-2 ml-2">an. <strong className="text-white">Ristama Simangunsong</strong></p>
            </div>
            <FileDropUpload label="Upload Bukti Pembayaran" accept="image/*,.pdf" maxSizeMB={2} teamName={user.user_name} stage="penyisihan" onUpload={setBuktiPembayaran} />
          </div>

          <div className="pt-6 border-t border-white/20 mt-8">
            <Button type="submit" fullWidth disabled={loading || !file || !biodata || !orisinalitas || !buktiPembayaran || !deskripsi}
              className="bg-white/20 border border-white/30 text-white font-bold hover:bg-white/30 hover:-translate-y-1 py-4 rounded-[1.2rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {loading ? "Mengirim..." : "Kirim Poster"}
            </Button>
          </div>
        </form>
      ) : (
        <SubmitSuccess title="Poster Berhasil Diunggah!">
          Terima kasih telah mengumpulkan karya Poster Anda. Jangan lupa pantau terus Instagram kami untuk info penilaian publik.
        </SubmitSuccess>
      )}
    </div>
  );
}
