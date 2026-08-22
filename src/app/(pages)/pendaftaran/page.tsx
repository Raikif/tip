"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/app/(utils)/components/ui/Button";
import {
  CalendarX2,
  LogIn,
  Home,
  MessageCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function RegistrationPage() {
  const contacts = [
    {
      category: "LKTI",
      name: "Andin",
      phone: "085815849940",
      waLink: "https://wa.me/6285815849940",
      color: "from-blue-500/20 to-cyan-500/10 border-blue-400/30 text-blue-200",
    },
    {
      category: "Essay",
      name: "Sarah",
      phone: "085856439655",
      waLink: "https://wa.me/6285856439655",
      color: "from-purple-500/20 to-pink-500/10 border-purple-400/30 text-purple-200",
    },
    {
      category: "Poster",
      name: "Kahe",
      phone: "082259864141",
      waLink: "https://wa.me/6282259864141",
      color: "from-amber-500/20 to-orange-500/10 border-amber-400/30 text-amber-200",
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-8 relative flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-white/90 font-medium hover:text-white hover:underline text-sm flex items-center gap-1.5 drop-shadow-md transition-colors"
          >
            <Home size={16} />
            <span>&larr; Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Main Glass Card */}
        <div className="w-full bg-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden relative z-10 animate-entrance">
          {/* Top Decorative Header Accent */}
          <div className="bg-gradient-to-r from-red-500/20 via-amber-500/20 to-purple-500/20 px-8 py-10 text-center relative border-b border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
              Pendaftaran Telah Ditutup
            </div>

            {/* Icon Graphic */}
            <div className="w-20 h-20 bg-white/15 text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner backdrop-blur-md">
              <CalendarX2 size={40} className="text-amber-300 drop-shadow-md" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-100 to-yellow-400 drop-shadow-md pb-1">
              Masa Pendaftaran Berakhir
            </h1>

            <p className="text-white/85 text-base md:text-lg max-w-xl mx-auto mt-2 font-medium leading-relaxed drop-shadow-sm">
              Terima kasih atas antusiasme seluruh calon peserta. Periode
              pendaftaran Tech Innovation Paper 2026 telah resmi ditutup karena telah melewati batas waktu pendaftaran.
            </p>
          </div>

          {/* Content Body */}
          <div className="p-8 md:p-10 space-y-8 relative">
            {/* Info for registered teams */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-slate-900 font-bold shrink-0 shadow-md">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white drop-shadow-sm">
                    Sudah Mendaftarkan Tim?
                  </h2>
                  <p className="text-sm text-white/80 mt-1 leading-relaxed">
                    Bagi tim yang telah berhasil mendaftar, silakan masuk ke
                    Dashboard untuk melihat status berkas, melengkapi data, dan
                    mengunggah karya sesuai jadwal tahapan lomba.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <Link href="/login" className="flex-1">
                  <Button
                    type="button"
                    className="w-full py-4 text-base flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6A00] to-amber-500 hover:from-[#ff5c00] hover:to-amber-600 text-white font-bold rounded-[1.2rem] shadow-[0_10px_25px_rgba(255,106,0,0.35)] hover:-translate-y-0.5 transition-all"
                  >
                    <LogIn size={20} />
                    Masuk ke Dashboard
                    <ArrowRight size={18} />
                  </Button>
                </Link>

                <Link href="/" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-4 text-base border border-white/20 bg-white/5 text-white hover:bg-white/15 font-bold rounded-[1.2rem] backdrop-blur-sm transition-all"
                  >
                    Kembali ke Beranda
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact Person Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={20} className="text-yellow-300" />
                <h3 className="text-base font-bold text-white drop-shadow-sm">
                  Butuh Bantuan? Hubungi Narahubung
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {contacts.map((contact) => (
                  <a
                    key={contact.category}
                    href={contact.waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gradient-to-br ${contact.color} border p-4 rounded-2xl hover:scale-[1.02] hover:border-white/40 transition-all duration-300 shadow-sm backdrop-blur-md flex flex-col justify-between group`}
                  >
                    <div>
                      <div className="text-xs uppercase font-extrabold tracking-wider opacity-80 mb-1">
                        Cabang {contact.category}
                      </div>
                      <div className="text-base font-bold text-white group-hover:text-yellow-300 transition-colors">
                        {contact.name}
                      </div>
                      <div className="text-xs text-white/70 mt-0.5">
                        {contact.phone}
                      </div>
                    </div>
                    <div className="mt-3 text-xs font-semibold flex items-center gap-1 text-white/90 group-hover:underline">
                      <span>Chat WhatsApp</span>
                      <ArrowRight size={12} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
