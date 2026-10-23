import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import { isSnapshot } from "@dotpm/api";
import { buildSnapshot, messagesFor } from "../src/snapshot";
import { fixtureVault, loadFixture } from "./helpers";

const vault = loadFixture();
const entry = vault.projects.get("Projects/Alpha/Alpha.md")!;
const colorOf = (path: string) => {
  const text = readFileSync(join(fixtureVault, path), "utf8");
  return (parse(/^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? "") as { color?: string } | null)?.color;
};
const snapshot = buildSnapshot(vault, entry, { locale: "en-US", builtAt: new Date(0), colorOf });

describe("buildSnapshot", () => {
  it("produces a snapshot dotpm's viewer accepts", () => {
    expect(isSnapshot(JSON.parse(JSON.stringify(snapshot)))).toBe(true);
  });

  it("carries every task in tree order with parents", () => {
    const tasks = snapshot.projects[0]!.tasks;
    expect(tasks.map((t) => [t.id, t.parentId])).toEqual([
      ["design-1", null],
      ["sketch-1", "design-1"],
      ["build-1", null],
      ["wire-1", "build-1"],
      ["old-1", null],
    ]);
  });

  it("counts done tasks by the vault's complete statuses, archived ones excluded", () => {
    expect(snapshot.projects[0]).toMatchObject({ taskCount: 4, doneCount: 1 });
  });

  it("starts from the project's default view and the view state dotpm saved", () => {
    expect(snapshot.view.mode).toBe("kanban");
    expect(snapshot.view.sort).toEqual([{ key: "due", dir: "desc" }]);
    expect(snapshot.view.group).toEqual({ field: "priority" });
    expect(snapshot.view.ganttGranularity).toBe("month");
  });

  it("lets the site override the starting view", () => {
    const table = buildSnapshot(vault, entry, {
      locale: "en-US",
      builtAt: new Date(0),
      colorOf,
      defaultView: "table",
    });
    expect(table.view.mode).toBe("table");
  });

  it("embeds the icons the view needs, including status icons and Obsidian's own glyphs", () => {
    expect(snapshot.icons["hammer"]).toMatch(/^<svg/);
    expect(snapshot.icons["right-triangle"]).toMatch(/^<svg/);
    expect(snapshot.icons["layout-dashboard"]).toMatch(/^<svg/);
  });

  it("colors assignees from their person notes", () => {
    expect(snapshot.personColors).toEqual({ "[[People/Ada|Ada]]": "#ff8800" });
  });
});

describe("messagesFor", () => {
  it("returns nothing for English, which the viewer bundles", () => {
    expect(messagesFor("en-US")).toBeNull();
  });

  it("returns the catalog for other languages, by full tag or base language", () => {
    expect(messagesFor("de-DE")).toBe(messagesFor("de"));
    expect(messagesFor("de")).not.toBeNull();
  });
});
