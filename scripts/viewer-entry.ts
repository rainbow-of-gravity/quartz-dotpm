// Entry for scripts/build-viewer.mjs: the parts of dotpm's own snapshot viewer the page script
// calls, so views render with dotpm's code and markup rather than a reimplementation.
// Importing the viewer also installs dotpm's DOM helpers.
export { mount } from "../vendor/obsidian-pm/packages/viewer/src/main";
export { isSnapshot } from "@dotpm/api";
export { catalogs } from "@dotpm/core";
