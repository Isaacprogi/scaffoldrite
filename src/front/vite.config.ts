import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname), // 👈 THIS fixes everything
  build: {
    outDir: path.resolve(__dirname, "../../dist/front"),
    emptyOutDir: true,
  },
});