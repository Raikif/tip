"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-8">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-10 max-w-lg w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="text-5xl mb-4">😵</div>
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-red-400 pb-1 mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-white/70 font-medium leading-relaxed mb-2">
          Ada masalah saat memuat halaman ini. Silakan coba lagi.
        </p>
        <p className="text-white/40 text-xs font-mono mb-8 break-all">
          {error.message || error.digest || "Unknown error"}
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-[1rem] transition-all hover:-translate-y-1"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
