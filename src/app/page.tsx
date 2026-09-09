import fs from "fs";
import path from "path";

export default function HomePage() {
  const filePath = path.join(process.cwd(), "index.html");
  let html = "";
  try {
    html = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error("Error loading index.html:", err);
  }

  // Extraer el contenido de body y scripts
  const bodyContentMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyContentMatch ? bodyContentMatch[1] : html;

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: bodyContent,
      }}
    />
  );
}
