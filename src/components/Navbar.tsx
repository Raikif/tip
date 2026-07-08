import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const scrollTo = (section: string) => {
    // Because we use GSAP ScrollTrigger with pin and scrub, 
    // standard ID anchors don't work well. We calculate the scroll position.
    let multiplier = 0;
    if (section === "timeline") multiplier = 1;
    if (section === "competition") multiplier = 2;
    if (section === "about") multiplier = 3;

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: window.innerHeight * multiplier,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 glass-nav z-50 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl tracking-tight text-[var(--color-brand-purple)]">
          TxC 2026
        </span>
      </div>

      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8 text-sm font-medium text-slate-700">
        <button onClick={() => scrollTo("timeline")} className="hover:text-[var(--color-brand-purple)] transition-colors">Timeline</button>
        <button onClick={() => scrollTo("competition")} className="hover:text-[var(--color-brand-purple)] transition-colors">Competition</button>
        <button onClick={() => scrollTo("about")} className="hover:text-[var(--color-brand-purple)] transition-colors">Tentang Kami</button>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/guidebook">
          <Button variant="secondary" className="hidden sm:inline-flex bg-white/80 border-slate-200">
            Guidebook
          </Button>
        </Link>
        <Link href="/pendaftaran">
          <Button variant="primary" className="bg-gradient-to-r from-[var(--color-brand-purple)] to-[var(--color-brand-pink)] border-none text-white hover:opacity-90">
            Daftar Sekarang
          </Button>
        </Link>
      </div>
    </nav>
  );
}
