// dotpm names its icons by Lucide id and, inside Obsidian, draws them with Obsidian's copy of
// Lucide. Outside Obsidian the snapshot carries the markup itself, built from lucide-static.
import iconNodes from "lucide-static/icon-nodes.json";

type IconNode = [tag: string, attrs: Record<string, string>][];

const nodes = iconNodes as unknown as Record<string, IconNode>;

// Obsidian's own glyphs dotpm's chrome asks for, which Lucide does not have.
const OBSIDIAN_ICONS: Record<string, IconNode> = {
  "right-triangle": [["path", { d: "M3 8L12 17L21 8" }]],
};

const escapeAttr = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function iconSvg(name: string): string | undefined {
  const node = OBSIDIAN_ICONS[name] ?? nodes[name];
  if (!node) return undefined;
  const children = node
    .map(([tag, attrs]) => {
      const attributes = Object.entries(attrs)
        .map(([key, value]) => ` ${key}="${escapeAttr(String(value))}"`)
        .join("");
      return `<${tag}${attributes}/>`;
    })
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ` +
    `stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ` +
    `class="svg-icon lucide-${name}">${children}</svg>`
  );
}

export function iconMarkup(names: Iterable<string>): Record<string, string> {
  const icons: Record<string, string> = {};
  for (const name of names) {
    if (!name || icons[name] !== undefined) continue;
    const svg = iconSvg(name);
    if (svg) icons[name] = svg;
  }
  return icons;
}
