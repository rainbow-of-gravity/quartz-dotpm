import { parse, stringify } from "yaml";
import { setYamlCodec } from "@dotpm/core";

let installed = false;

/**
 * dotpm asks its host for a YAML codec (Obsidian's, inside the app). This installs the one
 * dotpm's own test suite runs on; YAML 1.2 keeps `due: 2026-10-16` a string, as Obsidian
 * does. Call before any dotpm parsing.
 */
export function installYamlCodec(): void {
  if (installed) return;
  setYamlCodec({ parse, stringify });
  installed = true;
}
