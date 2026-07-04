import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FaChevronRight } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section id="hero" className="panel bg-hero items-center justify-center relative">
      <div className="max-w-4xl mx-auto text-center space-y-8 px-4 z-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[var(--color-brand-purple)]/30 bg-purple-500/10 text-[var(--color-brand-purple)] font-semibold text-sm backdrop-blur-md">
          LPKTA & Cendekia Teknika
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Tech Innovation <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-orange)]">
            Paper 2026
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto">
          Wujudkan ide dan inovasimu melalui Lomba Karya Tulis Ilmiah Tingkat Nasional. Jadilah bagian dari generasi emas pembawa perubahan!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/pendaftaran">
            <Button variant="primary" size="lg" className="w-full sm:w-auto flex items-center gap-2 group bg-[var(--color-brand-purple)] text-white hover:bg-[var(--color-brand-purple-dark)]">
              Daftar Sekarang
              <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/guidebook">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/90 text-slate-800 border-slate-300">
              Unduh Guidebook
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-[var(--color-brand-purple)]">
        <span className="text-sm font-medium mb-2 uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-current rounded-full" />
        </div>
      </div>
    </section>
  );
}
