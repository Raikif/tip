"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "2rem",
              padding: "2.5rem",
              maxWidth: "28rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😵</div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 900,
                backgroundImage: "linear-gradient(to right, #fecaca, #f87171)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: "0.75rem",
              }}
            >
              Terjadi Kesalahan
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
                marginBottom: "2rem",
              }}
            >
              Ada masalah saat memuat aplikasi. Silakan muat ulang halaman.
            </p>
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 2rem",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "1rem",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
