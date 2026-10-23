/**
 * Reads a vault's dotpm notes the way dotpm itself does (src/store/VaultIndex.ts and
 * ProjectStore.ts in dotpm), using dotpm's own parsers and hydrators, but over the files
 * Quartz published instead of Obsidian's vault API. Only published notes take part, so a
 * task hidden by a draft flag or ignore pattern is left out of every view.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { installYamlCodec } from "./yaml";
import {
  DEFAULT_SETTINGS,
  FRONTMATTER_KEY,
  TASK_FRONTMATTER_KEY,
  hydrateProjectFromFrontmatter,
  hydrateTaskFromFile,
  hydrateTasks,
  parseFrontmatter,
  readColor,
  rebuildTaskIndex,
  resolveProjectConfig,
  type CustomFieldDef,
  type PMSettings,
  type Project,
  type Task,
} from "@dotpm/core";

export const TASK_FOLDER_NAME = "_tasks";

/** A published note dotpm could care about: its vault path and parsed frontmatter. */
export interface VaultNote {
  /** Vault-relative, with `.md`, forward slashes. */
  path: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

export interface VaultProject {
  project: Project;
  settings: PMSettings;
  /** The raw per-project view state dotpm saved (sort, group, fields, filter...), if any. */
  viewState: Record<string, unknown> | null;
}

export interface DotpmVault {
  projects: Map<string, VaultProject>;
  /** Task note path to the path of the project that owns it. */
  taskOwner: Map<string, string>;
  /** Task id to its note path, per project path. */
  taskPaths: Map<string, Map<string, string>>;
  notes: Map<string, VaultNote>;
  settings: PMSettings;
  resolveLink(raw: string, sourcePath: string): string | null;
}

const folderOf = (path: string): string => {
  const at = path.lastIndexOf("/");
  return at === -1 ? "" : path.slice(0, at);
};
const nameOf = (path: string): string => path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, "");
const str = (raw: unknown): string => (typeof raw === "string" ? raw : "");

/** A project note dropped inside a project's task storage is task storage, not a project. */
function insideTaskFolder(path: string): boolean {
  return folderOf(path)
    .split("/")
    .some((segment) => segment.endsWith(TASK_FOLDER_NAME));
}

function isRefLink(raw: unknown): raw is string {
  if (typeof raw !== "string") return false;
  const trimmed = raw.trim();
  return trimmed.startsWith("[[") && trimmed.endsWith("]]") && trimmed.length > 4;
}

/** The linkpath of `[[target|alias]]`, or of a bare name, without heading or extension. */
function linkpathOf(raw: string): string {
  const inner = /^\[\[(.+?)\]\]$/.exec(raw.trim())?.[1] ?? raw.trim();
  return inner.split("|")[0]!.split("#")[0]!.trim().replace(/\.md$/i, "");
}

/**
 * Obsidian's `getFirstLinkpathDest`, close enough for links dotpm writes: a path resolves
 * from the vault root (or by suffix), a bare name by file name, nearest to the source first.
 * Case-insensitive, as Obsidian is on every platform.
 */
export function makeLinkResolver(
  paths: Iterable<string>,
): (raw: string, sourcePath: string) => string | null {
  const byLower = new Map<string, string>();
  const byName = new Map<string, string[]>();
  for (const path of paths) {
    byLower.set(path.toLowerCase(), path);
    const name = nameOf(path).toLowerCase();
    const list = byName.get(name);
    if (list) list.push(path);
    else byName.set(name, [path]);
  }
  return (raw, sourcePath) => {
    const linkpath = linkpathOf(raw).toLowerCase();
    if (!linkpath) return null;
    if (linkpath.includes("/")) {
      const relative = folderOf(sourcePath) ? `${folderOf(sourcePath)}/${linkpath}` : linkpath;
      const direct = byLower.get(`${linkpath}.md`) ?? byLower.get(`${relative.toLowerCase()}.md`);
      if (direct) return direct;
      const suffix = `/${linkpath}.md`;
      for (const [lower, path] of byLower) if (lower.endsWith(suffix)) return path;
      return null;
    }
    const candidates = byName.get(linkpath);
    if (!candidates?.length) return null;
    if (candidates.length === 1) return candidates[0]!;
    const sourceDir = folderOf(sourcePath);
    return (
      candidates.find((path) => folderOf(path) === sourceDir) ??
      [...candidates].sort((a, b) => a.length - b.length)[0]!
    );
  };
}

/** dotpm's `projectTaskFolder`: `<folder>/_tasks` for a project owning its folder, else `<note>_tasks`. */
function projectTaskFolder(
  projectPath: string,
  allPaths: Set<string>,
  folders: Set<string>,
): string {
  const dir = folderOf(projectPath);
  if (dir) {
    const folderName = nameOf(dir);
    if (folderName === nameOf(projectPath)) return `${dir}/${TASK_FOLDER_NAME}`;
    if (!allPaths.has(`${dir}/${folderName}.md`) && folders.has(`${dir}/${TASK_FOLDER_NAME}`)) {
      return `${dir}/${TASK_FOLDER_NAME}`;
    }
  }
  return projectPath.replace(/\.md$/, TASK_FOLDER_NAME);
}

