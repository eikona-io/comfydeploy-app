import { file, serve } from "bun";

const BASE_PATH = "./dist";

serve({
  port: 8080,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle API rewrites
    if (url.pathname.startsWith("/api/")) {
      const targetUrl = `https://prod-staging.api.comfydeploy.com${url.pathname}${url.search}`;

      return fetch(targetUrl, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      });
    }

    // Handle static files
    let filePath = BASE_PATH + url.pathname;

    // Handle index routes
    if (filePath.endsWith("/")) {
      filePath += "index.html";
    }

    const fileResponse = await file(filePath).exists();
    if (!fileResponse) {
      // Fallback to index.html for SPA routing
      return new Response(file(BASE_PATH + "/index.html"));
    }

    return new Response(file(filePath));
  },
  error() {
    return new Response(null, { status: 404 });
  },
});
