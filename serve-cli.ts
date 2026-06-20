import Bun, { serve } from "bun";
import path from "node:path";

const shouldOpen = Bun.argv.includes("--open");

const args = Bun.argv.slice(2).filter((arg) => arg !== "--open");
const [reportPath, port = 3000] = args;
if (!reportPath) {
  console.error("Usage: bun serve <report.json> [port:3000] [--open]");
  process.exit(1);
}

const reportFile = Bun.file(reportPath);
const reportData = JSON.parse(await reportFile.text());
const reportLastModified = new Date(reportFile.lastModified).toUTCString();

const distDir = path.join(import.meta.dir, "dist");
const indexHtmlPath = path.join(distDir, "index.html");

serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/report") {
      return Response.json(reportData, {
        headers: {
          "Last-Modified": reportLastModified,
          "Cache-Control": "no-store",
        },
      });
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
  // Append a unique query so the browser reloads the page instead of just
  // re-focusing an existing tab (which would keep showing a previous report).
  Bun.spawn(["open", `http://localhost:${port}/?t=${Date.now()}`]);
}

console.log(`Serving report at http://localhost:${port}`);
console.log("Press Ctrl+C to stop.");