/** dotpm's settings file, merged over its defaults the way the plugin loads it. */
export function readSettings(contentDir: string, configDir: string): PMSettings {
  const file = join(contentDir, configDir, "plugins", "project-manager", "data.json");
  let saved: Partial<PMSettings> = {};
  try {
    saved = JSON.parse(readFileSync(file, "utf8")) as Partial<PMSettings>;
  } catch {
    // No settings file (or an unreadable one) means dotpm's defaults, as on a fresh install.
  }
  const merged = { ...DEFAULT_SETTINGS, ...saved };
  if (!Array.isArray(merged.statuses) || merged.statuses.length === 0)
    merged.statuses = DEFAULT_SETTINGS.statuses;
  if (!Array.isArray(merged.priorities) || merged.priorities.length === 0) {
    merged.priorities = DEFAULT_SETTINGS.priorities;
  }
  return merged;
}

export interface VaultSource {
  /** The Quartz content directory, which is the vault root. */
  contentDir: string;
  configDir: string;
  /** Vault-relative paths of every published Markdown note. */
  publishedPaths: string[];
  /** Reads a note's raw text; defaults to the file under `contentDir`. */
  read?: (path: string) => string;
}

export function loadVault(source: VaultSource): DotpmVault {
  installYamlCodec();
  const read =
    source.read ?? ((path: string) => readFileSync(join(source.contentDir, path), "utf8"));
  const settings = readSettings(source.contentDir, source.configDir);
  const allPaths = new Set(source.publishedPaths);
  const folders = new Set<string>();
  for (const path of allPaths) {
    for (let dir = folderOf(path); dir; dir = folderOf(dir)) folders.add(dir);
  }
  const resolveLink = makeLinkResolver(allPaths);

  const notes = new Map<string, VaultNote>();
  for (const path of allPaths) {
    let text: string;
    try {
      text = read(path);
    } catch {
      continue;
    }
    // Cheap pre-check so only dotpm notes pay for a YAML parse.
    if (!text.includes(FRONTMATTER_KEY) && !text.includes(TASK_FRONTMATTER_KEY)) continue;
    const parsed = parseFrontmatter(text);
    if (parsed.kind !== "frontmatter") continue;
    const fm = parsed.frontmatter;
    if (fm[FRONTMATTER_KEY] === true || fm[TASK_FRONTMATTER_KEY] === true) {
      notes.set(path, { path, frontmatter: fm, body: parsed.body });
    }
  }

  const projectNotes = [...notes.values()].filter(
    (note) => note.frontmatter[FRONTMATTER_KEY] === true && !insideTaskFolder(note.path),
  );
  const taskNotes = [...notes.values()].filter(
    (note) =>
      note.frontmatter[TASK_FRONTMATTER_KEY] === true && note.frontmatter[FRONTMATTER_KEY] !== true,
  );

  const projectPathById = new Map<string, string>();
  const taskFolderOf = new Map<string, string>();
  for (const note of projectNotes) {
    projectPathById.set(str(note.frontmatter.id) || nameOf(note.path), note.path);
    taskFolderOf.set(note.path, projectTaskFolder(note.path, allPaths, folders));
  }
  const ownerByFolder = new Map([...taskFolderOf].map(([project, folder]) => [folder, project]));

  // Location wins; `projectId` covers a task note moved out of its project's folder.
  const taskOwner = new Map<string, string>();
  for (const note of taskNotes) {
    let dir = folderOf(note.path);
    if (nameOf(dir) === "Archive") dir = folderOf(dir);
    let owner = ownerByFolder.get(dir) ?? null;
    if (!owner) {
      const ref = str(note.frontmatter.projectId);
      if (ref)
        owner = isRefLink(ref) ? resolveLink(ref, note.path) : (projectPathById.get(ref) ?? null);
    }
    if (owner && taskFolderOf.has(owner)) taskOwner.set(note.path, owner);
  }

  const projects = new Map<string, VaultProject>();
  const taskPaths = new Map<string, Map<string, string>>();
  for (const note of projectNotes) {
    const project = hydrateProjectFromFrontmatter(
      note.frontmatter,
      note.body,
      note.path,
      nameOf(note.path),
    );
    const parent = note.frontmatter.parent;
    if (typeof parent === "string")
      project.parentPath = resolveLink(parent, note.path) ?? undefined;

    const embedded = note.frontmatter.tasks;
    if (Array.isArray(embedded) && embedded.length > 0) {
      // Projects written before tasks had their own notes keep them in frontmatter.
      project.tasks = hydrateTasks(embedded);
      taskPaths.set(note.path, new Map());
    } else {
      // Like dotpm's loadTasksFromFolder, views hold only the notes in the task folder; a
      // note moved out still has an owner (for its task header) but no row.
      const folder = `${taskFolderOf.get(note.path)}/`;
      const owned = taskNotes.filter((task) => task.path.startsWith(folder));
      const archivePrefix = `${folder}Archive/`;
      const { roots, paths } = buildTaskTree(owned, note, archivePrefix, notes, resolveLink);
      project.tasks = roots;
      taskPaths.set(note.path, paths);
    }
    rebuildTaskIndex(project);

    const filters = (settings.projectFilters ?? {}) as Record<string, unknown>;
    const viewState = filters[`project:${note.path}`];
    projects.set(note.path, {
      project,
      settings,
      viewState:
        viewState && typeof viewState === "object" ? (viewState as Record<string, unknown>) : null,
    });
  }

  return { projects, taskOwner, taskPaths, notes, settings, resolveLink };
}

