"use client";

import React, { useEffect, useState } from "react";
import { Info, BellRing, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [showFinalist, setShowFinalist] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("tip_current_user");
    if (session) {
      setUser(JSON.parse(session));
    }
    
    // Check if it's after Sept 30 2026 for Finalist Announcement
    const isDebug = localStorage.getItem("debug_time_bypass") === "true";
    const now = new Date();
    const announcementDate = new Date("2026-09-30T00:00:00");
    if (isDebug || now >= announcementDate) {
      setShowFinalist(true);
    }
  }, []);

  if (!user) return <div className="p-8">Memuat beranda...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-entrance">
      
      {/* Header / Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <p className="text-purple-100 text-sm md:text-base font-medium mb-1">Halo, Tim {user.teamName}!</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Selamat Datang di Dashboard</h1>
          <p className="text-white/90 text-sm max-w-lg">
            Di sini Anda dapat mengelola tim, melihat pengumuman terbaru, dan mengumpulkan karya inovatif Anda.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute right-[-5%] top-[-20%] w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pengumuman Terbaru */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Pengumuman Terbaru</h2>
          
          {showFinalist ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                  <BellRing size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Selamat, Anda Lolos ke Tahap Berikutnya!</h3>
                  <p className="text-green-700 text-sm leading-relaxed mb-4">
                    Berdasarkan hasil penilaian, tim Anda dinyatakan berhak untuk melanjutkan ke tahap Fullpaper/Grand Final. Silakan baca panduan penulisan di *guidebook* dan kumpulkan sebelum tenggat waktu.
                  </p>
                  {user?.category !== "poster" && (
                    <Link href="/dashboard/fullpaper" className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                      Kumpulkan Fullpaper
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-1">Menunggu Pengumuman / Masa Pengumpulan</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Saat ini kami masih berada pada tahap pengumpulan karya atau penjurian. Pengumuman finalis akan dilakukan pada tanggal 30 September 2026. Pantau terus dashboard ini!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Info size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Pendaftaran Berhasil Dikonfirmasi</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Bukti pembayaran Anda telah diverifikasi oleh panitia. Akun tim Anda kini sepenuhnya aktif.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Deadline */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Tenggat Waktu (Deadline)</h2>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Pengumpulan Karya</p>
                <p className="text-xs text-orange-600 font-medium">1 - 14 September 2026</p>
              </div>
            </div>
            
            <div className="h-px bg-slate-100 w-full"></div>
            
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Pengumuman Finalis</p>
                <p className="text-xs text-purple-600 font-medium">30 September 2026</p>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full"></div>
            
            <div className="flex gap-4 items-center opacity-50">
              <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Grand Final</p>
                <p className="text-xs text-slate-500 font-medium">15 Oktober 2026</p>
              </div>
            </div>
            
            <button 
              onClick={() => { 
                if (localStorage.getItem("debug_time_bypass") === "true") {
                  localStorage.removeItem("debug_time_bypass");
                } else {
                  localStorage.setItem("debug_time_bypass", "true"); 
                }
                window.location.reload(); 
              }}
              className="mt-4 text-[10px] text-slate-300 hover:text-slate-500 w-full text-center"
            >
              [Toggle Bypass Waktu]
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
