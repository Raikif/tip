import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/server/auth/sessions";
import { getFirebaseAdminDb } from "@/app/lib/server/firebase";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const cookie = await getSession();
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { decrypt } = await import("@/app/lib/server/auth/sessions");
  const session = await decrypt(cookie.value);
  if (!session || session.user_role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("peserta").once("value");
  const data = snapshot.val() as Record<string, any> | null;

  if (!data) {
    return NextResponse.json({ error: "No data" }, { status: 404 });
  }

  const teams = Object.entries(data).map(([id, raw]) => {
    const team = raw as Record<string, any>;
    return {
      id,
      teamName: typeof team.teamName === "string" ? team.teamName : id,
      category: typeof team.category === "string" ? team.category : "",
      institution: typeof team.institution === "string" ? team.institution : "",
      leaderName: typeof team.leaderName === "string" ? team.leaderName : "",
      leaderNim: typeof team.leaderNim === "string" ? team.leaderNim : "",
      leaderEmail: typeof team.leaderEmail === "string" ? team.leaderEmail : "",
      leaderWa: typeof team.leaderWa === "string" ? team.leaderWa : "",
      member1Name: typeof team.member1Name === "string" ? team.member1Name : "",
      member1Nim: typeof team.member1Nim === "string" ? team.member1Nim : "",
      member2Name: typeof team.member2Name === "string" ? team.member2Name : "",
      member2Nim: typeof team.member2Nim === "string" ? team.member2Nim : "",
      status: typeof team.status === "string" ? team.status : "pending",
    };
  });

  const categoryOrder: Record<string, number> = { lkti: 1, essay: 2, poster: 3 };
  teams.sort((a, b) => {
    const ca = categoryOrder[a.category] ?? 99;
    const cb = categoryOrder[b.category] ?? 99;
    if (ca !== cb) return ca - cb;
    return a.teamName.localeCompare(b.teamName);
  });

  const headers = [
    "Kategori",
    "Nama Tim",
    "Instansi",
    "Email Ketua",
    "Nama Ketua",
    "NIM Ketua",
    "WA Ketua",
    "Nama Anggota 1",
    "NIM Anggota 1",
    "Nama Anggota 2",
    "NIM Anggota 2",
    "Status",
  ];

  const categoryLabels: Record<string, string> = {
    lkti: "Karya Tulis Ilmiah (Mahasiswa)",
    essay: "Essay (Mahasiswa)",
    poster: "Desain Poster (SMA/Sederajat)",
  };

  const rows: string[] = [];
  rows.push(headers.map(escapeCsv).join(","));

  let lastCategory = "";
  for (const team of teams) {
    if (team.category !== lastCategory) {
      lastCategory = team.category;
      const label = categoryLabels[team.category] || team.category;
      rows.push(`"--- KATEGORI: ${label} ---"`);
    }
    rows.push(
      [
        team.category,
        team.teamName,
        team.institution,
        team.leaderEmail,
        team.leaderName,
        team.leaderNim,
        team.leaderWa,
        team.member1Name,
        team.member1Nim,
        team.member2Name,
        team.member2Nim,
        team.status,
      ]
        .map(escapeCsv)
        .join(","),
    );
  }

  const csv = rows.join("\n");
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `data-tim-${timestamp}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