/** dotpm's `loadTasksFromFolder`: subtask lists first, then orphans by `parentId`, roots in `taskIds` order. */
function buildTaskTree(
  owned: VaultNote[],
  projectNote: VaultNote,
  archivePrefix: string,
  notes: Map<string, VaultNote>,
  resolveLink: (raw: string, source: string) => string | null,
): { roots: Task[]; paths: Map<string, string> } {
  const loaded = owned.map((note) => ({
    note,
    ...hydrateTaskFromFile(note.frontmatter, note.body, note.path),
  }));
  const idByPath = new Map(loaded.map((entry) => [entry.note.path, entry.task.id]));

  // References are wikilinks; anything else is an id from a vault written before that.
  const refToId = (raw: string, source: string): string => {
    if (!isRefLink(raw)) return raw;
    const target = resolveLink(raw, source);
    if (!target) return raw;
    return idByPath.get(target) ?? (str(notes.get(target)?.frontmatter.id) || raw);
  };

  const taskMap = new Map<string, Task>();
  const subtaskIds = new Map<string, string[]>();
  const parentIds = new Map<string, string>();
  const paths = new Map<string, string>();
  for (const { note, task, subtaskIds: subs, parentId } of loaded) {
    if (note.path.startsWith(archivePrefix)) task.archived = true;
    task.dependencies = task.dependencies.map((raw) => refToId(raw, note.path));
    taskMap.set(task.id, task);
    paths.set(task.id, note.path);
    const ids = subs.map((raw) => refToId(raw, note.path));
    if (ids.length) subtaskIds.set(task.id, ids);
    if (parentId) parentIds.set(task.id, refToId(parentId, note.path));
  }

  for (const [id, subs] of subtaskIds) {
    const task = taskMap.get(id)!;
    const seen = new Set<string>();
    task.subtasks = [];
    for (const sid of subs) {
      const sub = taskMap.get(sid);
      if (!sub || seen.has(sid)) continue;
      task.subtasks.push(sub);
      seen.add(sid);
    }
  }

  const childIds = new Set<string>();
  for (const task of taskMap.values()) for (const sub of task.subtasks) childIds.add(sub.id);
  for (const [id, pid] of parentIds) {
    const parent = taskMap.get(pid);
    if (childIds.has(id) || !parent) continue;
    parent.subtasks.push(taskMap.get(id)!);
    childIds.add(id);
  }

  const roots: Task[] = [];
  const pushed = new Set<string>();
  const topLevel = Array.isArray(projectNote.frontmatter.taskIds)
    ? projectNote.frontmatter.taskIds
    : [];
  for (const raw of topLevel) {
    if (typeof raw !== "string") continue;
    const task = taskMap.get(refToId(raw, projectNote.path));
    if (task && !pushed.has(task.id)) {
      roots.push(task);
      pushed.add(task.id);
    }
  }
  for (const task of taskMap.values()) {
    if (!pushed.has(task.id) && !childIds.has(task.id)) roots.push(task);
  }
  return { roots, paths };
}

/** Custom fields a sub-project inherits, root-most project first. */
export function ancestorFields(vault: DotpmVault, project: Project): CustomFieldDef[][] {
  const chain: CustomFieldDef[][] = [];
  const seen = new Set([project.filePath]);
  let parent = project.parentPath ? vault.projects.get(project.parentPath) : undefined;
  while (parent && !seen.has(parent.project.filePath)) {
    seen.add(parent.project.filePath);
    chain.unshift(parent.project.customFields);
    parent = parent.project.parentPath ? vault.projects.get(parent.project.parentPath) : undefined;
  }
  return chain;
}

export function configFor(vault: DotpmVault, project: Project) {
  return resolveProjectConfig(project, vault.settings, ancestorFields(vault, project));
}

/** The color a person note sets for an assignee, as dotpm's `personColor` reads it. */
export function personColor(
  vault: DotpmVault,
  raw: string,
  sourcePath: string,
  read: (path: string) => unknown,
) {
  const path = vault.resolveLink(raw, sourcePath);
  return path ? (readColor(read(path)) ?? undefined) : undefined;
}
