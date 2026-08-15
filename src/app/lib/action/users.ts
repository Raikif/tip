"use server";

import bcrypt from "bcryptjs";
import { getFirebaseAdminDb } from "../server/firebase";
import { getSession } from "../server/auth/sessions";
import type { UserRole } from "@/app/(utils)/types/user";
import { canAdvance, type TeamStage } from "@/app/(utils)/lib/teamStage";

async function requireAdmin() {
  const cookie = await getSession();
  if (!cookie) throw new Error("Unauthorized");
  const { decrypt } = await import("../server/auth/sessions");
  const session = await decrypt(cookie.value);
  if (!session || session.user_role !== "admin") throw new Error("Forbidden");
  return session;
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}) {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const hash = bcrypt.hashSync(data.password, 10);
  const ref = db.ref("users").push();
  await ref.set({
    email: data.email,
    password: hash,
    name: data.name,
    role: data.role,
    createdAt: new Date().toISOString(),
  });
  return { ok: true, id: ref.key };
}

export async function getUsers() {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("users").once("value");
  const data = snapshot.val() as Record<
    string,
    {
      email: string;
      password: string;
      name: string;
      role: string;
      createdAt: string;
    }
  > | null;
  if (!data) return [];
  return Object.entries(data).map(([id, u]) => ({
    id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
  }));
}

export async function updateUser(
  id: string,
  data: { email?: string; name?: string; role?: UserRole; password?: string },
) {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const updates: Record<string, string> = {};

  if (data.email !== undefined) updates.email = data.email;
  if (data.name !== undefined) updates.name = data.name;
  if (data.role !== undefined) updates.role = data.role;
  if (data.password && data.password.length > 0) {
    updates.password = bcrypt.hashSync(data.password, 10);
  }

  if (Object.keys(updates).length === 0) return { ok: true };

  await db.ref(`users/${id}`).update(updates);
  return { ok: true };
}

export async function deleteUser(id: string) {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  await db.ref(`users/${id}`).remove();
  return { ok: true };
}


export async function updateTeamStatus(
  teamId: string,
  status: TeamStage,
) {
  try {
    const session = await requireAdmin();

    const db = getFirebaseAdminDb();
    const teamRef = db.ref(`peserta/${teamId}`);
    const snapshot = await teamRef.once("value");
    if (!snapshot.exists()) {
      return { ok: false, error: "Tim tidak ditemukan." };
    }

    const current = (snapshot.val()?.status || "pending") as TeamStage;

    if (status === "rejected") {
      await teamRef.update({
        status,
        verifiedBy: session.user_name ?? null,
        verifiedAt: new Date().toISOString(),
      });
      return { ok: true };
    }

    if (!canAdvance(current, status)) {
      return {
        ok: false,
        error: `Tidak dapat memindahkan status dari "${current}" ke "${status}".`,
      };
    }

    await teamRef.update({
      status,
      verifiedBy: session.user_name ?? null,
      verifiedAt: new Date().toISOString(),
    });
    return { ok: true };
  } catch (error) {
    console.error("[updateTeamStatus]", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Gagal memperbarui status tim.",
    };
  }
}

export type TeamData = {
  id: string;
  teamName: string;
  status?: string;
  category?: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export async function getAllTeams(): Promise<TeamData[]> {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref("peserta").once("value");
  const data = snapshot.val() as Record<string, any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  const rootKeys = Object.keys(data || {});

  if (!data) {
    console.log("[getAllTeams] peserta not found");
    return [];
  }

  const result: TeamData[] = Object.entries(data).map(([id, rawTeam]) => {
    const team = rawTeam as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      ...team,
      id,
      teamName:
        typeof team.teamName === "string" && team.teamName.trim()
          ? team.teamName
          : id,
    };
  });

  console.log(
    "[getAllTeams] peserta exists:",
    !!data,
    "root keys count:",
    rootKeys.length,
    "sample keys:",
    rootKeys.slice(0, 5),
    "mapped:",
    result.slice(0, 2),
  );

  return result;
}

export async function getTeamByTeamName(
  teamName: string,
): Promise<TeamData | null> {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  console.log("[getTeamByTeamName] input:", teamName);

  const directSnapshot = await db.ref(`peserta/${teamName}`).once("value");
  if (directSnapshot.exists()) {
    const data = directSnapshot.val() as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    console.log("[getTeamByTeamName] direct hit by key:", teamName);
    return {
      ...data,
      id: directSnapshot.key ?? teamName,
      teamName:
        typeof data.teamName === "string" && data.teamName.trim()
          ? data.teamName
          : directSnapshot.key ?? teamName,
    };
  }

  const snapshot = await db.ref("peserta").once("value");
  const data = snapshot.val() as Record<string, any> | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!data) {
    console.log("[getTeamByTeamName] peserta not found");
    return null;
  }

  const entry = Object.entries(data).find(
    ([, v]) => (v?.teamName || "").trim().toLowerCase() === teamName.trim().toLowerCase(),
  );

  if (!entry) {
    console.log("[getTeamByTeamName] no match for:", teamName, "available keys:", Object.keys(data).slice(0, 10));
    return null;
  }

  const [id] = entry;
  const team = entry[1] as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  console.log("[getTeamByTeamName] fallback hit:", id);
  return {
    ...team,
    id,
    teamName:
      typeof team.teamName === "string" && team.teamName.trim()
        ? team.teamName
        : id,
  };
}

const TEAM_EDITABLE_FIELDS = [
  "category",
  "institution",
  "leaderName",
  "leaderNim",
  "leaderWa",
  "leaderEmail",
  "member1Name",
  "member1Nim",
  "member1Wa",
  "member1Email",
  "member2Name",
  "member2Nim",
  "member2Wa",
  "member2Email",
  "status",
] as const;

export async function updateTeam(
  teamId: string,
  data: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref(`peserta/${teamId}`).once("value");
  if (!snapshot.exists()) return { ok: false, error: "Tim tidak ditemukan" };

  const updates: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const [key, value] of Object.entries(data)) {
    if ((TEAM_EDITABLE_FIELDS as readonly string[]).includes(key)) {
      updates[key] = value;
    }
  }

  if (Object.keys(updates).length === 0) return { ok: true };

  if (updates.status && typeof updates.status === "string") {
    const current = (snapshot.val()?.status || "pending") as TeamStage;
    const next = updates.status as TeamStage;
    if (!canAdvance(current, next)) {
      return {
        ok: false,
        error: `Tidak dapat memindahkan status dari "${current}" ke "${next}".`,
      };
    }
  }

  await db.ref(`peserta/${teamId}`).update(updates);
  return { ok: true };
}

export async function deleteTeam(teamId: string) {
  await requireAdmin();

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref(`peserta/${teamId}`).once("value");
  if (!snapshot.exists()) return { ok: false, error: "Tim tidak ditemukan" };

  await db.ref(`peserta/${teamId}`).remove();
  return { ok: true };
}
