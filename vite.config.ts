import { defineConfig, loadEnv } from "vite";
import { assetpackPlugin } from "./scripts/assetpack-vite-plugin";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [assetpackPlugin()],
    server: {
      port: 8080,
      open: true,
    },
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
      "process.env": env,
    },
    resolve: {
      alias: {
        "@app": path.resolve(__dirname, "./src/app"),
        "@engine": path.resolve(__dirname, "./src/engine"),
        "@components": path.resolve(__dirname, "./src/app/components"),
        "@utils": path.resolve(__dirname, "./src/app/utils"),
        "@screens": path.resolve(__dirname, "./src/app/screens"),
        "@popups": path.resolve(__dirname, "./src/app/popups"),
        "@ui": path.resolve(__dirname, "./src/app/ui"),
      },
    },
  };
});
