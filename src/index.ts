export { Dotpm, Dotpm as default, stripGeneratedContent } from "./plugin";
// The DotpmView component is exported from "./components", where Quartz's loader looks for it.

export type { DotpmOptions, DotpmViewMode } from "./types";

export type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
  QuartzTransformerPlugin,
  QuartzEmitterPlugin,
} from "@quartz-community/types";
