"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "lkti", label: "LKTI" },
  { value: "essay", label: "Essay" },
  { value: "poster", label: "Poster" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Terverifikasi" },
  { value: "fullpaper", label: "Lolos Fullpaper" },
  { value: "ppt", label: "Masuk Final" },
  { value: "rejected", label: "Ditolak" },
];

export default function EditTeamPage() {
  const params = useParams();
  const router = useRouter();
  const rawTeamName = params.teamName as string;
  const teamName = rawTeamName ? decodeURIComponent(rawTeamName) : "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    category: "lkti",
    institution: "",
    leaderName: "",
    leaderNim: "",
    leaderWa: "",
    leaderEmail: "",
    member1Name: "",
    member1Nim: "",
    member1Wa: "",
    member1Email: "",
    member2Name: "",
    member2Nim: "",
    member2Wa: "",
    member2Email: "",
    status: "pending",
  });

  useEffect(() => {
    if (!teamName) return;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const { getTeamByTeamName } = await import("@/app/lib/action/users");
        const data = await getTeamByTeamName(teamName);
        if (!data) {
          setErr("Tim tidak ditemukan.");
          setLoading(false);
          return;
        }
        setForm({
          category: data.category || "lkti",
          institution: data.institution || "",
          leaderName: data.leaderName || "",
          leaderNim: data.leaderNim || "",
          leaderWa: data.leaderWa || "",
          leaderEmail: data.leaderEmail || "",
          member1Name: data.member1Name || "",
          member1Nim: data.member1Nim || "",
          member1Wa: data.member1Wa || "",
          member1Email: data.member1Email || "",
          member2Name: data.member2Name || "",
          member2Nim: data.member2Nim || "",
          member2Wa: data.member2Wa || "",
          member2Email: data.member2Email || "",
          status: data.status || "pending",
        });
      } catch {
        setErr("Gagal memuat data tim.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [teamName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setMsg("");

    try {
      const { getTeamByTeamName } = await import("@/app/lib/action/users");
      const current = await getTeamByTeamName(teamName);
      if (!current?.id) {
        setErr("Tim tidak ditemukan.");
        setSaving(false);
        return;
      }
      const { updateTeam } = await import("@/app/lib/action/users");
      const res = await updateTeam(current.id, form);
      if (res.ok) {
        setMsg("Data tim berhasil diperbarui.");
        setTimeout(() => router.push(`/dashboard/teams/${current.id}`), 800);
      } else {
        setErr(res.error || "Gagal memperbarui data.");
      }
    } catch {
      setErr("Terjadi kesalahan server.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center text-white/80">
        <Loader2 size={32} className="animate-spin mr-3" />
        Memuat data tim...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href={`/dashboard/teams/${encodeURIComponent(teamName)}`}
        className="text-white/70 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali ke Detail Tim
      </Link>

      <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300 drop-shadow-md pb-1">
        Edit Tim: {teamName}
      </h1>

      {msg && (
        <div className="bg-green-500/20 text-green-100 border border-green-400/30 p-4 rounded-xl text-sm font-medium">
          {msg}
        </div>
      )}
      {err && (
        <div className="bg-red-500/20 text-red-100 border border-red-400/30 p-4 rounded-xl text-sm font-medium">
          {err}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <p className="text-sm text-white/60 font-medium">Nama Tim (tidak dapat diubah)</p>
            <p className="font-bold text-white/80">{teamName}</p>
          </div>

          <div>
            <label className="text-sm font-bold text-white mb-1 block">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-4 focus:ring-white/20 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="text-slate-900">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-white mb-1 block">Instansi</label>
            <input
              type="text"
              value={form.institution}
              onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))}
              className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              placeholder="Nama instansi"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-white mb-1 block">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-4 focus:ring-white/20 cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className="text-slate-900">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-sm pb-1 mb-4">
            Ketua Tim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-white mb-1 block">Nama Ketua</label>
              <input
                type="text"
                value={form.leaderName}
                onChange={(e) => setForm((p) => ({ ...p, leaderName: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">NIM Ketua</label>
              <input
                type="text"
                value={form.leaderNim}
                onChange={(e) => setForm((p) => ({ ...p, leaderNim: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">WA Ketua</label>
              <input
                type="text"
                value={form.leaderWa}
                onChange={(e) => setForm((p) => ({ ...p, leaderWa: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">Email Ketua</label>
              <input
                type="email"
                value={form.leaderEmail}
                onChange={(e) => setForm((p) => ({ ...p, leaderEmail: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h2 className="text-lg font-black text-white/80 drop-shadow-sm pb-1 mb-4">Anggota 1</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-white mb-1 block">Nama Anggota 1</label>
              <input
                type="text"
                value={form.member1Name}
                onChange={(e) => setForm((p) => ({ ...p, member1Name: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">NIM Anggota 1</label>
              <input
                type="text"
                value={form.member1Nim}
                onChange={(e) => setForm((p) => ({ ...p, member1Nim: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">WA Anggota 1</label>
              <input
                type="text"
                value={form.member1Wa}
                onChange={(e) => setForm((p) => ({ ...p, member1Wa: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">Email Anggota 1</label>
              <input
                type="email"
                value={form.member1Email}
                onChange={(e) => setForm((p) => ({ ...p, member1Email: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h2 className="text-lg font-black text-white/80 drop-shadow-sm pb-1 mb-4">Anggota 2</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-white mb-1 block">Nama Anggota 2</label>
              <input
                type="text"
                value={form.member2Name}
                onChange={(e) => setForm((p) => ({ ...p, member2Name: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">NIM Anggota 2</label>
              <input
                type="text"
                value={form.member2Nim}
                onChange={(e) => setForm((p) => ({ ...p, member2Nim: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">WA Anggota 2</label>
              <input
                type="text"
                value={form.member2Wa}
                onChange={(e) => setForm((p) => ({ ...p, member2Wa: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-white mb-1 block">Email Anggota 2</label>
              <input
                type="email"
                value={form.member2Email}
                onChange={(e) => setForm((p) => ({ ...p, member2Email: e.target.value }))}
                className="w-full h-10 px-4 rounded-[0.8rem] bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold rounded-[1rem] transition-all disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            <Save size={18} />
            Simpan Perubahan
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-bold rounded-[1rem] transition-all"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
