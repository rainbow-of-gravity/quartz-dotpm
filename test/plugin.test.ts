import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import type { FullSlug, GlobalConfiguration, QuartzPluginData } from "@quartz-community/types";
import { Dotpm, stripGeneratedContent } from "../src/plugin";
import { fixtureVault } from "./helpers";

const read = (path: string) => readFileSync(join(fixtureVault, path), "utf8");

describe("stripGeneratedContent", () => {
  it("drops a project's title heading and task list, keeping its prose and frontmatter", () => {
    const out = stripGeneratedContent(read("Projects/Alpha/Alpha.md"));
    expect(out).toContain("pm-project: true");
    expect(out).toContain("The Alpha project ships the thing.");
    expect(out).not.toContain("# 🚀 Alpha");
    expect(out).not.toContain("## Tasks");
  });

  it("drops a task's Project/Parent lines but keeps its subtasks list", () => {
    const out = stripGeneratedContent(read("Projects/Alpha/_tasks/design.md"));
    expect(out).toContain("Draw it first.");
    expect(out).toContain("## Subtasks");
    expect(out).not.toContain("Project: [[");
    expect(stripGeneratedContent(read("Projects/Alpha/_tasks/sketch.md"))).not.toMatch(
      /^(Project|Parent):/m,
    );
  });

  it("leaves other notes untouched", () => {
    const note = "---\ntitle: Hello\n---\n\n# Hello\n\n## Tasks\n";
    expect(stripGeneratedContent(note)).toBe(note);
    expect(stripGeneratedContent("No frontmatter")).toBe("No frontmatter");
  });
});

describe("Dotpm page type", () => {
  const plugin = Dotpm();
  const cfg = {} as GlobalConfiguration;
  const page = (relativePath: string, frontmatter: Record<string, unknown>) => ({
    slug: relativePath.replace(/\.md$/, "") as FullSlug,
    fileData: { relativePath, frontmatter } as unknown as QuartzPluginData,
    cfg,
  });

  it("claims project notes, giving them the `dotpm` layout", () => {
    expect(plugin.layout).toBe("dotpm");
    expect(plugin.match(page("Projects/Alpha/Alpha.md", { "pm-project": true }))).toBe(true);
  });

  it("leaves task notes and project notes inside task folders to content pages", () => {
    expect(plugin.match(page("Projects/Alpha/_tasks/design.md", { "pm-task": true }))).toBe(false);
    expect(plugin.match(page("Projects/Alpha/_tasks/sub.md", { "pm-project": true }))).toBe(false);
    expect(plugin.match(page("Notes/plain.md", {}))).toBe(false);
  });

  it("can be told to leave generated content alone", () => {
    const src = read("Projects/Alpha/Alpha.md");
    expect(Dotpm({ hideGeneratedContent: false }).textTransform!({} as never, src)).toBe(src);
  });
});
