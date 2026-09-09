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
  let bodyContent = bodyContentMatch ? bodyContentMatch[1] : html;

  // Remover cualquier etiqueta script estática de chatac para inyectarla de forma dinámica y reactiva en el cliente
  bodyContent = bodyContent.replace(/<script[^>]*chatac[^>]*>[\s\S]*?<\/script>/gi, "");

  return <LandingPageClient htmlContent={bodyContent} />;
}
