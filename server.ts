import { file, serve } from "bun";

const BASE_PATH = "./dist";

serve({
  port: 8080,
  async fetch(req) {
    let filePath = BASE_PATH + new URL(req.url).pathname;

    // Handle index routes
    if (filePath.endsWith("/")) {
      filePath += "index.html";
    }

    return new Response(file(filePath));
  },
  error() {
    return new Response(null, { status: 404 });
  },
});
