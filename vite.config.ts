import { defineConfig } from "vite";
import { assetpackPlugin } from "./scripts/assetpack-vite-plugin";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [assetpackPlugin()],
  server: {
    port: 8080,
    open: true,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@engine': path.resolve(__dirname, './src/engine'),
      '@components': path.resolve(__dirname, './src/app/components'),
      '@utils': path.resolve(__dirname, './src/app/utils'),
      '@screens': path.resolve(__dirname, './src/app/screens'),
      '@popups': path.resolve(__dirname, './src/app/popups'),
      '@ui': path.resolve(__dirname, './src/app/ui'),
    }
  }
});
