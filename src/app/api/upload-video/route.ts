import { NextResponse } from "next/server";

const BUNNY_API_KEY = process.env.BUNNY_STREAM_API_KEY || "8efbbf40-4c77-4749-862ce33aa610-c1a2-4a8c";
const LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID || "623568";

export async function POST(req: Request) {
  try {
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
