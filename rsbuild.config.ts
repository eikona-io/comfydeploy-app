import path from "node:path";
import { defineConfig, rspack } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { RsdoctorRspackPlugin } from "@rsdoctor/rspack-plugin";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

export default defineConfig({
  plugins: [pluginReact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@repo": path.resolve(__dirname, "./src/repo"),
    },
  },
  source: {
    entry: { index: "./src/main.tsx" },
  },
  html: {
    template: "./index.html",
  },
  tools: {
    rspack: {
      // experiments: {
      //   css: true,
      // },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: {
                      tailwindcss: {},
                      autoprefixer: {},
                    },
                  },
                },
              },
            ],
            type: "javascript/auto",
          },
        ],
      },
      plugins: [
        new rspack.EnvironmentPlugin([
          "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",

          "NEXT_PUBLIC_POSTHOG_HOST",
          "NEXT_PUBLIC_POSTHOG_KEY",

          "NEXT_PUBLIC_CD_API_URL",

          "COMFYUI_FRONTEND_URL",

          "COMFY_DEPLOY_SHARED_MACHINE_API_URL",
        ]),
        TanStackRouterRspack(),
        process.env.RSDOCTOR &&
          new RsdoctorRspackPlugin({
            // plugin options
          }),
      ].filter(Boolean),
    },
  },
});
