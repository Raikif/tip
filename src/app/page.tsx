"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TimelineSection from "@/components/sections/TimelineSection";
import CompetitionSection from "@/components/sections/CompetitionSection";
import AboutUsSection from "@/components/sections/AboutUsSection";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".panel-hidden");
      
      // Susun z-index panel tersembunyi berurutan
      panels.forEach((panel, i) => {
        panel.style.zIndex = (10 + i).toString();
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%", // scroll length (100% per panel)
          pin: true,
          scrub: 1,
        }
      });

      panels.forEach((panel) => {
        // Animasi clip path menggunakan segitiga
        // Dari titik kecil di tengah bawah
        // Ke segitiga raksasa yang menutupi seluruh layar
        tl.to(panel, {
          clipPath: "polygon(50% -150%, 250% 100%, -150% 100%)",
          ease: "none",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main ref={containerRef} className="relative w-full h-screen overflow-hidden">
        <HeroSection />
        <TimelineSection />
        <CompetitionSection />
        <AboutUsSection />
      </main>
    </>
  );
}
