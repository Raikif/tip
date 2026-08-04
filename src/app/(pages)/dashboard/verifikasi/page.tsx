"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Info } from "lucide-react";

export default function AdminVerifikasiPage() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { getAllTeams } = await import("@/app/lib/action/users");
      const all = await getAllTeams();
      setPending(all.filter((t: any) => t.status === "pending"));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
        Verifikasi Tim
      </h1>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/60">Loading...</div>
        ) : pending.length === 0 ? (
          <div className="p-12 text-center text-white/50">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-300/50" />
            <p className="text-lg font-medium">Semua tim telah diverifikasi!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20 bg-white/5">
                  <th className="text-left p-4 font-bold text-sm text-white/70">
                    Tim
                  </th>
                  <th className="text-left p-4 font-bold text-sm text-white/70">
                    Kategori
                  </th>
                  <th className="text-left p-4 font-bold text-sm text-white/70 hidden md:table-cell">
                    Ketua
                  </th>
                  <th className="text-right p-4 font-bold text-sm text-white/70">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {pending.map((team) => (
                  <tr
                    key={team.teamName}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <Link
                        href={`/dashboard/teams/${team.teamName}`}
                        className="font-bold hover:text-yellow-300 transition-colors"
                      >
                        {team.teamName}
                      </Link>
                    </td>

                    <td className="p-4 text-white/80 uppercase text-sm">
                      {team.category}
                    </td>

                    <td className="p-4 text-white/70 hidden md:table-cell">
                      {team.leaderName}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/teams/${team.teamName}`}
                          className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 transition-all"
                          title="Detail"
                        >
                          <Info size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )
    </div>
  );
}
