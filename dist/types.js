import { createRequire } from 'module';

createRequire(import.meta.url);

// src/types.ts
var defaultOptions = {
  configDir: ".obsidian",
  hideGeneratedContent: true,
  showTaskHeader: true
};
function resolveOptions(opts) {
  return { ...defaultOptions, ...opts };
}

export { defaultOptions, resolveOptions };
