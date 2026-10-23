import { describe, expect, it } from "vitest";
import { flattenTasks } from "@dotpm/core";
import { configFor, makeLinkResolver } from "../src/vault";
import { loadFixture } from "./helpers";

const ALPHA = "Projects/Alpha/Alpha.md";
const LEGACY = "Projects/Legacy.md";

describe("loadVault", () => {
  const vault = loadFixture();
  const alpha = vault.projects.get(ALPHA)!.project;

  it("finds projects by frontmatter, in either folder layout", () => {
    expect([...vault.projects.keys()].sort()).toEqual([ALPHA, LEGACY]);
  });

  it("orders top-level tasks by the project's taskIds, then the rest", () => {
    expect(alpha.tasks.map((t) => t.id)).toEqual(["design-1", "build-1", "old-1"]);
  });

  it("nests subtasks from subtaskIds and re-parents orphans by parentId", () => {
    const design = alpha.tasks.find((t) => t.id === "design-1")!;
    const build = alpha.tasks.find((t) => t.id === "build-1")!;
    expect(design.subtasks.map((t) => t.id)).toEqual(["sketch-1"]);
    expect(build.subtasks.map((t) => t.id)).toEqual(["wire-1"]);
  });

  it("resolves wikilink dependencies to task ids", () => {
    const build = alpha.tasks.find((t) => t.id === "build-1")!;
    expect(build.dependencies).toEqual(["design-1"]);
  });

  it("marks tasks in Archive/ as archived", () => {
    expect(alpha.tasks.find((t) => t.id === "old-1")?.archived).toBe(true);
  });

  it("owns a task note moved out of the task folder through its projectId link", () => {
    expect(vault.taskOwner.get("Notes/moved.md")).toBe(ALPHA);
  });

  it("leaves unpublished task notes out", () => {
    const ids = flattenTasks(alpha.tasks).map((f) => f.task.id);
    expect(ids).not.toContain("draft-1");
  });

  it("reads legacy bare-id references", () => {
    const legacy = vault.projects.get(LEGACY)!.project;
    expect(legacy.tasks.map((t) => t.id)).toEqual(["x-1"]);
    expect(legacy.tasks[0]!.subtasks.map((t) => t.id)).toEqual(["y-1"]);
  });

  it("strips dotpm's generated content from descriptions", () => {
    expect(alpha.description).toBe("The Alpha project ships the thing.");
    expect(alpha.tasks.find((t) => t.id === "design-1")!.description).toBe("Draw it first.");
  });

  it("uses the vault's statuses, keeping unknown ones visible", () => {
    const config = configFor(vault, alpha);
    expect(config.statuses.map((s) => s.label)).toEqual(["Backlog", "Doing", "Shipped", "qa"]);
    expect(config.defaultView).toBe("kanban");
  });

  it("maps each task to its note path", () => {
    expect(vault.taskPaths.get(ALPHA)!.get("sketch-1")).toBe("Projects/Alpha/_tasks/sketch.md");
  });
});

describe("makeLinkResolver", () => {
  const resolve = makeLinkResolver([
    "a/note.md",
    "b/note.md",
    "b/other.md",
    "People/Ada Lovelace.md",
  ]);

  it("prefers the namesake in the source's folder", () => {
    expect(resolve("[[note]]", "b/other.md")).toBe("b/note.md");
  });

  it("resolves paths, aliases, headings and case-insensitively", () => {
    expect(resolve("[[A/Note|Alias]]", "b/other.md")).toBe("a/note.md");
    expect(resolve("[[ada lovelace#Bio]]", "x.md")).toBe("People/Ada Lovelace.md");
    expect(resolve("Ada Lovelace", "x.md")).toBe("People/Ada Lovelace.md");
  });

  it("returns null for a link to nothing", () => {
    expect(resolve("[[missing]]", "a/note.md")).toBeNull();
  });
});
