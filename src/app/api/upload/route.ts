import { NextResponse } from "next/server";
import { google } from "googleapis";

const SHARED_DRIVE_ID = process.env.GOOGLE_SHARED_DRIVE_ID || "0AEaFBbi13uiRUk9PVA";

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  console.log("[UPLOAD AUTH] clientEmail present:", !!clientEmail, "privateKey present:", !!privateKey);
  if (!clientEmail || !privateKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL dan GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY belum diset.");
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  console.log("[UPLOAD] Route hit, content-type:", req.headers.get("content-type"));
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ ok: false, error: "Content-Type harus multipart/form-data" }, { status: 400 });
    }

    console.log("[UPLOAD] About to call req.formData()");
    const formData = await req.formData();
    console.log("[UPLOAD] req.formData() done, file count:", formData.get("file") ? 1 : 0);
    const file = formData.get("file");
    const teamName = (formData.get("teamName") as string | null)?.trim() || "unknown";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "File tidak ditemukan." }, { status: 400 });
    }

    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });

    const safeTeam = teamName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${Date.now()}_${file.name}`;

    let folderId = SHARED_DRIVE_ID;

    try {
      const searchRes = await drive.files.list({
        q: `name='${safeTeam.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and '${SHARED_DRIVE_ID}' in parents and trashed=false`,
        fields: "files(id, name)",
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
        corpora: "drive",
        driveId: SHARED_DRIVE_ID,
      });

      const existing = searchRes.data.files?.find((f) => f.name === safeTeam);
      if (existing?.id) {
        folderId = existing.id;
      } else {
        // @ts-expect-error - googleapis overload issue
        const folderRes = await drive.files.create({
          requestBody: {
            name: safeTeam,
            mimeType: "application/vnd.google-apps.folder",
            parents: [SHARED_DRIVE_ID],
          },
          fields: "id",
          supportsAllDrives: true,
          corpora: "drive",
          driveId: SHARED_DRIVE_ID,
        });
        folderId = (folderRes as { data: { id?: string } }).data.id || folderId;
      }
    } catch (err) {
      console.error("Gagal membuat/mencari folder tim:", err);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const boundary = `-------${Date.now()}-${Math.random().toString(36).slice(2)}-------`;

    const metadata = {
      name: fileName,
      parents: [folderId],
    };

    const preamble = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
    const closing = `\r\n--${boundary}--`;

    const metadataBytes = Buffer.from(preamble, "utf-8");
    const closingBytes = Buffer.from(closing, "utf-8");
    const contentTypeBytes = Buffer.from(`\r\n--${boundary}\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`, "utf-8");

    const multipartBody = Buffer.concat([metadataBytes, contentTypeBytes, fileBuffer, closingBytes]);

    const authClient = await auth.getClient();
    console.log("[UPLOAD] authClient type:", authClient?.constructor?.name);
    const token = await authClient.getAccessToken();
    console.log("[UPLOAD] accessToken present:", !!token);
    const accessToken = typeof token === "string" ? token : token?.token || "";

    console.log("[UPLOAD] Uploading to Drive, size:", multipartBody.length);
    const uploadRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    const uploadText = await uploadRes.text();
    console.log("[UPLOAD] Drive response status:", uploadRes.status, "body:", uploadText);

    if (!uploadRes.ok) {
      return NextResponse.json({ ok: false, error: `Drive upload failed: ${uploadRes.status} ${uploadText}` }, { status: 500 });
    }

    let uploadJson: Record<string, unknown> = {};
    try { uploadJson = JSON.parse(uploadText); } catch { /* ignore */ }

    const fileId = uploadJson?.id || "";
    const publicUrl = uploadJson?.webViewLink || uploadJson?.webContentLink || "";

    return NextResponse.json({
      ok: true,
      fileId,
      url: publicUrl,
      fileName: uploadJson?.name || file.name,
      fileSize: Number(uploadJson?.size || file.size),
      fileType: uploadJson?.mimeType || file.type,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal upload ke Google Drive.";
    console.error("[UPLOAD ERROR]", err);
    console.error("[UPLOAD STACK]", err instanceof Error ? err.stack : "no stack");
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
