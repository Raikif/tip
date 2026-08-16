"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Pencil, Trash2, Download, CheckSquare, Square, X, ChevronDown, ExternalLink } from "lucide-react";
import type { TeamData } from "@/app/lib/action/users";
import { isStage, type TeamStage } from "@/app/(utils)/lib/teamStage";

const STATUS_OPTIONS: { value: TeamStage; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Terverifikasi" },
  { value: "fullpaper", label: "Lolos Fullpaper" },
  { value: "ppt", label: "Masuk Final" },
  { value: "rejected", label: "Ditolak" },
];

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionMsg, setActionMsg] = useState("");
  const [actionErr, setActionErr] = useState("");
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<TeamStage>("verified");
  const [isApplying, setIsApplying] = useState(false);
  const [bulkResult, setBulkResult] = useState<{ succeeded: number; failed: number; errors: string[] } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { getAllTeams } = await import("@/app/lib/action/users");
        const data = await getAllTeams();
        setTeams(data);
      } catch {
        setLoadErr("Gagal memuat data tim. Periksa koneksi Anda.");
      }
    }
    load();
  }, []);

  const filtered = teams.filter((t) => {
    const matchSearch =
      t.teamName?.toLowerCase().includes(search.toLowerCase()) ||
      t.leaderEmail?.toLowerCase().includes(search.toLowerCase()) ||
      t.institution?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" || isStage((t.status as TeamStage) || "pending", filter as TeamStage);
    return matchSearch && matchFilter;
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every((t) => selectedIds.has(t.id));
  const someFilteredSelected = filtered.some((t) => selectedIds.has(t.id)) && !allFilteredSelected;

  const statusColor: Record<string, string> = {
    pending: "text-yellow-300 bg-yellow-500/20 border-yellow-400/30",
    verified: "text-green-300 bg-green-500/20 border-green-400/30",
    rejected: "text-red-300 bg-red-500/20 border-red-400/30",
    fullpaper: "text-blue-300 bg-blue-500/20 border-blue-400/30",
    ppt: "text-purple-300 bg-purple-500/20 border-purple-400/30",
  };

  function toggleSelect(teamId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) {
        next.delete(teamId);
      } else {
        next.add(teamId);
      }
      return next;
    });
    setBulkResult(null);
  }

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((t) => next.delete(t.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((t) => next.add(t.id));
        return next;
      });
    }
    setBulkResult(null);
  }

  function clearSelection() {
    setSelectedIds(new Set());
    setBulkResult(null);
  }

  async function handleDelete(teamName: string) {
    if (!confirm(`Hapus tim "${teamName}"? Data yang dihapus tidak dapat dikembalikan.`)) return;
    setActionErr("");
    setActionMsg("");
    try {
      const { deleteTeam } = await import("@/app/lib/action/users");
      const res = await deleteTeam(teamName);
      if (res.ok) {
        setActionMsg(`Tim "${teamName}" berhasil dihapus.`);
        setTeams((prev) => prev.filter((t) => t.teamName !== teamName));
        setTimeout(() => setActionMsg(""), 3000);
      } else {
        setActionErr(res.error || "Gagal menghapus tim.");
      }
    } catch {
      setActionErr("Terjadi kesalahan server.");
    }
  }

  async function handleBulkUpdate() {
    if (selectedIds.size === 0) return;
    setIsApplying(true);
    setActionErr("");
    setActionMsg("");
    setBulkResult(null);
    try {
      const res = await fetch("/api/teams/bulk-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamIds: Array.from(selectedIds),
          status: bulkStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setActionErr(data.error || "Gagal memperbarui status.");
        return;
      }
      setBulkResult({
        succeeded: data.summary.succeeded,
        failed: data.summary.failed,
        errors: data.errors || [],
      });
      setActionMsg(`Berhasil memperbarui ${data.summary.succeeded} tim.`);
      setTimeout(() => setActionMsg(""), 3000);
      setTeams((prev) =>
        prev.map((t) => {
          if (!selectedIds.has(t.id)) return t;
          const result = data.results?.find((r: { teamId: string; ok: boolean }) => r.teamId === t.id);
          if (result?.ok) return { ...t, status: bulkStatus };
          return t;
        })
      );
      setSelectedIds(new Set());
    } catch {
      setActionErr("Terjadi kesalahan server.");
    } finally {
      setIsApplying(false);
    }
  }

  async function handleExport() {
    try {
      const res = await fetch("/api/teams/export");
      if (!res.ok) throw new Error("Gagal mengexport data.");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 10);
      a.download = `data-tim-${timestamp}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      setActionErr("Gagal mengexport data. Pastikan Anda sudah login sebagai admin.");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
        Semua Tim
      </h1>

      {actionMsg && (
        <div className="bg-green-500/20 text-green-100 border border-green-400/30 p-4 rounded-xl text-sm font-medium">
          {actionMsg}
        </div>
      )}
      {actionErr && (
        <div className="bg-red-500/20 text-red-100 border border-red-400/30 p-4 rounded-xl text-sm font-medium">
          {actionErr}
        </div>
      )}
      {loadErr && (
        <div className="bg-red-500/10 border border-red-400/30 text-red-200 p-6 rounded-[1.5rem] text-center">
          <p className="font-bold text-lg mb-2">Gagal memuat data</p>
          <p className="text-white/70 text-sm font-medium">{loadErr}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
          <input
            type="text"
            placeholder="Cari tim, email, atau instansi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-[1rem] bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-white/20"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-12 px-4 rounded-[1rem] bg-white/10 border border-white/20 text-white backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-white/20 cursor-pointer"
        >
          <option value="all" className="text-slate-900">Semua Status</option>
          <option value="pending" className="text-slate-900">Pending</option>
          <option value="verified" className="text-slate-900">Terverifikasi</option>
          <option value="fullpaper" className="text-slate-900">Lolos Fullpaper</option>
          <option value="ppt" className="text-slate-900">Masuk Final</option>
          <option value="rejected" className="text-slate-900">Ditolak</option>
        </select>
        <button
          onClick={handleExport}
          className="h-12 px-6 rounded-[1rem] bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 font-bold flex items-center gap-2 transition-all"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {selectedIds.size > 0 && (
        <div className="sticky top-4 z-30 bg-white/15 backdrop-blur-xl border border-white/25 rounded-[1.5rem] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-white font-bold text-sm whitespace-nowrap">
                {selectedIds.size} tim dipilih
              </span>
              <button
                onClick={clearSelection}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition-all"
                title="Batalkan pilihan"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as TeamStage)}
                  className="h-10 pl-3 pr-8 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer text-sm appearance-none"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-slate-900">
                      Ubah ke: {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={14} />
              </div>
              <button
                onClick={handleBulkUpdate}
                disabled={isApplying}
                className="h-10 px-5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark disabled:opacity-60 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                {isApplying ? "Menyimpan..." : "Terapkan"}
              </button>
            </div>
          </div>
          {bulkResult && (
            <div className="mt-3 text-xs font-medium text-white/80 space-y-1">
              <p>
                Berhasil: <span className="text-green-300">{bulkResult.succeeded}</span> &middot;{" "}
                Gagal: <span className="text-red-300">{bulkResult.failed}</span>
              </p>
              {bulkResult.errors.length > 0 && (
                <ul className="list-disc list-inside text-red-200/90 space-y-0.5">
                  {bulkResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="border-b border-white/20 bg-white/5">
                <th className="text-left p-3 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className="text-white/70 hover:text-white transition-colors"
                    title={allFilteredSelected ? "Batalkan semua" : "Pilih semua yang terlihat"}
                  >
                    {allFilteredSelected ? (
                      <CheckSquare size={16} />
                    ) : someFilteredSelected ? (
                      <CheckSquare size={16} className="text-white/50" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="text-left p-3 font-bold text-xs text-white/70">Tim</th>
                <th className="text-left p-3 font-bold text-xs text-white/70">Kategori</th>
                <th className="text-left p-3 font-bold text-xs text-white/70 hidden md:table-cell">Instansi</th>
                <th className="text-left p-3 font-bold text-xs text-white/70 hidden lg:table-cell">Email</th>
                <th className="text-left p-3 font-bold text-xs text-white/70">Status</th>
                <th className="text-right p-3 font-bold text-xs text-white/70">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-white/50">
                    Tidak ada data tim.
                  </td>
                </tr>
              )}
              {filtered.map((team) => {
                const isSelected = selectedIds.has(team.id);
                return (
                  <tr
                    key={team.teamName}
                    className={`border-b border-white/10 transition-colors ${
                      isSelected ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <td className="p-3">
                      <button
                        onClick={() => toggleSelect(team.id)}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </td>
                    <td className="p-3 font-bold text-xs">{team.teamName}</td>
                    <td className="p-3 text-white/80 uppercase text-xs">{team.category}</td>
                    <td className="p-3 text-white/70 text-xs hidden md:table-cell">{team.institution}</td>
                    <td className="p-3 text-white/70 text-xs hidden lg:table-cell">{team.leaderEmail}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusColor[team.status || "pending"]}`}>
                        {team.status || "pending"}
                      </span>
                    </td>
                    <td className="p-3 text-right flex gap-1.5 justify-end">
                      <Link
                        href={`/dashboard/teams/${encodeURIComponent(team.id)}/edit`}
                        className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-md text-blue-300 transition-all"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(team.id)}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-md text-red-300 transition-all"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                      <Link
                        href={`/dashboard/teams/${encodeURIComponent(team.id)}`}
                        className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-white/70 transition-all"
                        title="Detail"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
