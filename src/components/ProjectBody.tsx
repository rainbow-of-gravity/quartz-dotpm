import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { htmlToJsx } from "@quartz-community/utils/jsx";
import type { Node } from "hast";

/**
 * The body of a project page: the note's own prose, rendered exactly as content-page renders
 * any note. Project pages get their own page type only so sites can give them their own
 * layout (`layout.byPageType.dotpm`), for example the `full-width` frame for wide timelines.
 */
export default (() => {
  const ProjectBody: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
    const classes =
      (fileData.frontmatter as { cssclasses?: string[] } | undefined)?.cssclasses ?? [];
    return (
      <article class={["popover-hint", ...classes].join(" ")}>
        <div class="markdown-preview-view markdown-rendered">{htmlToJsx(tree as Node)}</div>
      </article>
    );
  };
  return ProjectBody;
}) satisfies QuartzComponentConstructor;
