import { NextResponse } from "next/server";

const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY || "";
const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID || "";
const ADMIN_EMAILS = [
  (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "gonsalcedod@gmail.com").toLowerCase().trim(),
  "gonzsalcedod@gmail.com",
];

async function verifyIsAdmin(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const idToken = authHeader.substring(7).trim();
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!idToken || !apiKey) return false;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    const email = data.users?.[0]?.email?.toLowerCase().trim();
    return !!email && ADMIN_EMAILS.includes(email);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // Protección estricta: Solo el maestro/admin puede crear o subir videos
    const isAuthorized = await verifyIsAdmin(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Acceso no autorizado. Se requieren credenciales de administrador." },
        { status: 403 }
      );
    }

    if (!BUNNY_API_KEY || !LIBRARY_ID) {
      return NextResponse.json(
        { error: "Faltan credenciales de Bunny.net en las variables del servidor." },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    // 1. Solicitud JSON: crea el registro de video y devuelve la URL para subida directa del cliente a Bunny.net
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const title = body.title || "Lección Curso Tutores";

      const createRes = await fetch(
        `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
        {
          method: "POST",
          headers: {
            AccessKey: BUNNY_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        }
      );

      if (!createRes.ok) {
        const err = await createRes.text();
        console.error("Bunny create video error:", err);
        return NextResponse.json({ error: "No se pudo crear el video en Bunny.net" }, { status: 500 });
      }

      const videoData = await createRes.json();
      const videoId = videoData.guid;
      const embedUrl = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`;

      return NextResponse.json({
        success: true,
        videoId,
        embedUrl,
        uploadUrl: `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`,
        apiKey: BUNNY_API_KEY,
      });
    }

    // 2. Solicitud multipart/form-data: subida del archivo vía buffer
    const formData = await req.formData();
    const file = formData.get("video") as File;
    const title = (formData.get("title") as string) || file?.name || "Lección Curso Tutores";

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo de video." }, { status: 400 });
    }

    const createRes = await fetch(
      `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      }
    );

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error("Bunny create video error:", err);
      return NextResponse.json({ error: "Fallo al inicializar video en Bunny.net" }, { status: 500 });
    }

    const videoData = await createRes.json();
    const videoId = videoData.guid;

    const fileBuffer = await file.arrayBuffer();

    const uploadRes = await fetch(
      `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${videoId}`,
      {
        method: "PUT",
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": "application/octet-stream",
        },
        body: fileBuffer,
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error("Bunny upload error:", err);
      return NextResponse.json({ error: "Fallo al transferir video a Bunny.net" }, { status: 500 });
    }

    const embedUrl = `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${videoId}`;

    return NextResponse.json({
      success: true,
      videoId,
      embedUrl,
      title,
    });
  } catch (error: any) {
    console.error("Upload video route error:", error);
    return NextResponse.json({ error: error?.message || "Error interno al subir video" }, { status: 500 });
  }
}
