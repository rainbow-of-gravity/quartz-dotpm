// Where dotpm's packages live in the vendor/obsidian-pm submodule. Shared by tsup.config.ts
// (build-time code) and scripts/build-viewer.mjs (browser viewer) so both bundle the same source.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const vendorDir = join(dirname(fileURLToPath(import.meta.url)), "../vendor/obsidian-pm");

export const dotpmAlias = {
  "@dotpm/api": join(vendorDir, "packages/api/src/index.ts"),
  "@dotpm/core": join(vendorDir, "packages/core/src/index.ts"),
  "@dotpm/ui": join(vendorDir, "packages/ui/src/index.ts"),
  "@dotpm/ui/dom-shim": join(vendorDir, "packages/ui/src/dom-shim.ts"),
  "@dotpm/ui/dom-platform": join(vendorDir, "packages/ui/src/dom-platform.ts"),
};

// Bare imports inside the vendored sources resolve from the submodule's own node_modules.
export const dotpmNodePaths = [
  join(vendorDir, "node_modules"),
  join(vendorDir, "packages/ui/node_modules"),
];
