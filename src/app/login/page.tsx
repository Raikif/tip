"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan kata sandi harus diisi!");
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("tip_users") || "[]");
      
      // Find matching user safely
      const user = users.find((u: any) => 
        u.leaderEmail && 
        u.leaderEmail.trim().toLowerCase() === email.trim().toLowerCase() && 
        u.leaderPassword === password
      );

      if (user) {
        // Save session
        localStorage.setItem("tip_current_user", JSON.stringify(user));
        // FORCE HARD NAVIGATION
        window.location.href = "/dashboard";
      } else {
        setError("Email atau Password salah, atau akun belum terdaftar.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem saat mencoba login.");
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <Link href="/" className="text-[var(--color-brand-purple)] font-medium hover:underline text-sm flex items-center gap-1 mb-8">
        &larr; Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-entrance">
        <div className="bg-[var(--color-brand-purple)] px-8 py-8 text-center text-white relative">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-bold">Login Dashboard</h1>
          <p className="text-purple-200 text-sm mt-1">Masuk untuk mengelola pendaftaran dan mengumpulkan karya</p>
        </div>

        <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(e); }}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input 
              label="Email Terdaftar" 
              type="email" 
              name="email"
              placeholder="Masukkan email ketua tim" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <Input 
              label="Kata Sandi" 
              type="password" 
              name="password"
              placeholder="Masukkan kata sandi" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <Button type="submit" className="w-full py-3 bg-slate-900 text-white hover:bg-[var(--color-brand-purple)] font-bold transition-colors">
            Masuk ke Dashboard
          </Button>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Belum punya akun? <Link href="/pendaftaran" className="text-[var(--color-brand-purple)] font-bold hover:underline">Daftar sekarang</Link>
            </p>
          </div>
          
          <div className="pt-8 text-center border-t border-slate-100">
            <button 
              type="button"
              onClick={() => {
                if (window.confirm("Apakah Anda yakin ingin menghapus semua data pendaftaran lokal?")) {
                  localStorage.clear();
                  alert("Semua data pendaftaran dan sesi telah dibersihkan!");
                  window.location.reload();
                }
              }}
              className="text-xs text-slate-400 hover:text-red-500 underline"
            >
              Hapus Semua Data (Reset Local Storage)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
