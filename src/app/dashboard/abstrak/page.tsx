"use client";

import React, { useEffect, useState } from "react";
import { FileText, UploadCloud, CheckCircle, Lock } from "lucide-react";
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

  useEffect(() => {
    const session = localStorage.getItem("tip_current_user");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            >
              <option value="">-- Pilih Subtema --</option>
              {themesList.map((theme, idx) => (
                <option key={idx} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <Input label="Judul Karya Abstrak" placeholder="Masukkan judul abstrak secara lengkap" variant="glass" required />

          <div className="pt-4">
            <label className="text-sm font-bold text-white mb-2 block drop-shadow-sm">Upload File Abstrak <span className="text-red-500">*</span></label>
            <div className="border border-dashed border-white/30 bg-white/5 rounded-[1.5rem] p-10 text-center hover:bg-white/10 transition-colors cursor-pointer group shadow-sm backdrop-blur-sm">
              <div className="w-16 h-16 bg-white/20 text-white border border-white/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                <UploadCloud size={32} />
              </div>
              <p className="text-lg font-bold text-white">Klik atau drag file ke sini</p>
              <p className="text-sm text-white/70 mt-2 font-medium">Maks. 5MB (Format: .pdf)</p>
              <input type="file" className="hidden" accept=".pdf" required />
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
