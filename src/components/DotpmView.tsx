import type {
  BuildCtx,
  FullSlug,
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
} from "@quartz-community/types";
import { pathToRoot, resolveRelative, slugifyFilePath } from "@quartz-community/utils/path";
import type { FilePath } from "@quartz-community/types";
import {
  FRONTMATTER_KEY,
  TASK_FRONTMATTER_KEY,
  findTaskById,
  flattenTasks,
  formatDateLong,
  getPriorityConfig,
  getStatusConfig,
  setDateFormat,
  setLocale,
  t,
  type Task,
} from "@dotpm/core";
import { VIEWER_CSS_PATH, VIEWER_JS_PATH } from "../assets";
import { buildSnapshot, messagesFor } from "../snapshot";
import { resolveOptions, type DotpmOptions } from "../types";
import { configFor, loadVault, type DotpmVault, type VaultProject } from "../vault";
import style from "./styles/dotpm.scss";
// @ts-expect-error inline script import handled by bundler
import script from "./scripts/dotpm.inline.ts";

type FileData = QuartzPluginData & Record<string, unknown>;

interface Site {
  vault: DotpmVault;
  /** Note path to the slug Quartz published it under. */
  slugs: Map<string, FullSlug>;
}

// One read of the vault per build: every page render in a build shares the same allFiles.
const sites = new WeakMap<FileData[], Site>();

function siteFor(props: QuartzComponentProps, opts: DotpmOptions): Site {
  const cached = sites.get(props.allFiles);
  if (cached) return cached;
  const slugs = new Map<string, FullSlug>();
  for (const file of props.allFiles) {
    const path = file.relativePath as string | undefined;
    if (path?.endsWith(".md") && file.slug) slugs.set(path, file.slug);
  }
  const ctx = props.ctx as BuildCtx;
  const vault = loadVault({
    contentDir: ctx.argv.directory,
    configDir: opts.configDir,
    publishedPaths: [...slugs.keys()],
  });
  const site = { vault, slugs };
  sites.set(props.allFiles, site);
  return site;
}

// Links use the slug Quartz gave the page, which keeps the note's case, so they hold on
// case-sensitive hosts too.
const hrefFor = (site: Site, current: FullSlug, path: string): string =>
  resolveRelative(current, site.slugs.get(path) ?? slugifyFilePath(path as FilePath));

/** JSON in a script tag: `<` is escaped so no task text can close the tag. */
const jsonForScript = (value: unknown): string => JSON.stringify(value).replace(/</g, "\\u003c");

function Chip({ label, color }: { label: string; color?: string }) {
  return (
    <span class="dotpm-chip" style={color ? { "--dotpm-chip": color } : undefined}>
      {color && <span class="dotpm-chip-dot" />}
      {label}
    </span>
  );
}

