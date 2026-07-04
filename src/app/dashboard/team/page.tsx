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
    <div className="max-w-4xl mx-auto space-y-6 animate-entrance">
      <div className="flex items-center gap-3 mb-8">
        <Users className="text-[var(--color-brand-purple)]" size={28} />
        <h1 className="text-2xl font-bold text-slate-800">My Team</h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">Informasi Umum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Nama Tim</p>
            <p className="font-semibold text-slate-800">{user.teamName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Asal Instansi</p>
            <p className="font-semibold text-slate-800">{user.institution}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Kategori Lomba</p>
            <p className="font-semibold text-[var(--color-brand-purple)]">{categoryMap[user.category]}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Anggota Tim</h2>
        
        {/* Ketua */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Ketua Tim</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-500">Nama Lengkap</p>
              <p className="font-semibold text-slate-800">{user.leaderName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">NIM / NISN</p>
              <p className="font-semibold text-slate-800">{user.leaderNim}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-semibold text-slate-800">{user.leaderEmail}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">No. WhatsApp</p>
              <p className="font-semibold text-slate-800">{user.leaderWa}</p>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <p className="text-sm text-slate-500 mb-1">Kartu Identitas</p>
              <div className="flex items-center gap-2 text-purple-600 bg-white border border-purple-200 p-2 rounded-lg text-sm w-fit">
                <FileImage size={16} />
                <span className="font-medium">Telah Diunggah</span>
              </div>
            </div>
          </div>
        </div>

        {/* Anggota 1 */}
        {user.member1Name && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Anggota 1</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500">Nama Lengkap</p>
                <p className="font-semibold text-slate-800">{user.member1Name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">NIM / NISN</p>
                <p className="font-semibold text-slate-800">{user.member1Nim}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Kartu Identitas</p>
                <div className="flex items-center gap-2 text-purple-600 bg-purple-50 border border-purple-100 p-2 rounded-lg text-sm w-fit">
                  <FileImage size={16} />
                  <span className="font-medium">Telah Diunggah</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Anggota 2 */}
        {user.member2Name && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">Anggota 2</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500">Nama Lengkap</p>
                <p className="font-semibold text-slate-800">{user.member2Name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">NIM / NISN</p>
                <p className="font-semibold text-slate-800">{user.member2Nim}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Kartu Identitas</p>
                <div className="flex items-center gap-2 text-purple-600 bg-purple-50 border border-purple-100 p-2 rounded-lg text-sm w-fit">
                  <FileImage size={16} />
                  <span className="font-medium">Telah Diunggah</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
