/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      name: "network-gas-price",
      fileName: "network-gas-price",
    },
    rollupOptions: {
      external: ["isomorphic-unfetch"],
    },
  },
  plugins: [dts()],
  test: {
    mockReset: true,
    coverage: {
      src: ["lib"],
      reporter: ["text", "lcov"],
      all: true,
      exclude: ["lib/**/index.ts", "lib/**/types.ts", "*.d.ts"],
      100: true,
    },
  },
});
