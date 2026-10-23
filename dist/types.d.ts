export { BuildCtx, ProcessedContent, QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, QuartzPluginData } from '@quartz-community/types';

type DotpmViewMode = "table" | "gantt" | "kanban";
interface DotpmOptions {
    /**
     * The vault's config folder, relative to the content directory. dotpm keeps its settings
     * (statuses, priorities, custom fields, per-project view state) in
     * `<configDir>/plugins/project-manager/data.json`. Missing settings fall back to dotpm's
     * defaults. Default: `.obsidian`.
     */
    configDir: string;
    /**
     * The view a project page opens on. Defaults to the project's own default view, then the
     * vault's.
     */
    defaultView?: DotpmViewMode;
    /**
     * Hide the title and `## Tasks` list dotpm writes into project notes, and the
     * `Project:`/`Parent:` lines it writes into task notes, since the views and the task header
     * show the same thing. Default: true.
     */
    hideGeneratedContent: boolean;
    /** Show status, priority, dates and assignees above task notes. Default: true. */
    showTaskHeader: boolean;
}
declare const defaultOptions: DotpmOptions;
declare function resolveOptions(opts?: Partial<DotpmOptions>): DotpmOptions;

export { type DotpmOptions, type DotpmViewMode, defaultOptions, resolveOptions };
