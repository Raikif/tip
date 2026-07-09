import { NextResponse } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

type FileMeta = {
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileId?: string;
  webViewLink?: string;
};

type AbstrakPayload = {
  teamName: string;
  subtema: string;
  title: string;
  file?: FileMeta;
};

function requireNonEmptyString(v: unknown, field: string) {
  if (typeof v !== "string" || !v.trim()) {
    throw new Error(`Missing/invalid field: ${field}`);
  }
  return v.trim();
}

export async function POST(req: Request) {
  console.log("[ABSTRAK_SUBMIT] Route hit, content-type:", req.headers.get("content-type"));
  try {
    const body = (await req.json()) as Partial<AbstrakPayload>;

    const payload: AbstrakPayload = {
      teamName: requireNonEmptyString(body.teamName, "teamName"),
      subtema: requireNonEmptyString(body.subtema, "subtema"),
      title: requireNonEmptyString(body.title, "title"),
      file: body.file && typeof body.file === "object" ? (body.file as FileMeta) : undefined,
    };

    const db = getFirebaseAdminDb();

    console.log("[ABSTRAK_SUBMIT] Looking up peserta for teamName:", payload.teamName);
    const snapshot = await db.ref("peserta").once("value");
    const data = snapshot.val() as Record<string, { teamName?: string }> | null;

    if (!data) {
      return NextResponse.json({ ok: false, error: "No peserta found" }, { status: 404 });
    }

    const target = Object.entries(data).find(
      ([, value]) => (value?.teamName || "").trim().toLowerCase() === payload.teamName.toLowerCase()
    );

    if (!target) {
      return NextResponse.json(
        { ok: false, error: "Registration not found for this teamName" },
        { status: 404 }
      );
    }

    const [registrationId] = target;
    console.log("[ABSTRAK_SUBMIT] Found peserta id:", registrationId);

    const abstrakData = {
      subtema: payload.subtema,
      title: payload.title,
      submittedAt: new Date().toISOString(),
      status: "submitted",

      file: payload.file
        ? {
            fileName: payload.file.fileName,
            fileSize: payload.file.fileSize,
            fileType: payload.file.fileType,
            fileId: payload.file.fileId,
            webViewLink: payload.file.webViewLink,
          }
        : null,
    };

    await db.ref(`peserta/${registrationId}/abstrak`).set(abstrakData);

    return NextResponse.json({ ok: true, teamName: payload.teamName }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
