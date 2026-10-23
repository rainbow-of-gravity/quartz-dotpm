import { defineConfig } from "vitest/config";
import { dotpmAlias } from "./scripts/dotpm-paths.mjs";

export default defineConfig({
  resolve: { alias: dotpmAlias },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    reporters: ["default"],
  },
});
