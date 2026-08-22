"use server";

import bcrypt from "bcryptjs";
import { getFirebaseAdminDb } from "../server/firebase";
import { createSession } from "../server/auth/sessions";
import { loginFormSchema } from "@/app/(utils)/zod/auth";
import { headers } from "next/headers";
import { isStage, type TeamStage } from "@/app/(utils)/lib/teamStage";

type UploadedFile = {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
};

export async function loginUser(formData: FormData) {
  try {
    const val = loginFormSchema.safeParse(Object.fromEntries(formData));

    if (!val.success) {
      return { message: val.error.message };
    }

    const db = getFirebaseAdminDb();
    const email = val.data.email;
    const password = val.data.password;

    const usersSnapshot = await db.ref("users").once("value");
    const users = usersSnapshot.val() as Record<
      string,
      { email: string; password: string; name: string; role: string }
    > | null;

    if (users) {
      const found = Object.entries(users).find(
        ([, u]) =>
          u.email === email && bcrypt.compareSync(password, u.password),
      );
      if (found) {
        const [, userData] = found;
        await createSession({
          user_id: email,
          user_name: userData.name,
          user_role: userData.role as "admin" | "juri",
        });
        return { redirect: "/dashboard" };
      }
    }

    const pesertaSnapshot = await db.ref("peserta").once("value");
    const peserta = pesertaSnapshot.val();

    if (!peserta) {
      return { message: "Email atau password salah" };
    }

    const user = (Object.values(peserta) as Array<Record<string, string>>).find(
      (item) =>
        item.leaderEmail === email &&
        item.leaderPassword &&
        bcrypt.compareSync(password, item.leaderPassword),
    );

    if (!user) {
      return { message: "Email atau password salah" };
    }

    if (isStage((user.status as TeamStage) || "pending", "rejected")) {
      return { message: "Tim Anda telah ditolak. Silakan hubungi panitia." };
    }

    await createSession({
      user_id: user.leaderEmail,
      user_name: user.teamName,
      user_role: "guest",
      category: user.category || "",
      team_status: (user.status as string) || "pending",
    });

    return { redirect: "/dashboard" };
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return { message: "Terjadi kesalahan server" };
  }
}

export async function registerUser(_data?: Record<string, any>) {
  return {
    ok: false,
    error: "Pendaftaran telah resmi ditutup karena telah melewati batas waktu pendaftaran.",
  };
}

export async function logoutUser() {
  const { deleteSession } = await import("../server/auth/sessions");
  await deleteSession();
}

export async function getCurrentUser() {
  const { getSessionUser } = await import("../server/auth/sessions");
  return getSessionUser();
}

export async function getMyTeam() {
  const { getSessionUser } = await import("../server/auth/sessions");
  const session = await getSessionUser();
  if (!session || session.user_role !== "guest") return null;

  const db = getFirebaseAdminDb();
  const snapshot = await db.ref(`peserta/${session.user_name}`).once("value");
  const data = snapshot.val();
  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { leaderPassword, ...safe } = data;
  return safe;
}
