import { NextResponse } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

type RegistrationPayload = {
  category: string;
  teamName: string;
  institution: string;
  leaderName: string;
  leaderNim: string;
  leaderWa: string;
  leaderEmail: string;
  leaderPassword: string;
  member1Name?: string;
  member1Nim?: string;
  member2Name?: string;
  member2Nim?: string;
  leaderKtmFile?: {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
  member1KtmFile?: {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
  member2KtmFile?: {
    url: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  };
};

function requireString(v: unknown, field: string) {
  if (typeof v !== "string" || !v.trim()) {
    throw new Error(`Missing/invalid field: ${field}`);
  }
  return v.trim();
}

export async function POST(req: Request) {
  console.log("[REGISTRATIONS] Route hit, content-type:", req.headers.get("content-type"));
  try {
    const body = (await req.json()) as Partial<RegistrationPayload>;

    const payload: RegistrationPayload = {
      category: requireString(body.category, "category"),
      teamName: requireString(body.teamName, "teamName"),
      institution: requireString(body.institution, "institution"),
      leaderName: requireString(body.leaderName, "leaderName"),
      leaderNim: requireString(body.leaderNim, "leaderNim"),
      leaderWa: requireString(body.leaderWa, "leaderWa"),
      leaderEmail: requireString(body.leaderEmail, "leaderEmail"),
      leaderPassword: requireString(body.leaderPassword, "leaderPassword"),
      member1Name: body.member1Name ? body.member1Name.toString() : "",
      member1Nim: body.member1Nim ? body.member1Nim.toString() : "",
      member2Name: body.member2Name ? body.member2Name.toString() : "",
      member2Nim: body.member2Nim ? body.member2Nim.toString() : "",
      leaderKtmFile: body.leaderKtmFile as RegistrationPayload["leaderKtmFile"] | undefined,
      member1KtmFile: body.member1KtmFile as RegistrationPayload["member1KtmFile"] | undefined,
      member2KtmFile: body.member2KtmFile as RegistrationPayload["member2KtmFile"] | undefined,
    };

    const dataToSave = {
      ...payload,
      registeredAt: new Date().toISOString(),
      status: "pending",
    };

    const db = getFirebaseAdminDb();
    await db.ref(`peserta/${payload.teamName}`).set(dataToSave);

    return NextResponse.json({ ok: true, teamName: payload.teamName }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[REGISTRATIONS ERROR]", message);
    console.error("[REGISTRATIONS STACK]", err instanceof Error ? err.stack : "no stack");
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
