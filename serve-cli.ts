import Bun, { serve } from "bun";
import path from "node:path";

const shouldOpen = Bun.argv.includes("--open");

const args = Bun.argv.slice(2).filter((arg) => arg !== "--open");
const [reportPath, port = 3000] = args;
if (!reportPath) {
  console.error("Usage: bun serve <report.json> [port:3000] [--open]");
  process.exit(1);
}

const reportData = JSON.parse(await Bun.file(reportPath).text());

const distDir = path.join(import.meta.dir, "dist");
const indexHtmlPath = path.join(distDir, "index.html");

serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/report") {
      return Response.json(reportData);
    }

    // Map / -> /index.html, otherwise serve the file from dist
    const filePath =
      url.pathname === "/" ? indexHtmlPath : path.join(distDir, url.pathname);

    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
});

if (shouldOpen) {
  Bun.spawn(["open", `http://localhost:${port}`]);
}

console.log(`Serving report at http://localhost:${port}`);
console.log("Press Ctrl+C to stop.");
