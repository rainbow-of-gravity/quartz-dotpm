import { readdirSync, statSync } from "fs";
import { join, relative, sep } from "path";
import { fileURLToPath } from "url";
import { loadVault } from "../src/vault";

export const fixtureVault = fileURLToPath(new URL("./fixtures/vault", import.meta.url));

/** Every Markdown note under the fixture vault, as Quartz would list them (dotfolders skipped). */
export function fixturePaths(exclude: string[] = []): string[] {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((name) => {
      if (name.startsWith(".")) return [];
      const path = join(dir, name);
      if (statSync(path).isDirectory()) return walk(path);
      return path.endsWith(".md") ? [relative(fixtureVault, path).split(sep).join("/")] : [];
    });
  return walk(fixtureVault).filter((path) => !exclude.includes(path));
}

/** The fixture vault with its draft task left unpublished, as a draft filter would. */
export function loadFixture() {
  return loadVault({
    contentDir: fixtureVault,
    configDir: ".obsidian",
    publishedPaths: fixturePaths(["Projects/Alpha/_tasks/draft.md"]),
  });
}
