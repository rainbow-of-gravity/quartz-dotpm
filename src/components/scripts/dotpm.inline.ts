// Mounts dotpm's own viewer on each `.dotpm-view` a page holds. The viewer is fetched only
// by pages that need it, once per visit, and re-mounted on every SPA navigation.

interface DotpmViewer {
  mount(
    root: HTMLElement,
    snapshot: unknown,
    options?: { mode?: string; onModeChange?: (mode: string) => void },
  ): void;
  isSnapshot(value: unknown): boolean;
  catalogs: Record<string, unknown>;
}

interface DotpmPageData {
  snapshot: { locale: string; primaryProjectId: string };
  links: Record<string, string>;
  messages: Record<string, string> | null;
}

const MODES = ["table", "gantt", "kanban"];
// Clicks on these act inside the view (expand a row, switch views) rather than open a task.
const INTERACTIVE =
  "a, button, input, select, textarea, .clickable-icon, .pm-collapse-toggle, .pm-view-switcher";

let viewer: Promise<DotpmViewer> | null = null;

function loadViewer(jsUrl: string, cssUrl: string): Promise<DotpmViewer> {
  if (!document.querySelector("link[data-dotpm-css]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrl;
    link.dataset.dotpmCss = "";
    document.head.appendChild(link);
  }
  viewer ??= import(jsUrl) as Promise<DotpmViewer>;
  viewer.catch(() => (viewer = null));
  return viewer;
}

function storedMode(key: string): string | undefined {
  try {
    const mode = localStorage.getItem(key);
    return mode && MODES.includes(mode) ? mode : undefined;
  } catch {
    return undefined;
  }
}

function storeMode(key: string, mode: string): void {
  try {
    localStorage.setItem(key, mode);
  } catch {
    // Storage can be unavailable (private windows, blocked site data); the view still works.
  }
}

const isDark = (): boolean => document.documentElement.getAttribute("saved-theme") === "dark";

function openTask(event: MouseEvent, href: string): void {
  const url = new URL(href, window.location.href);
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) {
    window.open(url.href, "_blank", "noopener");
  } else if (window.spaNavigate) {
    void window.spaNavigate(url, false);
  } else {
    window.location.assign(url.href);
  }
}

function render(host: HTMLElement, dotpm: DotpmViewer): void {
  const mountEl = host.querySelector<HTMLElement>(".dotpm-mount");
  const raw = host.querySelector("script.dotpm-data")?.textContent;
  if (!mountEl || !raw) return;
  let data: DotpmPageData;
  try {
    data = JSON.parse(raw) as DotpmPageData;
  } catch {
    return;
  }
  if (!dotpm.isSnapshot(data.snapshot)) return;
  if (data.messages) dotpm.catalogs[data.snapshot.locale] = data.messages;

  const key = `dotpm-view:${data.snapshot.primaryProjectId}`;
  host.classList.toggle("theme-dark", isDark());
  dotpm.mount(mountEl, data.snapshot, {
    mode: storedMode(key),
    onModeChange: (mode) => storeMode(key, mode),
  });
  host.classList.add("dotpm-ready");

  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (!target || target.closest(INTERACTIVE)) return;
    const id = target.closest<HTMLElement>("[data-task-id]")?.dataset.taskId;
    const href = id ? data.links[id] : undefined;
    if (!href) return;
    event.preventDefault();
    openTask(event, href);
  };
  mountEl.addEventListener("click", onClick);
  window.addCleanup(() => mountEl.removeEventListener("click", onClick));
}

document.addEventListener("nav", async () => {
  const hosts = Array.from(document.querySelectorAll<HTMLElement>(".dotpm-view"));
  const first = hosts[0];
  if (!first?.dataset.dotpmJs || !first.dataset.dotpmCss) return;

  const onTheme = () => {
    for (const host of hosts) host.classList.toggle("theme-dark", isDark());
  };
  document.addEventListener("themechange", onTheme);
  window.addCleanup(() => document.removeEventListener("themechange", onTheme));

  // Paper is white: print with the light theme, then restore the reader's choice. Dark text
  // colors would otherwise print light grey, since the view keeps its colors exact in print.
  let printedFrom: string | null = null;
  const beforePrint = () => {
    if (!isDark()) return;
    printedFrom = "dark";
    document.documentElement.setAttribute("saved-theme", "light");
    onTheme();
  };
  const afterPrint = () => {
    if (printedFrom === null) return;
    document.documentElement.setAttribute("saved-theme", printedFrom);
    printedFrom = null;
    onTheme();
  };
  window.addEventListener("beforeprint", beforePrint);
  window.addEventListener("afterprint", afterPrint);
  window.addCleanup(() => {
    window.removeEventListener("beforeprint", beforePrint);
    window.removeEventListener("afterprint", afterPrint);
  });

  let dotpm: DotpmViewer;
  try {
    const base = window.location.href;
    dotpm = await loadViewer(
      new URL(first.dataset.dotpmJs, base).href,
      new URL(first.dataset.dotpmCss, base).href,
    );
  } catch (error) {
    // The plain task table rendered at build time stays in place.
    console.error("[dotpm] could not load the viewer", error);
    return;
  }
  for (const host of hosts) if (host.isConnected) render(host, dotpm);
});
