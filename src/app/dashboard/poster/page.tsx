"use client";

import React, { useEffect, useState } from "react";
import { Image as ImageIcon, UploadCloud, CheckCircle, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const THEMES_POSTER = [
  "Energi Terbarukan & Teknologi Hijau",
  "Teknologi Pangan & Pertanian Presisi",
  "Smart Mobility & Manufacturing",
  "Infrastruktur & Material Berkelanjutan untuk Pemberdayaan UMKM",
  "AI & Machine Learning on Medical Activities"
];

export default function PosterPage() {
  const [user, setUser] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("tip_current_user");
    if (session) {
      setUser(JSON.parse(session));
    }

    const isDebug = localStorage.getItem("debug_time_bypass") === "true";
    const now = new Date();
    // Poster Timeline: 1 Sept - 14 Sept 2026
    const start = new Date("2026-09-01T00:00:00");
    const end = new Date("2026-09-14T23:59:59");
    
    if (!isDebug && (now < start || now > end)) {
      setIsLocked(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!user) return <div className="p-8">Memuat halaman...</div>;

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-entrance">
        <div className="w-24 h-24 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-6">
          <Lock size={48} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Pengumpulan Poster Belum Dibuka</h1>
        <p className="text-slate-600 max-w-md">
          Masa pengumpulan poster adalah <strong>1 September - 14 September 2026</strong>. Silakan kembali pada rentang waktu tersebut.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-entrance">
      <div className="flex items-center gap-3 mb-8">
        <ImageIcon className="text-[var(--color-brand-pink)]" size={28} />
        <h1 className="text-2xl font-bold text-slate-800">Pengumpulan Poster</h1>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          
          <div className="bg-pink-50 text-pink-800 p-4 rounded-lg text-sm mb-6 border border-pink-200">
            Tim <strong>{user.teamName}</strong>, pastikan resolusi gambar poster tinggi agar tidak pecah saat dinilai.
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-800">Pilih Subtema Poster <span className="text-red-500">*</span></label>
            <select 
              className="flex h-12 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/20 focus-visible:border-purple-500 hover:border-slate-400 transition-all"
              required
            >
              <option value="">-- Pilih Subtema --</option>
              {THEMES_POSTER.map((theme, idx) => (
                <option key={idx} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <Input label="Judul Poster" placeholder="Ketik judul poster karya Anda" required />

          <div className="pt-4">
            <label className="text-sm font-bold text-slate-800 mb-2 block">Upload Desain Poster <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-pink-100 text-[var(--color-brand-pink)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud size={32} />
              </div>
              <p className="text-lg font-bold text-slate-800">Klik atau drag gambar ke sini</p>
              <p className="text-sm text-slate-500 mt-2">Maks. 10MB (Format: .jpg, .png)</p>
              <input type="file" className="hidden" accept="image/*" required />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <Button type="submit" className="w-full bg-[var(--color-brand-pink)] text-white hover:opacity-90 py-3 border-none">
              Kirim Poster
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Poster Berhasil Diunggah!</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Terima kasih telah mengumpulkan karya Poster Anda. Jangan lupa pantau terus Instagram kami untuk info penilaian publik.
          </p>
        </div>
      )}
    </div>
  );
}
