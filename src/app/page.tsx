import fs from "fs";
import path from "path";
import LandingPageClient from "./LandingPageClient";

export default function HomePage() {
  const filePath = path.join(process.cwd(), "index.html");
  let html = "";
  try {
    html = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error("Error loading index.html:", err);
  }

  // Extraer el contenido de body
  const bodyContentMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyContentMatch ? bodyContentMatch[1] : html;

  return <LandingPageClient htmlContent={bodyContent} />;
}
