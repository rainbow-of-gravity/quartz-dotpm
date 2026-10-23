/**
 * Builds the `dotpm-snapshot` for a project page: the same document dotpm's "Export view as
 * HTML" writes (dotpm src/export/snapshot.ts), so dotpm's own viewer can draw it.
 */
import {
  PRIORITY_ICON_SETS,
  catalogs,
  flattenTasks,
  makeDefaultSort,
  stringifyCustomValue,
  type Messages,
  type Project,
  type ViewMode,
} from "@dotpm/core";
import {
  SNAPSHOT_FORMAT,
  SNAPSHOT_VERSION,
  taskResources,
  toProjectResource,
  type ProjectSummary,
  type Snapshot,
} from "@dotpm/api";
import { iconMarkup } from "./icons";
import { configFor, personColor, type DotpmVault, type VaultProject } from "./vault";
import { DOTPM_VERSION } from "./generated/version";

/** Icons the page chrome and the composites ask for by name, whatever the data holds. */
const CHROME_ICONS = [
  "plus",
  "x",
  "check",
  "chevron-down",
  "chevron-right",
  "right-triangle",
  "more-horizontal",
  "calendar",
  "link-2",
  "clock",
  "repeat",
  "table",
  "git-fork",
  "layout-dashboard",
];

const VIEW_MODES: ViewMode[] = ["table", "gantt", "kanban"];

function summarize(vault: DotpmVault, entry: VaultProject): ProjectSummary {
  const { project } = entry;
  const complete = new Set(
    configFor(vault, project)
      .statuses.filter((status) => status.complete)
      .map((status) => status.id),
  );
  const live = flattenTasks(project.tasks).filter((f) => !f.task.archived);
  const parent = project.parentPath ? vault.projects.get(project.parentPath) : undefined;
  return {
    id: project.id,
    path: project.filePath,
    title: project.title,
    icon: project.icon,
    color: project.color,
    parentId: parent?.project.id ?? null,
    archived: project.archived === true || parent?.project.archived === true,
    taskCount: live.length,
    doneCount: live.filter((f) => complete.has(f.task.status)).length,
  };
}

function personColors(
  vault: DotpmVault,
  project: Project,
  colorOf: (path: string) => unknown,
): Record<string, string> {
  const colors: Record<string, string> = {};
  const personFields = configFor(vault, project).customFields.filter(
    (field) => field.type === "person",
  );
  for (const { task } of flattenTasks(project.tasks)) {
    const fieldValues = personFields.flatMap((field) => {
      const value = task.customFields[field.id];
      return (Array.isArray(value) ? value : [value]).map(stringifyCustomValue).filter(Boolean);
    });
    for (const raw of [...task.assignees, ...fieldValues]) {
      if (raw in colors) continue;
      const color = personColor(vault, raw, task.filePath ?? project.filePath, colorOf);
      if (color) colors[raw] = color;
    }
  }
  return colors;
}

/** The catalog for a locale tag, as dotpm's `setLocale` would pick it; null for English. */
export function messagesFor(locale: string): Messages | null {
  const catalog = catalogs[locale] ?? catalogs[locale.split("-")[0]!];
  return catalog && catalog !== catalogs.en ? catalog : null;
}

export interface SnapshotOptions {
  locale: string;
  defaultView?: ViewMode;
  /** When the site was built; shown as the snapshot's "exported" time. */
  builtAt: Date;
  /** A note's `color` frontmatter, for person notes. */
  colorOf: (path: string) => unknown;
}

export function buildSnapshot(
  vault: DotpmVault,
  entry: VaultProject,
  opts: SnapshotOptions,
): Snapshot {
  const { project, settings } = entry;
  const config = configFor(vault, project);
  const state = entry.viewState ?? {};

  const iconNames = new Set<string>(CHROME_ICONS);
  for (const set of Object.values(PRIORITY_ICON_SETS)) for (const name of set) iconNames.add(name);
  for (const status of config.statuses) iconNames.add(status.icon);
  for (const priority of config.priorities) iconNames.add(priority.icon);
  for (const field of config.customFields) if (field.icon) iconNames.add(field.icon);
  iconNames.add(project.icon);

  const savedMode = VIEW_MODES.find((mode) => mode === opts.defaultView);
  const mode: ViewMode = savedMode ?? config.defaultView ?? settings.defaultView ?? "table";
  const granularity =
    typeof state.ganttGranularity === "string" ? state.ganttGranularity : settings.ganttGranularity;

  return {
    format: SNAPSHOT_FORMAT,
    version: SNAPSHOT_VERSION,
    generator: { name: "quartz-dotpm", version: DOTPM_VERSION },
    exportedAt: opts.builtAt.toISOString(),
    locale: opts.locale,
    title: project.title,
    primaryProjectId: project.id,
    // The view as the vault last left it in dotpm. The viewer hydrates each part, so the
    // saved shapes pass through as dotpm wrote them.
    view: {
      mode,
      filter: (state.filter as Snapshot["view"]["filter"]) ?? {
        conditions: [],
        showArchived: false,
      },
      sort: (state.sort as Snapshot["view"]["sort"]) ?? makeDefaultSort(),
      group: state.group as Snapshot["view"]["group"],
      fields: (state.fields as Snapshot["view"]["fields"]) ?? settings.defaultFields,
      nonWorkingDays: state.nonWorkingDays as Snapshot["view"]["nonWorkingDays"],
      ganttGranularity: granularity as Snapshot["view"]["ganttGranularity"],
    },
    settings: {
      priorityIcons: config.priorityIcons,
      showTagColors: settings.showTagColors,
      showSubtreeConnections: config.showSubtreeConnections,
      lineBorders: config.lineBorders,
      ganttWeekLabel: settings.ganttWeekLabel,
      holidays: settings.holidays,
      dateFormat: settings.dateFormat,
    },
    projects: [
      {
        ...toProjectResource(project, config, summarize(vault, entry)),
        tasks: taskResources(project, project.id, true),
      },
    ],
    icons: iconMarkup(iconNames),
    personColors: personColors(vault, project, opts.colorOf),
  };
}
