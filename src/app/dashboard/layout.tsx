"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Users, FileText, Image as ImageIcon, FilePlus, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [showFinalist, setShowFinalist] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("tip_current_user");
    if (!session) {
      console.warn("Session is missing!");
      router.push("/login");
    } else {
      setUser(JSON.parse(session));
    }
    
    // Check timeline for fullpaper
    const isDebug = localStorage.getItem("debug_time_bypass") === "true";
    const now = new Date();
    const announcementDate = new Date("2026-09-30T00:00:00");
    if (isDebug || now >= announcementDate) {
      setShowFinalist(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("tip_current_user");
    router.push("/login");
  };

  // DO NOT early return without children in a Next.js Layout! It aborts routing!
  const isKTI = user ? (user.category === "lkti" || user.category === "essay") : false;
  const isPoster = user ? (user.category === "poster") : false;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[var(--color-brand-purple)] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat sesi Dashboard...</p>
          <div className="hidden">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex animate-entrance">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex flex-col items-center justify-center text-center">
          <span className="font-bold text-xl tracking-tight text-[var(--color-brand-purple)]">
            TIP 2026
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md mt-2 font-medium uppercase tracking-widest">
            Dashboard
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-purple-50 hover:text-[var(--color-brand-purple)] rounded-lg font-medium transition-colors">
            <Home size={20} />
            Beranda
          </Link>
          <Link href="/dashboard/team" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-purple-50 hover:text-[var(--color-brand-purple)] rounded-lg font-medium transition-colors">
            <Users size={20} />
            My Team
          </Link>
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Pengumpulan Karya</p>
          </div>
          
          {isKTI && (
            <>
              <Link href="/dashboard/abstrak" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-purple-50 hover:text-[var(--color-brand-purple)] rounded-lg font-medium transition-colors">
                <FileText size={20} />
                Abstrak
              </Link>
              {showFinalist && (
                <Link href="/dashboard/fullpaper" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-purple-50 hover:text-[var(--color-brand-purple)] rounded-lg font-medium transition-colors">
                  <FilePlus size={20} />
                  Fullpaper
                </Link>
              )}
            </>
          )}

          {isPoster && (
            <Link href="/dashboard/poster" className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-purple-50 hover:text-[var(--color-brand-purple)] rounded-lg font-medium transition-colors">
              <ImageIcon size={20} />
              Poster
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10">
          <span className="font-bold text-lg text-[var(--color-brand-purple)]">TIP 2026</span>
          <button onClick={handleLogout} className="text-red-500 text-sm font-medium">Keluar</button>
        </header>
        
        <div className="p-6 md:p-10 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
