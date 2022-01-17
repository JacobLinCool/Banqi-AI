import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/index.ts"],
    outDir: "lib",
    target: "node16",
    format: ["cjs"],
    clean: true,
    splitting: false,
    sourcemap: options.watch,
    minify: !options.watch,
}));
