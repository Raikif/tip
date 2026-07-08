"use client";

import { Navigation } from "@/components/layout/Navigation";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

import { AnimatedBackground } from "@/components/layout/AnimatedBackground";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasNav = pathname !== "/" && pathname !== "/login";

  return (
    <>
      <AnimatedBackground />
      <Navigation />
      <main className="flex-1 w-full flex flex-col min-h-screen relative z-0">
        {children}
      </main>
    </>
  );
}
