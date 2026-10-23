# quartz-dotpm

A [Quartz](https://quartz.jzhao.xyz) v5 plugin that publishes [dotpm](https://github.com/dotpm/obsidian-pm) projects. dotpm is a project manager for Obsidian.

Project notes get dotpm's **Table**, **Timeline** and **Board** views. These are dotpm's own renderers, the same ones its "Export view as HTML" uses, so a published project looks like it does in Obsidian. Task notes get a header showing status, priority, dates, assignees and a link to their project. The views use the site's colors, fonts and dark mode.

- Read-only views of every published project, with the starting view, sort, grouping and timeline scale taken from what you last used in dotpm.
- Clicking a task opens its page.
- Uses your vault's own statuses, priorities and custom fields from dotpm's settings. Assignee colors come from person notes.
- Respects Quartz's publishing rules. A task note that is a draft, ignored or otherwise unpublished never appears in a view.
- No JavaScript needed to read the tasks. Each project page has a plain task table that the interactive viewer replaces once it loads.
- The viewer (about 50 kB gzipped) loads only on pages that show a project.

## Installation

```bash
npx quartz plugin add github:rainbow-of-gravity/quartz-dotpm
```

Then place the component in `quartz.config.yaml`. `beforeBody` puts it under the page title:

```yaml title="quartz.config.yaml"
plugins:
  - source: github:rainbow-of-gravity/quartz-dotpm
    enabled: true
    layout:
      position: beforeBody
      priority: 40
```

The plugin reads dotpm's settings from the vault, so `.obsidian/` needs to be in the content folder. It can stay in `ignorePatterns`, because the plugin reads the settings file directly and never publishes it.

### Wide timelines

Project notes use their own page type with the layout key `dotpm`. That lets you lay out project pages differently from other notes. For example, use the full-width frame so the timeline and board have room:

```yaml title="quartz.config.yaml"
layout:
  byPageType:
    dotpm:
      template: full-width
```

Without this, project pages use the same layout as every other note.

## Options

| Option                 | Default        | Description                                                                                                                                                        |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `configDir`            | `.obsidian`    | Vault config folder holding `plugins/project-manager/data.json`, where dotpm keeps its settings. If it is missing, dotpm's defaults apply.                         |
| `defaultView`          | _(from dotpm)_ | `table`, `gantt` or `kanban`. The view a project page opens on. Defaults to the project's own default view, then the vault's.                                      |
| `hideGeneratedContent` | `true`         | Hide the title heading and `## Tasks` list dotpm writes into project notes, and the `Project:`/`Parent:` lines in task notes. The views show the same information. |
| `showTaskHeader`       | `true`         | Show status, priority, dates and assignees above task notes.                                                                                                       |

A visitor's choice of view is remembered per project in their browser.

## How it works

1. **Build time.** The plugin reads every published note with `pm-project` or `pm-task` frontmatter. It uses dotpm's own parser and hydrators and follows dotpm's rules: task folders (`<project>/_tasks/` or the legacy `<project>_tasks/`), wikilink and legacy bare-id references, `Archive/`, and orphans re-parented through `parentId`. Each project becomes a [`dotpm-snapshot`](https://github.com/dotpm/obsidian-pm/blob/main/packages/api/src/snapshot.ts), the format dotpm's HTML export writes, and is embedded in the page.
2. **In the browser.** A small page script loads dotpm's viewer from `static/dotpm/` and mounts it on the snapshot. Quartz's theme variables are mapped onto the Obsidian variables dotpm's styles read. The script re-mounts on every SPA navigation and follows the dark-mode toggle.

## Development

dotpm's source is a pinned git submodule. The build-time code compiles against it, and `src/generated/` holds the browser viewer bundled from it.

```bash
git clone --recurse-submodules https://github.com/rainbow-of-gravity/quartz-dotpm
cd quartz-dotpm
(cd vendor/obsidian-pm && npx pnpm install --frozen-lockfile --ignore-scripts)
npm install
npm run check   # typecheck, lint, format, tests
npm run build   # dist/, which is committed
```

To move to a newer dotpm, check out the new commit in `vendor/obsidian-pm`, then run `npm run build:viewer && npm run build` and commit `src/generated/` and `dist/` together. CI fails if either is out of date with the pinned commit.

To try it on a site, run `npx quartz plugin add ../quartz-dotpm`. Local plugins are symlinked, so a rebuild of the plugin is picked up by the next site build.

## Credits

The views, styles and data model are dotpm's, by Stepan Kropachev and contributors ([MIT](https://github.com/dotpm/obsidian-pm/blob/main/LICENSE)), bundled unmodified from the commit pinned in `vendor/obsidian-pm`. Icons are from [Lucide](https://lucide.dev) ([ISC](https://github.com/lucide-icons/lucide/blob/main/LICENSE)).

## License

MIT
