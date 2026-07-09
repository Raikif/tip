import { NextResponse } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamName = searchParams.get("teamName");

    if (!teamName || !teamName.trim()) {
      return NextResponse.json(
        { ok: false, error: "Missing query param: teamName" },
        { status: 400 }
      );
    }

    const db = getFirebaseAdminDb();
    console.log("[BY_TEAM_NAME] Looking up peserta:", teamName);

    const snapshot = await db.ref("peserta").once("value");
    const data = snapshot.val() as Record<
      string,
      { teamName?: string }
    > | null;

    if (!data) {
      return NextResponse.json({ ok: false, error: "No peserta found" }, { status: 404 });
    }

    const target = Object.entries(data).find(
      ([, value]) => (value?.teamName || "").trim().toLowerCase() === teamName.trim().toLowerCase()
    );

    if (!target) {
      return NextResponse.json(
        { ok: false, error: "Registration not found for this teamName" },
        { status: 404 }
      );
    }

    const [id, value] = target;

    return NextResponse.json({
      ok: true,
      id,
      registration: { ...value, id },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