/** A plain table of the project's tasks: what shows before the viewer loads, and without JS. */
function FallbackTable({ entry, site, slug }: { entry: VaultProject; site: Site; slug: FullSlug }) {
  const { vault } = site;
  const config = configFor(vault, entry.project);
  const paths = vault.taskPaths.get(entry.project.filePath);
  const rows = flattenTasks(entry.project.tasks).filter((f) => !f.task.archived);
  if (rows.length === 0) return <p class="dotpm-empty">{t("common.task")}: 0</p>;
  return (
    <table class="dotpm-fallback">
      <thead>
        <tr>
          <th>{t("columns.task")}</th>
          <th>{t("columns.status")}</th>
          <th>{t("columns.priority")}</th>
          <th>{t("columns.due")}</th>
          <th>{t("columns.assignees")}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ task, depth }) => {
          const path = paths?.get(task.id);
          const status = getStatusConfig(config.statuses, task.status);
          return (
            <tr>
              <td style={{ paddingLeft: `${depth * 1.25 + 0.4}em` }}>
                {path ? <a href={hrefFor(site, slug, path)}>{task.title}</a> : task.title}
              </td>
              <td>
                <Chip label={status?.label ?? task.status} color={status?.color} />
              </td>
              <td>{getPriorityConfig(config.priorities, task.priority)?.label ?? task.priority}</td>
              <td>{task.due ? formatDateLong(task.due) : ""}</td>
              <td>{task.assignees.join(", ")}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ProjectView({
  props,
  site,
  entry,
}: {
  props: QuartzComponentProps;
  site: Site;
  entry: VaultProject;
}) {
  const { vault } = site;
  const opts = props.dotpmOptions as DotpmOptions;
  const slug = props.fileData.slug!;
  const colors = new Map(
    props.allFiles.map((file) => [file.relativePath, file.frontmatter?.color]),
  );
  const snapshot = buildSnapshot(vault, entry, {
    locale: props.cfg.locale ?? "en-US",
    defaultView: opts.defaultView,
    builtAt: new Date(),
    colorOf: (path) => colors.get(path as FilePath),
  });
  const links: Record<string, string> = {};
  for (const [id, path] of vault.taskPaths.get(entry.project.filePath) ?? [])
    links[id] = hrefFor(site, slug, path);
  const data = { snapshot, links, messages: messagesFor(snapshot.locale) };
  return (
    <div
      class="dotpm-view"
      data-dotpm-js={`${pathToRoot(slug)}/${VIEWER_JS_PATH}`}
      data-dotpm-css={`${pathToRoot(slug)}/${VIEWER_CSS_PATH}`}
    >
      <script
        type="application/json"
        class="dotpm-data"
        dangerouslySetInnerHTML={{ __html: jsonForScript(data) }}
      />
      <div class="dotpm-mount">
        <FallbackTable entry={entry} site={site} slug={slug} />
      </div>
    </div>
  );
}

function TaskHeader({ props, site }: { props: QuartzComponentProps; site: Site }) {
  const { vault } = site;
  const path = props.fileData.relativePath as string;
  const owner = vault.taskOwner.get(path);
  const entry = owner ? vault.projects.get(owner) : undefined;
  if (!entry) return null;
  const paths = vault.taskPaths.get(entry.project.filePath)!;
  const id = [...paths].find(([, p]) => p === path)?.[0];
  const task = id ? findTaskById(entry.project, id) : undefined;
  if (!task) return null;

  const slug = props.fileData.slug!;
  const config = configFor(vault, entry.project);
  const status = getStatusConfig(config.statuses, task.status);
  const priority = getPriorityConfig(config.priorities, task.priority);
  const parent = flattenTasks(entry.project.tasks).find((f) =>
    f.task.subtasks.some((s: Task) => s.id === task.id),
  );
  const parentPath = parent ? paths.get(parent.task.id) : undefined;
  const dates = [task.start, task.due].filter(Boolean).map(formatDateLong).join(" → ");

  return (
    <div class="dotpm-task-header" style={{ "--dotpm-project": entry.project.color }}>
      <dl>
        <dt>{t("common.project")}</dt>
        <dd>
          <a href={hrefFor(site, slug, entry.project.filePath)} class="internal">
            {entry.project.icon} {entry.project.title}
          </a>
        </dd>
        {parent && (
          <>
            <dt>{t("taskForm.parentTask")}</dt>
            <dd>
              {parentPath ? (
                <a href={hrefFor(site, slug, parentPath)}>{parent.task.title}</a>
              ) : (
                parent.task.title
              )}
            </dd>
          </>
        )}
        <dt>{t("taskForm.status")}</dt>
        <dd>
          <Chip label={status?.label ?? task.status} color={status?.color} />
        </dd>
        <dt>{t("taskForm.priority")}</dt>
        <dd>
          <Chip label={priority?.label ?? task.priority} color={priority?.color} />
        </dd>
        {dates && (
          <>
            <dt>
              {task.start ? `${t("taskForm.start")} → ${t("taskForm.due")}` : t("taskForm.due")}
            </dt>
            <dd>{dates}</dd>
          </>
        )}
        {task.progress > 0 && (
          <>
            <dt>{t("taskForm.progress")}</dt>
            <dd>
              <span class="dotpm-progress" style={{ "--dotpm-progress": `${task.progress}%` }} />
              {task.progress}%
            </dd>
          </>
        )}
        {task.assignees.length > 0 && (
          <>
            <dt>{t("taskForm.assignees")}</dt>
            <dd>{task.assignees.join(", ")}</dd>
          </>
        )}
      </dl>
    </div>
  );
}

export default ((userOpts?: Partial<DotpmOptions>) => {
  const opts = resolveOptions(userOpts);

  const Component: QuartzComponent = (props: QuartzComponentProps) => {
    const fm = props.fileData.frontmatter as Record<string, unknown> | undefined;
    const isProject = fm?.[FRONTMATTER_KEY] === true;
    const isTask = !isProject && fm?.[TASK_FRONTMATTER_KEY] === true;
    if (!isProject && !(isTask && opts.showTaskHeader)) return null;

    const site = siteFor(props, opts);
    setLocale(props.cfg.locale ?? "en-US");
    setDateFormat(site.vault.settings.dateFormat);

    if (isProject) {
      const entry = site.vault.projects.get(props.fileData.relativePath as string);
      return entry ? (
        <ProjectView props={{ ...props, dotpmOptions: opts }} site={site} entry={entry} />
      ) : null;
    }
    return <TaskHeader props={props} site={site} />;
  };

  Component.css = style;
  Component.afterDOMLoaded = script;
  return Component;
}) satisfies QuartzComponentConstructor<Partial<DotpmOptions>>;
