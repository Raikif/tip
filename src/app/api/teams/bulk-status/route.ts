import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/server/auth/sessions";
import { getFirebaseAdminDb } from "@/app/lib/server/firebase";
import { canAdvance, type TeamStage } from "@/app/(utils)/lib/teamStage";

export const runtime = "nodejs";

interface BulkStatusBody {
  teamIds: string[];
  status: TeamStage;
}

export async function POST(request: Request) {
  try {
    const cookie = await getSession();
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { decrypt } = await import("@/app/lib/server/auth/sessions");
    const session = await decrypt(cookie.value);
    if (!session || session.user_role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as BulkStatusBody;
    const { teamIds, status } = body;

    if (!Array.isArray(teamIds) || teamIds.length === 0) {
      return NextResponse.json({ error: "Daftar tim kosong." }, { status: 400 });
    }

    if (!status || !["pending", "verified", "fullpaper", "ppt", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }

    const db = getFirebaseAdminDb();
    const results: Array<{ teamId: string; ok: boolean; error?: string }> = [];

    for (const teamId of teamIds) {
      try {
        const teamRef = db.ref(`peserta/${teamId}`);
        const snapshot = await teamRef.once("value");
        if (!snapshot.exists()) {
          results.push({ teamId, ok: false, error: "Tim tidak ditemukan." });
          continue;
        }

        const current = (snapshot.val()?.status || "pending") as TeamStage;

        if (status === "rejected") {
          await teamRef.update({
            status,
            verifiedBy: session.user_name ?? null,
            verifiedAt: new Date().toISOString(),
          });
          results.push({ teamId, ok: true });
          continue;
        }

        if (!canAdvance(current, status)) {
          results.push({
            teamId,
            ok: false,
            error: `Tidak dapat memindahkan status dari "${current}" ke "${status}".`,
          });
          continue;
        }

        await teamRef.update({
          status,
          verifiedBy: session.user_name ?? null,
          verifiedAt: new Date().toISOString(),
        });
        results.push({ teamId, ok: true });
      } catch (err) {
        results.push({
          teamId,
          ok: false,
          error: err instanceof Error ? err.message : "Gagal memperbarui.",
        });
      }
    }

    const succeeded = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok);

    return NextResponse.json({
      ok: true,
      summary: {
        total: teamIds.length,
        succeeded,
        failed: failed.length,
      },
      results,
      errors: failed.length > 0 ? failed.map((f) => f.error) : undefined,
    });
  } catch (error) {
    console.error("[bulk-status] Unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
