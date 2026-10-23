import { createHash } from "crypto";
import viewerCss from "./generated/viewer-css";
import viewerJs from "./generated/viewer-js";

const hashed = (name: string, ext: string, content: string): string =>
  `static/dotpm/${name}.${createHash("sha256").update(content).digest("hex").slice(0, 12)}.${ext}`;

/**
 * dotpm's viewer and its stylesheet, served as their own files and loaded only by pages that
 * show a project. The names carry a content hash so a site can cache them indefinitely.
 */
export const VIEWER_ASSETS = [
  { path: hashed("viewer", "js", viewerJs), content: viewerJs },
  { path: hashed("viewer", "css", viewerCss), content: viewerCss },
] as const;

export const VIEWER_JS_PATH = VIEWER_ASSETS[0].path;
export const VIEWER_CSS_PATH = VIEWER_ASSETS[1].path;
