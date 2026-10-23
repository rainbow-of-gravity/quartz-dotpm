import { QuartzTransformerPluginInstance, QuartzEmitterPluginInstance, QuartzPageTypePluginInstance } from '@quartz-community/types';
export { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps, QuartzEmitterPlugin, QuartzTransformerPlugin } from '@quartz-community/types';
import { DotpmOptions } from './types.js';
export { DotpmViewMode } from './types.js';

/**
 * Drops the lines dotpm generates from frontmatter, which the plugin's views show instead:
 * a project note's title heading and `## Tasks` list, and a task note's `Project:` and
 * `Parent:` links. The frontmatter block is passed through untouched.
 */
declare function stripGeneratedContent(src: string): string;
/**
 * The build side of the plugin: a transformer that tidies dotpm notes, an emitter that writes
 * dotpm's viewer to `static/dotpm/`, and a page type that gives project notes their own
 * layout key. Quartz instantiates it once per category, so one object carries all three.
 */
declare const Dotpm: (userOpts?: Partial<DotpmOptions>) => QuartzTransformerPluginInstance & QuartzEmitterPluginInstance & QuartzPageTypePluginInstance;

export { Dotpm, DotpmOptions, Dotpm as default, stripGeneratedContent };
