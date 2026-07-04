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
    <div className="max-w-3xl mx-auto space-y-6 animate-entrance">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="text-[var(--color-brand-purple)]" size={28} />
        <h1 className="text-2xl font-bold text-slate-800">Pengumpulan Abstrak</h1>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-6 border border-blue-200">
            Halo <strong>{user.teamName}</strong>! Pastikan file abstrak Anda berformat <strong>.pdf</strong> dan ukurannya tidak melebihi <strong>5MB</strong>.
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

          <Input label="Judul Karya Abstrak" placeholder="Masukkan judul abstrak secara lengkap" required />

          <div className="pt-4">
            <label className="text-sm font-bold text-slate-800 mb-2 block">Upload File Abstrak <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-purple-100 text-[var(--color-brand-purple)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud size={32} />
              </div>
              <p className="text-lg font-bold text-slate-800">Klik atau drag file ke sini</p>
              <p className="text-sm text-slate-500 mt-2">Maks. 5MB (Format: .pdf)</p>
              <input type="file" className="hidden" accept=".pdf" required />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <Button type="submit" className="w-full bg-[var(--color-brand-purple)] text-white hover:bg-[var(--color-brand-purple-dark)] py-3">
              Kirim Abstrak
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Abstrak Berhasil Terkirim!</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Terima kasih telah mengumpulkan abstrak. Pengumuman lolos ke tahap selanjutnya akan diinformasikan pada menu Beranda tanggal 30 September 2026.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)} className="border-2 border-slate-300 text-slate-700">
            Kirim Ulang / Perbarui Abstrak
          </Button>
        </div>
      )}
    </div>
  );
}
