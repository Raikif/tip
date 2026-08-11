"use server";

import { getFirebaseAdminDb } from "../server/firebase";
import { getSessionUser } from "../server/auth/sessions";

export async function getTeamsWithSubmissions() {
  const session = await getSessionUser();
  if (!session || (session.user_role !== "admin" && session.user_role !== "juri")) {
    throw new Error("Forbidden");
  }

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("peserta").once("value");
  const data = snapshot.val() as Record<string, any> | null;
  if (!data) return [];

  const raw = Object.entries(data)
    .filter(([, team]) => team.abstrak || team.poster || team.fullpaper || team.ppt)
    .map(([id, team]) => ({
      id,
      teamName:
        typeof team.teamName === "string" && team.teamName.trim()
          ? team.teamName
          : id,
      category: team.category,
      institution: team.institution,
      leaderName: team.leaderName,
      abstrak: team.abstrak,
      poster: team.poster,
      fullpaper: team.fullpaper,
      ppt: team.ppt,
      penilaian: team.penilaian || {},
    }));

  return raw;
}

export async function submitScore(data: {
  teamName: string;
  skor: number;
  catatan: string;
}) {
  const session = await getSessionUser();
  if (!session || session.user_role !== "juri") {
    return { ok: false, error: "Unauthorized" };
  }

  const db = getFirebaseAdminDb();
  await db.ref(`peserta/${data.teamName}/penilaian/${session.user_id}`).set({
    skor: data.skor,
    catatan: data.catatan,
    submittedAt: new Date().toISOString(),
    juriName: session.user_name,
  });
  return { ok: true };
}
