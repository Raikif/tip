"use client";

import React, { useEffect, useState } from "react";
import { FilePlus, UploadCloud, CheckCircle, Lock } from "lucide-react";
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

export default function FullpaperPage() {
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
    // Fullpaper Timeline: 30 Sept - 14 Oct 2026
    const start = new Date("2026-09-30T00:00:00");
    const end = new Date("2026-10-14T23:59:59");
    
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
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Pengumpulan Fullpaper Dikunci</h1>
        <p className="text-slate-600 max-w-md">
          Pengumpulan Fullpaper hanya dapat dilakukan setelah pengumuman Finalis (mulai <strong>30 September - 14 Oktober 2026</strong>).
        </p>
      </div>
    );
  }

  const userCategory = user.category as "lkti" | "essay";
  const themesList = THEMES[userCategory] || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-entrance">
      <div className="flex items-center gap-3 mb-8">
        <FilePlus className="text-[var(--color-brand-purple)]" size={28} />
        <h1 className="text-2xl font-bold text-slate-800">Pengumpulan Fullpaper</h1>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm mb-6 border border-yellow-200">
            <strong>Perhatian {user.teamName}:</strong> Pastikan Anda telah dinyatakan <strong>Lolos</strong> sebelum mengumpulkan fullpaper.
          </div>

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-800">Pilih Subtema <span className="text-red-500">*</span></label>
            <select 
              className="flex h-12 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/20 focus-visible:border-purple-500 hover:border-slate-400 transition-all"
              required
            >
              <option value="">-- Pilih Subtema --</option>
              {themesList.map((theme, idx) => (
                <option key={idx} value={theme}>{theme}</option>
              ))}
            </select>
          </div>

          <Input label="Judul Fullpaper" placeholder="Masukkan judul akhir fullpaper Anda" required />

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-slate-800 mb-2 block">Upload Lembar Orisinalitas <span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-orange-100 text-[var(--color-brand-orange)] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-slate-800">Lembar Orisinalitas</p>
                <p className="text-xs text-slate-500 mt-1">Maks. 2MB (.pdf)</p>
                <input type="file" className="hidden" accept=".pdf" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-800 mb-2 block">Upload Fullpaper <span className="text-red-500">*</span></label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-purple-100 text-[var(--color-brand-purple)] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-slate-800">File Fullpaper</p>
                <p className="text-xs text-slate-500 mt-1">Maks. 10MB (.pdf)</p>
                <input type="file" className="hidden" accept=".pdf" required />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <Button type="submit" className="w-full bg-[var(--color-brand-purple)] text-white hover:bg-[var(--color-brand-purple-dark)] py-3">
              Kirim Fullpaper
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Fullpaper Berhasil Terkirim!</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Terima kasih, karya Anda sudah tersimpan di sistem kami. Semoga beruntung di tahap Grand Final!
          </p>
        </div>
      )}
    </div>
  );
}
