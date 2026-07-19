import type { Metadata } from "next";
import { Montserrat, Poppins, Anton } from "next/font/google";
import "./globals.css";
import { AnimatedBackground } from "./(utils)/components/layout/AnimatedBackground";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Tech Innovation Paper 2026",
  description:
    "Pendaftaran Tech Innovation Paper 2026 oleh LPKTA dan Cendekia Teknika",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${montserrat.variable} ${poppins.variable} ${anton.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
