import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import type {
  FilePath,
  PageMatcher,
  QuartzEmitterPluginInstance,
  QuartzPageTypePluginInstance,
  QuartzTransformerPluginInstance,
} from "@quartz-community/types";
import {
  FRONTMATTER_KEY,
  TASK_FRONTMATTER_KEY,
  parseFrontmatter,
  stripProjectAutoContent,
} from "@dotpm/core";
import { installYamlCodec } from "./yaml";
import { VIEWER_ASSETS } from "./assets";
import ProjectBody from "./components/ProjectBody";
import { resolveOptions, type DotpmOptions } from "./types";

const FRONTMATTER_BLOCK = /^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/;

/**
 * Drops the lines dotpm generates from frontmatter, which the plugin's views show instead:
 * a project note's title heading and `## Tasks` list, and a task note's `Project:` and
 * `Parent:` links. The frontmatter block is passed through untouched.
 */
export function stripGeneratedContent(src: string): string {
  const block = FRONTMATTER_BLOCK.exec(src);
  if (!block) return src;
  installYamlCodec();
  const parsed = parseFrontmatter(src);
  if (parsed.kind !== "frontmatter") return src;
  const fm = parsed.frontmatter;
  let body: string;
  if (fm[FRONTMATTER_KEY] === true) {
    body = stripProjectAutoContent(parsed.body);
  } else if (fm[TASK_FRONTMATTER_KEY] === true) {
    body = parsed.body
      .replace(/^(?:Project|Parent): \[\[.*\]\][ \t]*$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } else {
    return src;
  }
  return `${block[0]}\n${body}\n`;
}

/** A project note, as dotpm's index decides: `pm-project: true`, outside any task folder. */
const isProjectPage: PageMatcher = ({ fileData }) => {
  const fm = fileData.frontmatter as Record<string, unknown> | undefined;
  if (fm?.[FRONTMATTER_KEY] !== true) return false;
  const folders = String(fileData.relativePath ?? "")
    .split("/")
    .slice(0, -1);
  return !folders.some((segment) => segment.endsWith("_tasks"));
};

/**
 * The build side of the plugin: a transformer that tidies dotpm notes, an emitter that writes
 * dotpm's viewer to `static/dotpm/`, and a page type that gives project notes their own
 * layout key. Quartz instantiates it once per category, so one object carries all three.
 */
export const Dotpm = (
  userOpts?: Partial<DotpmOptions>,
): QuartzTransformerPluginInstance & QuartzEmitterPluginInstance & QuartzPageTypePluginInstance => {
  const opts = resolveOptions(userOpts);
  return {
    name: "Dotpm",
    // Above content-page (0), so project notes take this layout; it matches content's
    // until a site configures `layout.byPageType.dotpm`.
    priority: 10,
    match: isProjectPage,
    layout: "dotpm",
    body: ProjectBody,
    textTransform(_ctx, src) {
      return opts.hideGeneratedContent ? stripGeneratedContent(src) : src;
    },
    async emit(ctx) {
      const written: FilePath[] = [];
      for (const asset of VIEWER_ASSETS) {
        const out = join(ctx.argv.output, asset.path);
        await mkdir(dirname(out), { recursive: true });
        await writeFile(out, asset.content);
        written.push(out as FilePath);
      }
      return written;
    },
    getQuartzComponents() {
      return [];
    },
  };
};

export default Dotpm;
