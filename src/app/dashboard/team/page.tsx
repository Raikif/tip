"use client";

import React, { useEffect, useState } from "react";
import { Users, FileImage } from "lucide-react";

export default function MyTeamPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem("tip_current_user");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  if (!user) return <div className="p-8">Memuat data tim...</div>;

  const categoryMap: Record<string, string> = {
    lkti: "Karya Tulis Ilmiah (Mahasiswa)",
    essay: "Essay (Mahasiswa)",
    poster: "Desain Poster (SMA/Sederajat)"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-entrance relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <Users className="text-white drop-shadow-md" size={28} />
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">My Team</h1>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)] mb-6">
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 border-b border-white/20 pb-3 mb-4 drop-shadow-sm">Informasi Umum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/70 font-medium">Nama Tim</p>
            <p className="font-bold text-white text-lg">{user.teamName}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium">Asal Instansi</p>
            <p className="font-bold text-white text-lg">{user.institution}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium">Kategori Lomba</p>
            <p className="font-bold text-white text-lg">{categoryMap[user.category]}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-sm pb-1">Anggota Tim</h2>
        
        {/* Ketua */}
        <div className="bg-black/10 backdrop-blur-md border border-white/20 rounded-[1.5rem] p-6 shadow-inner">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Ketua Tim</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <p className="text-sm text-white/70 font-medium">Nama Lengkap</p>
              <p className="font-bold text-white text-lg">{user.leaderName}</p>
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">NIM / NISN</p>
              <p className="font-bold text-white text-lg">{user.leaderNim}</p>
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">Email</p>
              <p className="font-bold text-white text-lg">{user.leaderEmail}</p>
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium">No. WhatsApp</p>
              <p className="font-bold text-white text-lg">{user.leaderWa}</p>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <p className="text-sm text-white/70 font-medium mb-1">Kartu Identitas</p>
              <div className="flex items-center gap-2 text-white bg-white/10 border border-white/20 p-2.5 rounded-[0.8rem] text-sm w-fit backdrop-blur-sm shadow-inner">
                <FileImage size={18} />
                <span className="font-bold">Telah Diunggah</span>
              </div>
            </div>
          </div>
        </div>

        {/* Anggota 1 */}
        {user.member1Name && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Anggota 1</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <p className="text-sm text-white/60 font-medium">Nama Lengkap</p>
                <p className="font-bold text-white text-lg">{user.member1Name}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 font-medium">NIM / NISN</p>
                <p className="font-bold text-white text-lg">{user.member1Nim}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 font-medium mb-1">Kartu Identitas</p>
                <div className="flex items-center gap-2 text-white/90 bg-white/5 border border-white/10 p-2.5 rounded-[0.8rem] text-sm w-fit shadow-inner">
                  <FileImage size={18} />
                  <span className="font-bold">Telah Diunggah</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Anggota 2 */}
        {user.member2Name && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Anggota 2</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <p className="text-sm text-white/60 font-medium">Nama Lengkap</p>
                <p className="font-bold text-white text-lg">{user.member2Name}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 font-medium">NIM / NISN</p>
                <p className="font-bold text-white text-lg">{user.member2Nim}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 font-medium mb-1">Kartu Identitas</p>
                <div className="flex items-center gap-2 text-white/90 bg-white/5 border border-white/10 p-2.5 rounded-[0.8rem] text-sm w-fit shadow-inner">
                  <FileImage size={18} />
                  <span className="font-bold">Telah Diunggah</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
