import { createRequire } from 'module';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { createHash } from 'crypto';

const require$1 = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require$1 !== "undefined" ? require$1 : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a2, b2) => (typeof require$1 !== "undefined" ? require$1 : a2)[b2]
}) : x2)(function(x2) {
  if (typeof require$1 !== "undefined") return require$1.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp(target, "default", { value: mod, enumerable: true }) ,
  mod
));

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "node_modules/yaml/dist/nodes/identity.js"(exports) {
    var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
    var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
    var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
    var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
    var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
    var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
    var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "node_modules/yaml/dist/visit.js"(exports) {
    var identity = require_identity();
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path) {
      const ctrl = callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visit_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i2 = 0; i2 < node.items.length; ++i2) {
            const ci = visit_(i2, node.items[i2], visitor, path);
            if (typeof ci === "number")
              i2 = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i2, 1);
              i2 -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = visit_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path) {
      const ctrl = await callVisitor(key, node, visitor, path);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path, ctrl);
        return visitAsync_(key, ctrl, visitor, path);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path = Object.freeze(path.concat(node));
          for (let i2 = 0; i2 < node.items.length; ++i2) {
            const ci = await visitAsync_(i2, node.items[i2], visitor, path);
            if (typeof ci === "number")
              i2 = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i2, 1);
              i2 -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path = Object.freeze(path.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path) {
      if (typeof visitor === "function")
        return visitor(key, node, path);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path);
      return void 0;
    }
    function replaceNode(key, path, node) {
      const parent = path[path.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "node_modules/yaml/dist/doc/directives.js"(exports) {
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn2) => tn2.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name2 = parts.shift();
        switch (name2) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix] = parts;
            this.tags[handle] = prefix;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name2}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix = this.tags[handle];
        if (prefix) {
          try {
            return prefix + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix))
            return handle + escapeTagName(tag.substring(prefix.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix] of tagEntries) {
          if (handle === "!!" && prefix === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn2) => tn2.startsWith(prefix)))
            lines.push(`%TAG ${handle} ${prefix}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "node_modules/yaml/dist/doc/anchors.js"(exports) {
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root2) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root2, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix, exclude) {
      for (let i2 = 1; true; ++i2) {
        const name2 = `${prefix}${i2}`;
        if (!exclude.has(name2))
          return name2;
      }
    }
    function createNodeAnchors(doc, prefix) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i2 = 0, len = val.length; i2 < len; ++i2) {
            const v0 = val[i2];
            const v1 = applyReviver(reviver, val, String(i2), v0);
            if (v1 === void 0)
              delete val[i2];
            else if (v1 !== v0)
              val[i2] = v1;
          }
        } else if (val instanceof Map) {
          for (const k2 of Array.from(val.keys())) {
            const v0 = val.get(k2);
            const v1 = applyReviver(reviver, val, k2, v0);
            if (v1 === void 0)
              val.delete(k2);
            else if (v1 !== v0)
              val.set(k2, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k2, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k2, v0);
            if (v1 === void 0)
              delete val[k2];
            else if (v1 !== v0)
              val[k2] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "node_modules/yaml/dist/nodes/toJS.js"(exports) {
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v2, i2) => toJS(v2, String(i2), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "node_modules/yaml/dist/nodes/Node.js"(exports) {
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "node_modules/yaml/dist/nodes/Alias.js"(exports) {
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        if (found && ctx) {
          const { anchors: anchors2, doc: doc2, maxAliasCount } = ctx;
          let data = anchors2.get(found);
          if (!data) {
            toJS.toJS(found, null, ctx);
            data = anchors2.get(found);
          }
          if (data?.res === void 0) {
            const msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
              data.aliasCount = getAliasCount(doc2, found, anchors2);
            if (data.count * data.aliasCount > maxAliasCount) {
              const msg = "Excessive alias count indicates a resource exhaustion attack";
              throw new ReferenceError(msg);
            }
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const source = this.resolve(ctx.doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c2 = getAliasCount(doc, item, anchors2);
          if (c2 > count)
            count = c2;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "node_modules/yaml/dist/doc/createNode.js"(exports) {
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match = tags.filter((t3) => t3.tag === tagName);
        const tagObj = match.find((t3) => !t3.format) ?? match[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t3) => t3.identify?.(value) && !t3.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "node_modules/yaml/dist/nodes/Collection.js"(exports) {
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path, value) {
      let v2 = value;
      for (let i2 = path.length - 1; i2 >= 0; --i2) {
        const k2 = path[i2];
        if (typeof k2 === "number" && Number.isInteger(k2) && k2 >= 0) {
          const a2 = [];
          a2[k2] = v2;
          v2 = a2;
        } else {
          v2 = /* @__PURE__ */ new Map([[k2, v2]]);
        }
      }
      return createNode.createNode(v2, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path, value) {
        if (isEmptyPath(path))
          this.add(value);
        else {
          const [key, ...rest] = path;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n2 = node.value;
          return n2 == null || allowScalar && identity.isScalar(n2) && n2.value == null && !n2.commentBefore && !n2.comment && !n2.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path) {
        const [key, ...rest] = path;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        const [key, ...rest] = path;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text2, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text2;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text2.length <= endStep)
        return text2;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i2 = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i2 = consumeMoreIndentedLines(text2, i2, indent.length);
        if (i2 !== -1)
          end = i2 + endStep;
      }
      for (let ch; ch = text2[i2 += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i2;
          switch (text2[i2 + 1]) {
            case "x":
              i2 += 3;
              break;
            case "u":
              i2 += 5;
              break;
            case "U":
              i2 += 9;
              break;
            default:
              i2 += 1;
          }
          escEnd = i2;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i2 = consumeMoreIndentedLines(text2, i2, indent.length);
          end = i2 + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text2[i2 + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i2;
          }
          if (i2 >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text2[i2 += 1];
                overflow = true;
              }
              const j2 = i2 > escEnd + 1 ? i2 - 2 : escStart - 1;
              if (escapedFolds[j2])
                return text2;
              folds.push(j2);
              escapedFolds[j2] = true;
              end = j2 + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text2;
      if (onFold)
        onFold();
      let res = text2.slice(0, folds[0]);
      for (let i3 = 0; i3 < folds.length; ++i3) {
        const fold = folds[i3];
        const end2 = folds[i3 + 1] || text2.length;
        if (fold === 0)
          res = `
${indent}${text2.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text2[fold]}\\`;
          res += `
${indent}${text2.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text2, i2, indent) {
      let end = i2;
      let start2 = i2 + 1;
      let ch = text2[start2];
      while (ch === " " || ch === "	") {
        if (i2 < start2 + indent) {
          ch = text2[++i2];
        } else {
          do {
            ch = text2[++i2];
          } while (ch && ch !== "\n");
          end = i2;
          start2 = i2 + 1;
          ch = text2[start2];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i2 = 0, start2 = 0; i2 < strLen; ++i2) {
        if (str[i2] === "\n") {
          if (i2 - start2 > limit)
            return true;
          start2 = i2 + 1;
          if (strLen - start2 <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start2 = 0;
      for (let i2 = 0, ch = json[i2]; ch; ch = json[++i2]) {
        if (ch === " " && json[i2 + 1] === "\\" && json[i2 + 2] === "n") {
          str += json.slice(start2, i2) + "\\ ";
          i2 += 1;
          start2 = i2;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json[i2 + 1]) {
            case "u":
              {
                str += json.slice(start2, i2);
                const code = json.substr(i2 + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json.substr(i2, 6);
                }
                i2 += 5;
                start2 = i2 + 1;
              }
              break;
            case "n":
              if (implicitKey || json[i2 + 2] === '"' || json.length < minMultiLineLength) {
                i2 += 1;
              } else {
                str += json.slice(start2, i2) + "\n\n";
                while (json[i2 + 2] === "\\" && json[i2 + 3] === "n" && json[i2 + 4] !== '"') {
                  str += "\n";
                  i2 += 2;
                }
                str += indent;
                if (json[i2 + 2] === " ")
                  str += "\\";
                i2 += 1;
                start2 = i2 + 1;
              }
              break;
            default:
              i2 += 1;
          }
      }
      str = start2 ? str + json.slice(start2) : json;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start2 = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start2) {
        value = value.substring(start2.length);
        start2 = start2.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start2}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start2}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t3 = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t3);
        if (res === null)
          throw new Error(`Unsupported default string type ${t3}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "node_modules/yaml/dist/stringify/stringify.js"(exports) {
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match = tags.filter((t3) => t3.tag === item.tag);
        if (match.length > 0)
          return match.find((t3) => t3.format === item.format) ?? match[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match = tags.filter((t3) => t3.identify?.(obj));
        if (match.length > 1) {
          const testMatch = match.filter((t3) => t3.test);
          if (testMatch.length > 0)
            match = testMatch;
        }
        tagObj = match.find((t3) => t3.format === item.format) ?? match.find((t3) => !t3.format);
      } else {
        obj = item;
        tagObj = tags.find((t3) => t3.nodeClass && obj instanceof t3.nodeClass);
      }
      if (!tagObj) {
        const name2 = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name2} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify4(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o2) => tagObj = o2 });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify4;
  }
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify4 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify4.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify4.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "node_modules/yaml/dist/log.js"(exports) {
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge2 = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge2.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge2.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge2.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge2;
  }
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    var log = require_log();
    var merge2 = require_merge();
    var stringify4 = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge2.isMergeKey(ctx, key))
        merge2.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify4.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "node_modules/yaml/dist/nodes/Pair.js"(exports) {
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k2 = createNode.createNode(key, void 0, ctx);
      const v2 = createNode.createNode(value, void 0, ctx);
      return new Pair(k2, v2);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_2, ctx) {
        const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    var identity = require_identity();
    var stringify4 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify5 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify5(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i2 = 0; i2 < items.length; ++i2) {
        const item = items[i2];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify4.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i2 = 1; i2 < lines.length; ++i2) {
          const line = lines[i2];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i2 = 0; i2 < items.length; ++i2) {
        const item = items[i2];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify4.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i2 < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start: start2, end } = flowChars;
      if (lines.length === 0) {
        return start2 + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start2;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start2}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k2 = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k2)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k2)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair, overwrite) {
        let _pair;
        if (identity.isPair(pair))
          _pair = pair;
        else if (!pair || typeof pair !== "object" || !("key" in pair)) {
          _pair = new Pair.Pair(pair, pair?.value);
        } else
          _pair = new Pair.Pair(pair.key, pair.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i2 = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i2 === -1)
            this.items.push(_pair);
          else
            this.items.splice(i2, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_2, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "node_modules/yaml/dist/schema/common/map.js"(exports) {
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_2, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i2 = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i2++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i2 = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i2++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "node_modules/yaml/dist/schema/common/seq.js"(exports) {
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "node_modules/yaml/dist/schema/common/string.js"(exports) {
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "node_modules/yaml/dist/schema/common/null.js"(exports) {
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "node_modules/yaml/dist/schema/core/bool.js"(exports) {
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    function stringifyNumber({ format, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n2 = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n2) && !n2.includes("e")) {
        let i2 = n2.indexOf(".");
        if (i2 < 0) {
          i2 = n2.length;
          n2 += ".";
        }
        let d2 = minFractionDigits - (n2.length - i2 - 1);
        while (d2-- > 0)
          n2 += "0";
      }
      return n2;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "node_modules/yaml/dist/schema/core/float.js"(exports) {
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "node_modules/yaml/dist/schema/core/int.js"(exports) {
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "node_modules/yaml/dist/schema/core/schema.js"(exports) {
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "node_modules/yaml/dist/schema/json/schema.js"(exports) {
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i2 = 0; i2 < str.length; ++i2)
            buffer[i2] = str.charCodeAt(i2);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s2 = "";
          for (let i2 = 0; i2 < buf.length; ++i2)
            s2 += String.fromCharCode(buf[i2]);
          str = btoa(s2);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n2 = Math.ceil(str.length / lineWidth);
          const lines = new Array(n2);
          for (let i2 = 0, o2 = 0; i2 < n2; ++i2, o2 += lineWidth) {
            lines[i2] = str.substr(o2, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i2 = 0; i2 < seq.items.length; ++i2) {
          let item = seq.items[i2];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair.value ?? pair.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair;
          }
          seq.items[i2] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i2 = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i2++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_2, ctx) {
        if (!ctx)
          return super.toJSON(_2);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair of this.items) {
          let key, value;
          if (identity.isPair(pair)) {
            key = toJS.toJS(pair.key, "", ctx);
            value = toJS.toJS(pair.value, key, ctx);
          } else {
            key = toJS.toJS(pair, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f3 = str.substring(dot + 1).replace(/_/g, "");
          if (f3[f3.length - 1] === "0")
            node.minFractionDigits = f3.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n3 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n3 : n3;
      }
      const n2 = parseInt(str, radix);
      return sign === "-" ? -1 * n2 : n2;
    }
    function intStringify(node, radix, prefix) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair;
        if (identity.isPair(key))
          pair = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair = new Pair.Pair(key.key, null);
        else
          pair = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair.key);
        if (!prev)
          this.items.push(pair);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_2, ctx) {
        return super.toJSON(_2, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n2) => asBigInt ? BigInt(n2) : Number(n2);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p2) => res2 * num(60) + num(p2), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n2) => n2;
      if (typeof value === "bigint")
        num = (n2) => BigInt(n2);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n2) => String(n2).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match = str.match(timestamp.test);
        if (!match)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match.map(Number);
        const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match[8];
        if (tz && tz !== "Z") {
          let d2 = parseSexagesimal(tz, false);
          if (Math.abs(d2) < 30)
            d2 *= 60;
          date -= 6e4 * d2;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge2 = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge2.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "node_modules/yaml/dist/schema/tags.js"(exports) {
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge2 = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge2.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge2.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge2.merge) ? schemaTags.concat(merge2.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge2.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "node_modules/yaml/dist/schema/Schema.js"(exports) {
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a2, b2) => a2.key < b2.key ? -1 : a2.key > b2.key ? 1 : 0;
    var Schema2 = class _Schema {
      constructor({ compat, customTags, merge: merge2, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge2);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema2;
  }
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    var identity = require_identity();
    var stringify4 = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify4.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify4.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify4.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "node_modules/yaml/dist/doc/Document.js"(exports) {
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema2 = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name2) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name2 || prev.has(name2) ? anchors.findNewAnchor(name2 || "a", prev) : name2;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v2) => typeof v2 === "number" || v2 instanceof String || v2 instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k2 = this.createNode(key, null, options);
        const v2 = this.createNode(value, null, options);
        return new Pair.Pair(k2, v2);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path) {
        if (Collection.isEmptyPath(path)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path, keepScalar) {
        if (Collection.isEmptyPath(path))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path) {
        if (Collection.isEmptyPath(path))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path, value) {
        if (Collection.isEmptyPath(path)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema2.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s2 = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s2}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "node_modules/yaml/dist/errors.js"(exports) {
    var YAMLError = class extends Error {
      constructor(name2, pos, code, message) {
        super();
        this.name = name2;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start2 = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start2 ?? (start2 = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start2 ?? (start2 = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start2 ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a2, b2) => a2 === b2 || identity.isScalar(a2) && identity.isScalar(b2) && a2.value === b2.value;
      return items.some((pair) => isEqual(pair.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start: start2, key, sep, value } = collItem;
        const keyProps = resolveProps.resolveProps(start2, {
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start2[start2.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start2, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          map.items.push(pair);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start: start2, value } of bs.items) {
        const props = resolveProps.resolveProps(start2, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start2, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep + cb;
              sep = "";
              break;
            }
            case "newline":
              if (comment)
                sep += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i2 = 0; i2 < fc.items.length; ++i2) {
        const collItem = fc.items[i2];
        const { start: start2, key, sep, value } = collItem;
        const props = resolveProps.resolveProps(start2, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep && !value) {
            if (i2 === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i2 < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i2 === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start2) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start2, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep)
                for (const st of sep) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name2 = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name2} must end with a ${expectedEnd}` : `${name2} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t3) => t3.tag === tagName && t3.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start2 = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start2, start2, start2] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i2 = lines.length - 1; i2 >= 0; --i2) {
        const content = lines[i2][1];
        if (content === "" || content === "\r")
          chompStart = i2;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start2 + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start2, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i2 = 0; i2 < chompStart; ++i2) {
        const [indent, content] = lines[i2];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i2;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i2 = lines.length - 1; i2 >= chompStart; --i2) {
        if (lines[i2][0].length > trimIndent)
          chompStart = i2 + 1;
      }
      let value = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i2 = 0; i2 < contentStart; ++i2)
        value += lines[i2][0].slice(trimIndent) + "\n";
      for (let i2 = contentStart; i2 < chompStart; ++i2) {
        let [indent, content] = lines[i2];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep === " ")
            sep = "\n";
          else if (!prevMoreIndented && sep === "\n")
            sep = "\n\n";
          value += sep + indent.slice(trimIndent) + content;
          sep = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep === "\n")
            value += "\n";
          else
            sep = "\n";
        } else {
          value += sep + content;
          sep = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i2 = chompStart; i2 < lines.length; ++i2)
            value += "\n" + lines[i2][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start2 + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start2, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i2 = 1; i2 < source.length; ++i2) {
        const ch = source[i2];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n2 = Number(ch);
          if (!indent && n2)
            indent = n2;
          else if (error === -1)
            error = offset + i2;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i2 = 1; i2 < props.length; ++i2) {
        const token = props[i2];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m2 = first.match(/^( *)/);
      const line0 = m2?.[1] ? [m2[1], first.slice(m2[1].length)] : ["", first];
      const lines = [line0];
      for (let i2 = 1; i2 < split.length; i2 += 2)
        lines.push([split[i2], split[i2 + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re2 = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re2.comment,
        range: [offset, valueEnd, re2.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      const line = /(.*?)\r?\n/sy;
      let match = line.exec(source);
      if (!match)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$");
        trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/;
        trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match[1].replace(trimEnd, "");
      let sep = " ";
      let pos = line.lastIndex;
      while (match = line.exec(source)) {
        const lm = match[1].replace(trimBoth, "");
        if (lm === "") {
          if (sep === "\n")
            res += sep;
          else
            sep = "\n";
        } else {
          res += sep + lm;
          sep = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match = last.exec(source);
      return res + sep + (match?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i2 = 1; i2 < source.length - 1; ++i2) {
        const ch = source[i2];
        if (ch === "\r" && source[i2 + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i2);
          res += fold;
          i2 = offset;
        } else if (ch === "\\") {
          let next = source[++i2];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i2 + 1];
            while (next === " " || next === "	")
              next = source[++i2 + 1];
          } else if (next === "\r" && source[i2 + 1] === "\n") {
            next = source[++i2 + 1];
            while (next === " " || next === "	")
              next = source[++i2 + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i2 + 1, length, onError);
            i2 += length;
          } else {
            const raw = source.substr(i2 - 1, 2);
            onError(i2 - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i2;
          let next = source[i2 + 1];
          while (next === " " || next === "	")
            next = source[++i2 + 1];
          if (next !== "\n" && !(next === "\r" && source[i2 + 2] === "\n"))
            res += i2 > wsStart ? source.slice(wsStart, i2 + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok2 = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok2 ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i2 = pos - 1; i2 >= 0; --i2) {
          let st = before[i2];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i2];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i2];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "node_modules/yaml/dist/compose/compose-node.js"(exports) {
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re2 = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re2.offset];
      if (re2.comment)
        alias.comment = re2.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start: start2, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start2, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start2, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re2 = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re2.comment)
        doc.comment = re2.comment;
      doc.range = [offset, contentEnd, re2.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "node_modules/yaml/dist/compose/composer.js"(exports) {
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i2 = 0; i2 < prelude.length; ++i2) {
        const source = prelude[i2];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i2 + 1]?.[0] !== "#")
              i2 += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i2 = 0; i2 < this.errors.length; ++i2)
            doc.errors.push(this.errors[i2]);
          for (let i2 = 0; i2 < this.warnings.length; ++i2)
            doc.warnings.push(this.warnings[i2]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    var stringify4 = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start: start2, key, sep, value }) {
      let res = "";
      for (const st of start2)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep)
        for (const st of sep)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify4;
  }
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path) => {
      let item = cst;
      for (const [field, index2] of path) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index2];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path) => {
      const parent = visit.itemAtPath(cst, path.slice(0, -1));
      const field = path[path.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path, item, visitor) {
      let ctrl = visitor(item, path);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i2 = 0; i2 < token.items.length; ++i2) {
            const ci = _visit(Object.freeze(path.concat([[field, i2]])), token.items[i2], visitor);
            if (typeof ci === "number")
              i2 = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i2, 1);
              i2 -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
    }
    exports.visit = visit;
  }
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "node_modules/yaml/dist/parse/cst.js"(exports) {
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "node_modules/yaml/dist/parse/lexer.js"(exports) {
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i2 = this.pos;
        let ch = this.buffer[i2];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i2];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i2 + 1] === "\n";
        return false;
      }
      charAt(n2) {
        return this.buffer[this.pos + n2];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n2) {
        return this.pos + n2 <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n2) {
        return this.buffer.substr(this.pos, n2);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n2 = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n2);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s2 = this.peek(3);
          if ((s2 === "---" || s2 === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s2 === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n2 = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n2;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n2 = yield* this.pushIndicators();
        switch (line[n2]) {
          case "#":
            yield* this.pushCount(line.length - n2);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n2 += yield* this.parseBlockScalarHeader();
            n2 += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n2);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n2 = 0;
        while (line[n2] === ",") {
          n2 += yield* this.pushCount(1);
          n2 += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n2 += yield* this.pushIndicators();
        switch (line[n2]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n2);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n2 = 0;
            while (this.buffer[end - 1 - n2] === "\\")
              n2 += 1;
            if (n2 % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i2 = this.pos;
        while (true) {
          const ch = this.buffer[++i2];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i3 = this.pos; ch = this.buffer[i3]; ++i3) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i3;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i3 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i2 = nl + 1;
        ch = this.buffer[i2];
        while (ch === " ")
          ch = this.buffer[++i2];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i2];
          nl = i2 - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i3 = nl - 1;
            let ch2 = this.buffer[i3];
            if (ch2 === "\r")
              ch2 = this.buffer[--i3];
            const lastChar = i3;
            while (ch2 === " ")
              ch2 = this.buffer[--i3];
            if (ch2 === "\n" && i3 >= this.pos && i3 + 1 + indent > lastChar)
              nl = i3;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i2 = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i2]) {
          if (ch === ":") {
            const next = this.buffer[i2 + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i2;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i2 + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i2 += 1;
                ch = "\n";
                next = this.buffer[i2 + 1];
              } else
                end = i2;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i2 + 1);
              if (cs === -1)
                break;
              i2 = Math.max(i2, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i2;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n2) {
        if (n2 > 0) {
          yield this.buffer.substr(this.pos, n2);
          this.pos += n2;
          return n2;
        }
        return 0;
      }
      *pushToIndex(i2, allowEmpty) {
        const s2 = this.buffer.slice(this.pos, i2);
        if (s2) {
          yield s2;
          this.pos += s2.length;
          return s2.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n2 = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n2 += yield* this.pushTag();
              n2 += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n2 += yield* this.pushUntil(isNotAnchorChar);
              n2 += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n2 += yield* this.pushCount(1);
                n2 += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n2;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i2 = this.pos + 2;
          let ch = this.buffer[i2];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i2];
          return yield* this.pushToIndex(ch === ">" ? i2 + 1 : i2, false);
        } else {
          let i2 = this.pos + 1;
          let ch = this.buffer[i2];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i2];
            else if (ch === "%" && hexDigits.has(this.buffer[i2 + 1]) && hexDigits.has(this.buffer[i2 + 2])) {
              ch = this.buffer[i2 += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i2, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i2 = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i2];
        } while (ch === " " || allowTabs && ch === "	");
        const n2 = i2 - this.pos;
        if (n2 > 0) {
          yield this.buffer.substr(this.pos, n2);
          this.pos = i2;
        }
        return n2;
      }
      *pushUntil(test) {
        let i2 = this.pos;
        let ch = this.buffer[i2];
        while (!test(ch))
          ch = this.buffer[++i2];
        return yield* this.pushToIndex(i2, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "node_modules/yaml/dist/parse/line-counter.js"(exports) {
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start2 = this.lineStarts[low - 1];
          return { line: low, col: offset - start2 + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "node_modules/yaml/dist/parse/parser.js"(exports) {
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i2 = 0; i2 < list.length; ++i2)
        if (list[i2].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i2 = 0; i2 < list.length; ++i2) {
        switch (list[i2].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i2;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i2 = prev.length;
      loop: while (--i2 >= 0) {
        switch (prev[i2].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i2]?.type === "space") {
      }
      return prev.splice(i2, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i2 = 0; i2 < source.length; ++i2)
          target.push(source[i2]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n2) {
        return this.stack[this.stack.length - n2];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start2 = getFirstKeyStartProps(prev);
          let sep;
          if (scalar.end) {
            sep = scalar.end;
            sep.push(this.sourceToken);
            delete scalar.end;
          } else
            sep = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start: start2, key: scalar, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start2 = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i2 = 0; i2 < it.sep.length; ++i2) {
              const st = it.sep[i2];
              switch (st.type) {
                case "newline":
                  nl.push(i2);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start2 = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start2.push(this.sourceToken);
                map.items.push({ start: start2 });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start2.push(this.sourceToken);
                map.items.push({ start: start2, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start3 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start3, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start3 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep = it.sep;
                  sep.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start3, key, sep }]
                  });
                } else if (start2.length > 0) {
                  it.sep = it.sep.concat(start2, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start: start2, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start: start2, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start: start2 });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start2 = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep = fc.end.splice(1, fc.end.length);
            sep.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start: start2, key: fc, sep }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start2 = getFirstKeyStartProps(prev);
            start2.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: start2, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start2 = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: start2, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start2, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start2.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "node_modules/yaml/dist/public-api.js"(exports) {
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs2 = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs2) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs2.length > 0)
        return docs2;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse2(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify4(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse2;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument;
    exports.stringify = stringify4;
  }
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "node_modules/yaml/dist/index.js"(exports) {
    var composer = require_composer();
    var Document = require_Document();
    var Schema2 = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema2.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// node_modules/inline-style-parser/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/inline-style-parser/cjs/index.js"(exports, module) {
    var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
    var NEWLINE_REGEX = /\n/g;
    var WHITESPACE_REGEX = /^\s*/;
    var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
    var COLON_REGEX = /^:\s*/;
    var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
    var SEMICOLON_REGEX = /^[;\s]*/;
    var TRIM_REGEX = /^\s+|\s+$/g;
    var NEWLINE = "\n";
    var FORWARD_SLASH = "/";
    var ASTERISK = "*";
    var EMPTY_STRING = "";
    var TYPE_COMMENT = "comment";
    var TYPE_DECLARATION = "declaration";
    function index2(style, options) {
      if (typeof style !== "string") {
        throw new TypeError("First argument must be a string");
      }
      if (!style) return [];
      options = options || {};
      var lineno = 1;
      var column = 1;
      function updatePosition(str) {
        var lines = str.match(NEWLINE_REGEX);
        if (lines) lineno += lines.length;
        var i2 = str.lastIndexOf(NEWLINE);
        column = ~i2 ? str.length - i2 : column + str.length;
      }
      function position3() {
        var start2 = { line: lineno, column };
        return function(node) {
          node.position = new Position(start2);
          whitespace2();
          return node;
        };
      }
      function Position(start2) {
        this.start = start2;
        this.end = { line: lineno, column };
        this.source = options.source;
      }
      Position.prototype.content = style;
      function error(msg) {
        var err = new Error(
          options.source + ":" + lineno + ":" + column + ": " + msg
        );
        err.reason = msg;
        err.filename = options.source;
        err.line = lineno;
        err.column = column;
        err.source = style;
        if (options.silent) ;
        else {
          throw err;
        }
      }
      function match(re2) {
        var m2 = re2.exec(style);
        if (!m2) return;
        var str = m2[0];
        updatePosition(str);
        style = style.slice(str.length);
        return m2;
      }
      function whitespace2() {
        match(WHITESPACE_REGEX);
      }
      function comments(rules) {
        var c2;
        rules = rules || [];
        while (c2 = comment()) {
          if (c2 !== false) {
            rules.push(c2);
          }
        }
        return rules;
      }
      function comment() {
        var pos = position3();
        if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;
        var i2 = 2;
        while (EMPTY_STRING != style.charAt(i2) && (ASTERISK != style.charAt(i2) || FORWARD_SLASH != style.charAt(i2 + 1))) {
          ++i2;
        }
        i2 += 2;
        if (EMPTY_STRING === style.charAt(i2 - 1)) {
          return error("End of comment missing");
        }
        var str = style.slice(2, i2 - 2);
        column += 2;
        updatePosition(str);
        style = style.slice(i2);
        column += 2;
        return pos({
          type: TYPE_COMMENT,
          comment: str
        });
      }
      function declaration() {
        var pos = position3();
        var prop = match(PROPERTY_REGEX);
        if (!prop) return;
        comment();
        if (!match(COLON_REGEX)) return error("property missing ':'");
        var val = match(VALUE_REGEX);
        var ret = pos({
          type: TYPE_DECLARATION,
          property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
          value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
        });
        match(SEMICOLON_REGEX);
        return ret;
      }
      function declarations() {
        var decls = [];
        comments(decls);
        var decl;
        while (decl = declaration()) {
          if (decl !== false) {
            decls.push(decl);
            comments(decls);
          }
        }
        return decls;
      }
      whitespace2();
      return declarations();
    }
    function trim(str) {
      return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
    }
    module.exports = index2;
  }
});

// node_modules/style-to-object/cjs/index.js
var require_cjs2 = __commonJS({
  "node_modules/style-to-object/cjs/index.js"(exports) {
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StyleToObject;
    var inline_style_parser_1 = __importDefault(require_cjs());
    function StyleToObject(style, iterator) {
      let styleObject = null;
      if (!style || typeof style !== "string") {
        return styleObject;
      }
      const declarations = (0, inline_style_parser_1.default)(style);
      const hasIterator = typeof iterator === "function";
      declarations.forEach((declaration) => {
        if (declaration.type !== "declaration") {
          return;
        }
        const { property, value } = declaration;
        if (hasIterator) {
          iterator(property, value, declaration);
        } else if (value) {
          styleObject = styleObject || {};
          styleObject[property] = value;
        }
      });
      return styleObject;
    }
  }
});

// node_modules/style-to-js/cjs/utilities.js
var require_utilities = __commonJS({
  "node_modules/style-to-js/cjs/utilities.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.camelCase = void 0;
    var CUSTOM_PROPERTY_REGEX = /^--[a-zA-Z0-9_-]+$/;
    var HYPHEN_REGEX = /-([a-z])/g;
    var NO_HYPHEN_REGEX = /^[^-]+$/;
    var VENDOR_PREFIX_REGEX = /^-(webkit|moz|ms|o|khtml)-/;
    var MS_VENDOR_PREFIX_REGEX = /^-(ms)-/;
    var skipCamelCase = function(property) {
      return !property || NO_HYPHEN_REGEX.test(property) || CUSTOM_PROPERTY_REGEX.test(property);
    };
    var capitalize = function(match, character) {
      return character.toUpperCase();
    };
    var trimHyphen = function(match, prefix) {
      return "".concat(prefix, "-");
    };
    var camelCase = function(property, options) {
      if (options === void 0) {
        options = {};
      }
      if (skipCamelCase(property)) {
        return property;
      }
      property = property.toLowerCase();
      if (options.reactCompat) {
        property = property.replace(MS_VENDOR_PREFIX_REGEX, trimHyphen);
      } else {
        property = property.replace(VENDOR_PREFIX_REGEX, trimHyphen);
      }
      return property.replace(HYPHEN_REGEX, capitalize);
    };
    exports.camelCase = camelCase;
  }
});

// node_modules/style-to-js/cjs/index.js
var require_cjs3 = __commonJS({
  "node_modules/style-to-js/cjs/index.js"(exports, module) {
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var style_to_object_1 = __importDefault(require_cjs2());
    var utilities_1 = require_utilities();
    function StyleToJS(style, options) {
      var output = {};
      if (!style || typeof style !== "string") {
        return output;
      }
      (0, style_to_object_1.default)(style, function(property, value) {
        if (property && value) {
          output[(0, utilities_1.camelCase)(property, options)] = value;
        }
      });
      return output;
    }
    StyleToJS.default = StyleToJS;
    module.exports = StyleToJS;
  }
});

// vendor/obsidian-pm/packages/core/src/yaml.ts
var codec;
function setYamlCodec(next) {
  codec = next;
}
function parseYaml(raw) {
  if (!codec) throw new Error("YAML codec not configured; call setYamlCodec first");
  return codec.parse(raw);
}

// vendor/obsidian-pm/packages/core/src/store/YamlParser.ts
var FRONTMATTER_KEY = "pm-project";
var TASK_FRONTMATTER_KEY = "pm-task";
var FRONTMATTER_BLOCK = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
var toLf = (text2) => text2.replace(/\r\n/g, "\n");
function parseFrontmatter(content) {
  const block = FRONTMATTER_BLOCK.exec(content);
  if (!block) return { kind: "none", body: toLf(content) };
  let parsed;
  try {
    parsed = parseYaml(toLf(block[1]));
  } catch {
    return { kind: "malformed" };
  }
  const frontmatter = parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  return { kind: "frontmatter", frontmatter, body: toLf(content.slice(block[0].length)).trim() };
}
function stripProjectAutoContent(body) {
  return body.replace(/^#[ \t][^\n]*(?:\n|$)/, "").replace(/(?:^|\n)## Tasks[\s\S]*$/, "").trim();
}

// src/yaml.ts
var import_yaml3 = __toESM(require_dist());
var installed = false;
function installYamlCodec() {
  if (installed) return;
  setYamlCodec({ parse: import_yaml3.parse, stringify: import_yaml3.stringify });
  installed = true;
}

// src/generated/viewer-css.ts
var viewer_css_default = '.pm-root{--pm-ghost-border: rgba(0, 0, 0, .06);--pm-shadow-ambient: rgba(0, 0, 0, .06);font-family:var(--font-interface);color:var(--text-normal);display:flex;flex-direction:column;height:100%;position:relative;overflow:hidden}.pm-view-switcher{display:inline-flex;align-items:center;background:var(--background-modifier-hover);border-radius:var(--radius-s);padding:2px;gap:2px}.pm-view-switcher .pm-view-btn.clickable-icon{border-radius:calc(var(--radius-s) - 2px);background:transparent;color:var(--text-muted);transition:background .12s,color .12s}.pm-view-switcher .pm-view-btn.clickable-icon:hover{background:transparent;color:var(--text-normal)}.pm-view-switcher .pm-view-btn--active.clickable-icon,.pm-view-switcher .pm-view-btn--active.clickable-icon:hover{background:var(--background-primary);color:var(--text-normal)}.pm-content{flex:1;overflow:auto;position:relative}.pm-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--text-muted);padding:40px}.pm-empty-icon{display:flex;font-size:48px;--icon-size: 32px}.pm-empty-action{display:flex;gap:8px}.pm-filter-empty{flex:1}.pm-project-list-container{padding:8px 16px 24px}.pm-project-th-title{width:100%}.pm-project-table td{white-space:nowrap}.pm-project-row{cursor:pointer}.pm-project-table .pm-table-cell-title{max-width:0}.pm-project-table .pm-table-title-inner{flex-wrap:nowrap}.pm-project-table .pm-task-title-text{min-width:0;overflow:hidden;text-overflow:ellipsis}.pm-project-row-icon{flex-shrink:0;display:inline-flex;align-items:center;font-size:15px;--pm-glyph-size: 15px;line-height:1}.pm-project-row:hover .pm-task-title-text{color:var(--interactive-accent)}.pm-project-row-empty{font-size:var(--font-ui-smaller);color:var(--text-faint)}.pm-project-row-tasks{color:var(--text-muted);margin-right:6px}.pm-project-group-row td{padding:10px 4px 4px;border-bottom:1px solid var(--background-modifier-border)}.pm-project-group{display:flex;align-items:center;gap:6px;font-size:var(--font-ui-smaller);font-weight:600;color:var(--text-muted)}.pm-project-group-count{color:var(--text-faint);font-weight:400;font-variant-numeric:tabular-nums}.pm-vh{display:flex;flex-direction:column;flex-shrink:0;border-bottom:1px solid var(--background-modifier-border);background:var(--background-primary);container:pm-vh / inline-size}.pm-vh-row{display:flex;align-items:center;gap:4px;height:40px;padding:0 8px;overflow:hidden}.pm-vh-slot{display:flex;align-items:center;gap:4px;flex-shrink:0}.pm-vh-slot:empty{display:none}.pm-vh-context{flex-shrink:1;min-width:160px;overflow:hidden}.pm-vh-context>*,.pm-crumbs>*,.pm-crumb-ancestors>*{flex-shrink:0}.pm-vh-context>.pm-crumbs{flex-shrink:1;min-width:0;overflow:hidden}.pm-crumbs>button.pm-crumb--current{flex-shrink:1;min-width:48px}.pm-vh--terse .pm-vh-context{min-width:96px}.pm-vh--measuring .pm-vh-context{flex-shrink:0}.pm-vh-view{min-width:0}.pm-vh-spacer{flex:1;min-width:8px}.pm-vh-view:not(:empty),.pm-vh-options:not(:empty),.pm-vh-tune,.pm-vh-actions:not(:empty){margin-left:4px;padding-left:8px;border-left:1px solid var(--background-modifier-border)}.pm-vh button.pm-chip-btn{gap:4px;height:28px;padding:0 8px;box-shadow:none;background:transparent;--icon-size: 16px}.pm-vh button.pm-chip-btn:hover,button.pm-crumb:hover{background:var(--background-modifier-hover);color:var(--text-normal)}.pm-vh button.pm-chip-btn--active{background:color-mix(in srgb,var(--interactive-accent) 12%,transparent);color:var(--text-accent)}.pm-vh button.pm-chip-btn--active:hover{background:color-mix(in srgb,var(--interactive-accent) 18%,transparent);color:var(--text-accent)}.pm-vh button.pm-chip-btn--icon-only{width:28px;padding:0;justify-content:center}.pm-vh-saved-view .pm-chip-btn-label{max-width:180px;overflow:hidden;text-overflow:ellipsis}.pm-vh-saved-view--none .pm-chip-btn-label{color:var(--text-muted)}.pm-vh-count{font-size:var(--font-ui-smaller);font-variant-numeric:tabular-nums;color:var(--text-muted);white-space:nowrap}.pm-vh--icons .pm-vh-query .pm-chip-btn-icon+.pm-chip-btn-label,.pm-vh--icons .pm-vh-options .pm-chip-btn-icon+.pm-chip-btn-label,.pm-vh--icons .pm-vh-count{display:none}.pm-vh--terse .pm-vh-saved-view .pm-chip-btn-label,.pm-vh--terse .pm-vh-saved-view .pm-chip-btn-chevron,.pm-vh--terse .pm-crumb-mode-label,.pm-vh--terse .pm-vh-save-view,.pm-vh--bare .pm-crumb--mode,.pm-vh--bare .pm-crumb-mode-sep,.pm-vh--tight .pm-split-btn-label{display:none}.pm-vh--bare .pm-vh-view:not(:empty),.pm-vh--bare .pm-vh-tune,.pm-vh--bare .pm-vh-actions:not(:empty){margin-left:0;padding-left:4px}.pm-vh-row>.pm-vh-tune,.pm-vh--tuned .pm-vh-query,.pm-vh--tuned .pm-vh-options{display:none}.pm-vh--tuned .pm-vh-row>.pm-vh-tune{display:flex}.pm-tune-row{display:flex;align-items:center;gap:9px;padding:2px 4px 2px 9px;font-size:var(--font-ui-smaller)}.pm-tune-pop .pm-pop-item-note{max-width:50%}.pm-crumbs{display:flex;align-items:center;gap:2px;font-size:var(--font-ui-small)}.pm-crumbs-glyph{display:inline-flex;margin-right:4px;--pm-glyph-size: 16px;--icon-size: 16px}button.pm-crumb{display:inline-flex;align-items:center;gap:4px;height:28px;min-width:0;padding:0 6px;border:none;border-radius:var(--radius-s);background:transparent;box-shadow:none;color:var(--text-muted);font-size:inherit;white-space:nowrap;cursor:pointer;--icon-size: 14px}button.pm-crumb:focus-visible,button.pm-filter-chip-part:focus-visible{outline:2px solid var(--background-modifier-border-focus);outline-offset:-2px}button.pm-crumb:disabled{cursor:default;opacity:1}button.pm-crumb:disabled:hover{background:transparent}button.pm-crumb--current{color:var(--text-normal);font-weight:600}.pm-crumb-title{overflow:hidden;text-overflow:ellipsis}button.pm-crumb--scoped{background:color-mix(in srgb,var(--interactive-accent) 12%,transparent);color:var(--text-accent)}button.pm-crumb--scoped:hover{background:color-mix(in srgb,var(--interactive-accent) 18%,transparent);color:var(--text-accent)}.pm-crumb-badge{flex-shrink:0;padding:0 5px;border-radius:var(--radius-s);background:var(--background-modifier-hover);color:var(--text-muted);font-size:var(--font-ui-smaller);font-weight:400;font-variant-numeric:tabular-nums}.pm-chip-btn-icon,.pm-chip-btn-chevron,.pm-crumb-icon,.pm-crumb-chevron,.pm-crumb-sep,.pm-split-btn-icon,.pm-filter-chip-icon{display:inline-flex}.pm-chip-btn-label:empty,.pm-split-btn-label:empty{display:none}.pm-chip-btn-chevron,.pm-crumb-chevron,.pm-crumb-sep{color:var(--text-faint);--icon-size: 12px}.pm-crumb-ancestors{display:contents}button.pm-crumb-fold,.pm-crumb-fold-sep{display:none}.pm-vh--folded button.pm-crumb-fold,.pm-vh--folded .pm-crumb-fold-sep{display:inline-flex}.pm-vh--folded .pm-crumb-ancestors{display:none}.pm-search-box{display:flex;align-items:center;height:28px;border-radius:var(--radius-s);--icon-size: 16px}.pm-search-box.is-open{width:220px;background:var(--background-modifier-form-field);box-shadow:inset 0 0 0 1px var(--background-modifier-border)}.pm-search-box.pm-search-box--pop{width:auto}.pm-search-box-toggle{flex-shrink:0;width:28px;height:28px}input.pm-search-box-input{display:none;flex:1;min-width:0;height:28px;padding:0 4px;border:none;background:transparent;box-shadow:none;font-size:var(--font-ui-smaller)}input.pm-search-box-input:focus{box-shadow:none}.pm-search-box.is-open input.pm-search-box-input{display:block}.pm-search-box-clear{display:none;flex-shrink:0;--icon-size: 14px}.pm-search-box.has-value .pm-search-box-clear{display:inline-flex}.pm-chip-btn-badge{min-width:16px;padding:0 4px;border-radius:8px;background:var(--interactive-accent);color:var(--text-on-accent);font-size:10px;font-weight:600;line-height:16px;text-align:center;font-variant-numeric:tabular-nums}.pm-split-btn{display:inline-flex;align-items:center}.pm-split-btn button{display:inline-flex;align-items:center;gap:4px;height:28px;padding:0 10px;font-size:var(--font-ui-small);font-weight:500;--icon-size: 14px}.pm-split-btn--split .pm-split-btn-main{border-top-right-radius:0;border-bottom-right-radius:0}.pm-split-btn button.pm-split-btn-menu{padding:0 6px;margin-left:1px;border-top-left-radius:0;border-bottom-left-radius:0;--icon-size: 12px}.pm-vh-bar:empty{display:none}.pm-filter-bar{display:flex;align-items:center;gap:8px;min-height:36px;padding:0 8px;border-top:1px solid var(--background-modifier-border)}.pm-filter-bar-chips{display:flex;align-items:center;gap:4px;flex:1;min-width:0;overflow-x:auto;scrollbar-width:none}.pm-filter-bar-end{display:flex;margin-left:auto;align-items:center;gap:4px;flex-shrink:0;font-size:var(--font-ui-smaller);color:var(--text-muted)}.pm-filter-bar-summary{font-variant-numeric:tabular-nums;white-space:nowrap}.pm-filter-bar button.pm-chip-btn{height:24px}.pm-filter-bar button.pm-filter-bar-list{display:none;color:var(--text-accent)}@container pm-vh (max-width: 480px){.pm-filter-bar-chips{display:none}.pm-filter-bar button.pm-filter-bar-list{display:inline-flex}}.pm-filter-list-row,.pm-saved-view-row,.pm-sort-pop-foot{display:flex;align-items:center}.pm-filter-list-row button.pm-pop-item,.pm-saved-view-row .pm-saved-view-main{flex:1;min-width:0}.pm-filter-list-row .pm-pop-item-note{max-width:60%}.pm-filter-list-remove,.pm-filter-bar-close,.pm-saved-view-action,.pm-sort-remove,.pm-vis-eye{--icon-size: 14px}.pm-filter-chip{display:inline-flex;align-items:center;flex-shrink:0;height:24px;border:1px solid var(--background-modifier-border);border-radius:var(--radius-s);background:var(--background-secondary);font-size:var(--font-ui-smaller);white-space:nowrap}button.pm-filter-chip-part{display:inline-flex;align-items:center;gap:4px;height:100%;padding:0 6px;border:none;border-radius:0;background:transparent;box-shadow:none;color:var(--text-normal);font-size:inherit;cursor:pointer;--icon-size: 12px}button.pm-filter-chip-part:hover{background:var(--background-modifier-hover)}button.pm-filter-chip-field{color:var(--text-muted)}button.pm-filter-chip-op{padding:0 2px;color:var(--text-faint)}button.pm-filter-chip-value{max-width:220px;overflow:hidden;text-overflow:ellipsis;font-weight:500}button.pm-filter-chip-remove{padding:0 4px;color:var(--text-faint)}.pm-saved-view-note,.pm-sort-pop-count{padding:0 8px;font-size:var(--font-ui-smaller);color:var(--text-faint)}.pm-switcher-presets{display:flex;flex-wrap:wrap;gap:4px;padding:2px 4px 6px}.pm-switcher-list{max-height:320px;overflow-y:auto}.pm-switcher-line{display:flex;align-items:center;gap:2px;padding-left:calc(9px + var(--pm-depth, 0) * 16px)}.pm-switcher-line .pm-collapse-toggle,.pm-switcher-gap{flex-shrink:0;width:16px}.pm-pop-list .pm-switcher-line button.pm-switcher-row{flex:1;min-width:0;padding-left:4px}.pm-switcher-foot{display:flex;align-items:center;gap:4px;padding:4px 4px 0}.pm-switcher-summary{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:var(--text-muted);font-size:var(--font-ui-smaller)}.pm-filter-pop-ops{display:flex;flex-wrap:wrap;gap:4px;padding:0 4px 6px}.pm-filter-pop-ops button.pm-chip-btn,.pm-switcher-presets button.pm-chip-btn{height:24px;padding:0 8px;font-weight:400}.pm-filter-pop-range{display:flex;gap:6px}.pm-pop-item-note{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-faint);font-variant-numeric:tabular-nums}.pm-pop-empty{padding:6px 9px;color:var(--text-muted);font-size:var(--font-ui-smaller);white-space:normal}.pm-dirty-dot{flex-shrink:0;width:6px;height:6px;border-radius:50%;background:var(--color-orange)}.pm-vh-saved-view .pm-dirty-dot{display:none;order:1}.pm-vh-saved-view .pm-chip-btn-chevron{order:2}.pm-vh-saved-view--dirty .pm-dirty-dot{display:inline-block}.pm-vh button.pm-vh-save-view{color:var(--text-accent)}.pm-saved-views-dirty{display:flex;flex-direction:column;gap:6px;margin-bottom:4px;padding:6px 9px 8px;border-bottom:1px solid var(--background-modifier-border);font-size:var(--font-ui-smaller)}.pm-saved-views-dirty-note{display:flex;align-items:center;gap:6px;color:var(--text-muted)}.pm-saved-views-dirty-actions{display:flex;align-items:center;gap:6px;--icon-size: 14px}.pm-saved-views-dirty-actions button{height:26px;font-size:var(--font-ui-smaller)}.pm-saved-view-action.is-default{color:var(--color-yellow)}.pm-saved-view-rename{flex:1;margin:2px 0}.pm-saved-views-check{display:flex;align-items:center;gap:6px;padding:4px 2px;font-size:var(--font-ui-smaller)}.pm-saved-views-storage{padding:2px 2px 4px;font-size:var(--font-ui-smaller);color:var(--text-faint);white-space:normal}.pm-sort-row{display:flex;align-items:center;gap:6px;padding:3px 4px;border-radius:var(--radius-s)}.pm-saved-view-row.is-dragging,.pm-sort-row.is-dragging,.pm-vis-row.is-dragging{opacity:.5}.pm-sort-grip,.pm-vis-grip{display:inline-flex;color:var(--text-faint);cursor:grab;--icon-size: 14px}.pm-sort-rank{width:12px;color:var(--text-faint);font-size:var(--font-ui-smaller);font-variant-numeric:tabular-nums}select.pm-sort-field,select.pm-sort-dir,select.pm-group-field{height:26px;font-size:var(--font-ui-smaller)}select.pm-sort-field,select.pm-sort-dir{flex:1;min-width:0}.pm-sort-add{flex:1}.pm-sort-indicator sup{margin-left:1px;font-size:9px}.pm-chip-btn-detail{color:var(--text-faint);font-weight:400}.pm-group-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 9px;font-size:var(--font-ui-smaller)}.pm-vis-list{display:flex;flex-direction:column}.pm-vis-row{display:flex;align-items:center;gap:6px;min-height:28px;padding:0 4px;border-radius:var(--radius-s);font-size:var(--font-ui-smaller)}.pm-vis-row:hover{background:var(--background-modifier-hover)}.pm-vis-row.is-hidden .pm-vis-label{color:var(--text-faint)}.pm-vis-row.is-quiet .pm-vis-detail{font-style:italic}.pm-vis-grip{width:14px}.pm-vis-row:not([draggable]) .pm-vis-grip{cursor:default}.pm-vis-glyph{display:inline-flex;--pm-glyph-size: 12px;--icon-size: 12px}.pm-vis-label{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.pm-vis-detail{color:var(--text-faint);font-variant-numeric:tabular-nums}.pm-vis-detail.is-editable{cursor:text}input.pm-vis-detail-input{width:56px;height:22px;font-size:var(--font-ui-smaller)}.pm-vis-lock{display:inline-flex;padding:0 6px;color:var(--text-faint);--icon-size: 12px}.pm-fields-tabs{display:flex;margin-bottom:4px}.pm-fields-tabs button{flex:1;font-size:var(--font-ui-smaller)}.pm-fields-foot{display:flex;justify-content:flex-end;gap:4px}.pm-stepper{display:inline-flex;align-items:center;height:28px;border-radius:var(--radius-s);--icon-size: 14px}.pm-stepper-btn{width:24px;height:24px;padding:0}button.pm-stepper-value{min-width:44px;height:24px;padding:0 4px;border:none;background:transparent;box-shadow:none;color:var(--text-muted);font-size:var(--font-ui-smaller);font-variant-numeric:tabular-nums;cursor:pointer}button.pm-stepper-value:hover{color:var(--text-normal)}.pm-days-list{display:flex;flex-wrap:wrap;align-items:center;gap:4px;padding:6px 9px;border-top:1px solid var(--background-modifier-border)}input.pm-days-input{height:24px;font-size:var(--font-ui-smaller)}.pm-days-note{padding:2px 9px 6px;color:var(--text-faint);font-size:var(--font-ui-smaller);white-space:normal}.pm-vh--phone .pm-vh-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;grid-template-rows:48px 44px;grid-template-areas:"context query more" "view view tune";column-gap:2px;height:auto}.pm-vh--phone .pm-vh-row>.pm-vh-slot{margin-left:0;padding-left:0;border-left:none}.pm-vh--phone .pm-vh-context{grid-area:context;min-width:0}.pm-vh--phone .pm-vh-query{grid-area:query}.pm-vh--phone .pm-vh-query>:not(.pm-search-box),.pm-vh--phone .pm-vh-options,.pm-vh--phone .pm-vh-spacer{display:none}.pm-vh--phone .pm-vh-more{grid-area:more}.pm-vh--phone .pm-vh-view{grid-area:view;gap:6px}.pm-vh--phone .pm-vh-row>.pm-vh-tune{grid-area:tune;display:flex}.pm-vh--phone .pm-crumbs{font-size:var(--font-ui-medium)}.pm-vh--phone .pm-crumbs-glyph{--pm-glyph-size: 18px;--icon-size: 18px}.pm-vh--phone button.pm-crumb{height:44px}.pm-vh--phone button.pm-chip-btn--icon-only,.pm-vh--phone .pm-search-box-toggle{width:44px;height:44px;--icon-size: 20px}.pm-vh--phone .pm-search-box{height:44px}.pm-vh--phone .pm-vh-view button.pm-chip-btn,.pm-vh--phone .pm-vh-tune button.pm-chip-btn{height:32px;padding:0 10px;border:1px solid var(--background-modifier-border);border-radius:16px;--icon-size: 14px}.pm-vh--phone .pm-vh-tune button.pm-chip-btn--active{border-color:transparent}.pm-vh--phone .pm-vh-row>.pm-vh-actions{position:absolute;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:10}.pm-vh--phone .pm-split-btn-label,.pm-vh--phone .pm-split-btn-menu{display:none}.pm-vh--phone .pm-split-btn button.pm-split-btn-main{justify-content:center;width:56px;height:56px;padding:0;border-radius:50%;box-shadow:var(--shadow-s);--icon-size: 24px}.pm-root:has(.pm-vh--phone) .pm-content{padding-bottom:88px}.pm-tune-sheet{display:flex;flex-direction:column;gap:8px}.pm-tune-sheet-tabs{display:flex;gap:2px}.pm-tune-sheet-tabs button.pm-chip-btn{flex:1;justify-content:center;gap:4px;height:32px;font-size:var(--font-ui-small)}.pm-tune-sheet-body{min-height:0}.pm-tune-sheet-foot{display:flex;gap:8px;padding-top:8px;border-top:1px solid var(--background-modifier-border)}.pm-tune-sheet-foot button{height:44px}button.pm-tune-sheet-done{flex:1}.pm-pop--sheet:has(.pm-tune-sheet){box-shadow:0 0 0 100vmax var(--background-modifier-cover)}.pm-pop--sheet button.pm-pop-item{min-height:44px;font-size:var(--font-ui-small)}.pm-table-view{display:flex;flex-direction:column;height:100%}.pm-bulk-bar{display:flex;align-items:center;justify-content:space-between;padding:6px 12px;margin:0 16px 6px;background:color-mix(in srgb,var(--interactive-accent) 8%,var(--background-secondary));border:1px dashed var(--background-modifier-border);border-radius:var(--radius-m);flex-shrink:0;animation:pm-bulk-bar-in .15s ease-out}@keyframes pm-bulk-bar-in{0%{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}.pm-bulk-bar-left{display:flex;align-items:center;gap:8px}.pm-bulk-bar-right{display:flex;align-items:center}.pm-bulk-bar-count{font-size:12px;font-weight:600;color:var(--interactive-accent);padding-right:4px}.pm-checkbox{margin:0;flex-shrink:0}input.pm-checkbox:indeterminate{background-color:var(--interactive-accent);border-color:var(--interactive-accent)}input.pm-checkbox:indeterminate:after{content:"";position:absolute;inset:0;width:8px;height:2px;margin:auto;border-radius:1px;background-color:var(--checkbox-marker-color, var(--text-on-accent))}button.pm-chip-btn,.pm-chip{display:inline-flex;align-items:center;border-radius:var(--radius-s);font-size:var(--font-ui-smaller);font-weight:500;white-space:nowrap}button.pm-chip-btn{gap:4px;height:auto;padding:4px 10px;color:var(--text-muted);transition:background .1s,color .1s}button.pm-chip-btn:focus-visible{outline:2px solid var(--interactive-accent);outline-offset:2px}button.pm-chip-btn--flat,button.pm-chip-btn--outline{background:transparent;box-shadow:none}button.pm-chip-btn--outline{border:1px solid var(--background-modifier-border)}button.pm-chip-btn--flat:hover,button.pm-chip-btn--outline:hover{background:var(--background-modifier-hover);color:var(--text-normal)}button.pm-chip-btn--outline.pm-chip-btn--active{border-color:transparent}button.pm-chip-btn--active{background:color-mix(in srgb,var(--interactive-accent) 12%,transparent);color:var(--text-accent)}button.pm-chip-btn--active:hover{background:color-mix(in srgb,var(--interactive-accent) 18%,transparent);color:var(--text-accent)}.pm-table-row--selected{background:color-mix(in srgb,var(--interactive-accent) 10%,transparent);box-shadow:inset 3px 0 0 var(--interactive-accent)}.pm-table-wrapper{flex:1;overflow:auto}.pm-table{width:100%;border-collapse:collapse;font-size:13px}.pm-table thead th{position:sticky;top:0;background:var(--background-primary);border-bottom:2px solid var(--background-modifier-border);padding:8px 10px;text-align:left;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted);white-space:nowrap;z-index:10;user-select:none}.pm-table-th-sortable{cursor:pointer}.pm-table thead th.pm-table-th-resizable{overflow:hidden;text-overflow:ellipsis}.pm-table-resize{position:absolute;top:0;right:0;bottom:0;width:6px;cursor:col-resize}.pm-table-resize:hover,.pm-table-th-resizable.is-resizing .pm-table-resize{background:var(--interactive-accent)}.pm-table-th-resizable.is-hiding{opacity:.4}.pm-table-th-sortable:hover{color:var(--text-normal)}.pm-table-row{transition:background .1s}.pm-table-row:not(.pm-table-row--selected):hover{background:color-mix(in srgb,var(--interactive-accent) 5%,transparent)}.pm-table-row--done{opacity:.55}.pm-table-row--archived{opacity:.45;font-style:italic}.pm-table-wrapper[data-borders=horizontal] .pm-table-row,.pm-table-wrapper[data-borders=both] .pm-table-row{border-bottom:1px solid var(--background-modifier-border)}.pm-table-wrapper[data-borders=vertical] th,.pm-table-wrapper[data-borders=vertical] td,.pm-table-wrapper[data-borders=both] th,.pm-table-wrapper[data-borders=both] td{border-right:1px solid var(--background-modifier-border)}.pm-table-wrapper[data-borders=vertical] tr>:last-child,.pm-table-wrapper[data-borders=both] tr>:last-child{border-right:none}.pm-table-cell{padding:8px 10px;vertical-align:middle}.pm-table-cell-title{--pm-tree-indent: 20px;position:relative;padding:8px 10px 8px calc(var(--depth, 0) * var(--pm-tree-indent) + 8px);vertical-align:middle;min-width:180px}.pm-table-title-inner{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pm-tree-guide{position:absolute;top:0;bottom:0;left:calc(var(--level) * var(--pm-tree-indent));width:var(--pm-tree-indent);pointer-events:none}.pm-tree-guide:before{content:"";position:absolute;top:0;bottom:0;left:calc(var(--pm-tree-indent) / 2);width:1px;background:var(--background-modifier-border)}.pm-tree-guide--last:before{bottom:50%}.pm-tree-guide--elbow:after{content:"";position:absolute;top:50%;left:calc(var(--pm-tree-indent) / 2);width:calc(var(--pm-tree-indent) / 2 + 4px);height:1px;background:var(--background-modifier-border)}.pm-table-cell-select{width:32px;text-align:center;padding:0 4px;vertical-align:middle}.pm-table-cell-select input[type=checkbox]{margin:0;cursor:pointer}.pm-table-row .pm-table-cell-select input[type=checkbox]{opacity:0;transition:opacity .15s;pointer-events:none}.pm-table-row:hover .pm-table-cell-select input[type=checkbox],.pm-table-row .pm-table-cell-select input[type=checkbox]:checked{opacity:1;pointer-events:auto}.pm-table-cell-expand{width:32px;text-align:center;padding:0}.pm-collapse-toggle{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;cursor:pointer;color:var(--text-muted);flex-shrink:0;--icon-size: 14px}.pm-collapse-toggle:hover{color:var(--text-normal)}.pm-collapse-toggle.is-collapsed .svg-icon{transform:rotate(-90deg)}.pm-table-cell-progress{min-width:120px}.pm-table-cell-actions{width:40px;text-align:center}.pm-table-cell-assignees{min-width:80px}.pm-task-title-text{cursor:pointer;font-weight:500;line-height:1.4}.pm-task-title-text:hover{color:var(--interactive-accent)}.pm-table-tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:2px}.pm-cf-link{color:var(--text-accent);cursor:pointer}.pm-cf-link:hover{text-decoration:underline}.pm-cf-link:focus-visible{outline:2px solid var(--interactive-accent);outline-offset:2px;border-radius:var(--radius-s)}.pm-cf-link--unresolved{color:var(--text-muted);cursor:default}.pm-avatar{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;font-size:10px;font-weight:700;color:var(--text-on-accent);background:var(--pm-avatar-color);border:2px solid var(--background-primary);flex-shrink:0}.pm-avatar--sm{width:22px;height:22px;font-size:9px}.pm-avatar--more{background:var(--background-modifier-border);color:var(--text-muted);font-size:10px}.pm-avatar--link{cursor:pointer}.pm-avatar--link:hover{box-shadow:0 0 0 2px var(--interactive-accent)}.pm-avatar--link:focus-visible{outline:2px solid var(--interactive-accent);outline-offset:2px}.pm-avatar--unresolved{opacity:.5;border-style:dashed}.pm-avatar-stack{display:inline-flex;align-items:center}.pm-avatar-stack>.pm-avatar:not(:first-child){margin-left:-6px}.pm-progress{display:flex;align-items:center;gap:8px}.pm-progress-track{flex:1;height:6px;background:var(--background-modifier-border);border-radius:99px;overflow:hidden}.pm-progress--sm .pm-progress-track{height:3px}.pm-progress-fill{height:100%;border-radius:99px;background:var(--pm-progress-color, var(--interactive-accent));transition:width .3s ease}.pm-progress-label{font-size:var(--font-ui-smaller);color:var(--text-muted);min-width:28px}.pm-icon-btn--hover-only{opacity:0;transition:opacity .15s}.pm-table-row:hover .pm-icon-btn--hover-only,.pm-modal-subtask-row:hover .pm-icon-btn--hover-only,.pm-gantt-label-row:hover .pm-icon-btn--hover-only,.pm-saved-view-row:hover .pm-icon-btn--hover-only{opacity:1}.pm-icon-btn--hover-only:focus-visible{opacity:1}.pm-chip{--pm-chip-color: var(--text-muted);gap:6px;padding:2px 9px;line-height:1.5;color:var(--pm-chip-color);background:transparent;border:1px solid transparent;transition:background .15s}.pm-chip--solid{background:color-mix(in srgb,var(--pm-chip-color) 10%,transparent);border-color:color-mix(in srgb,var(--pm-chip-color) 20%,transparent)}.pm-chip--outline{border-color:var(--background-modifier-border)}.pm-chip--plain{color:var(--text-normal)}.pm-chip--tag{padding:2px 6px;border-radius:5px;font-size:11px;gap:4px;color:var(--text-muted)}.pm-chip--tag .pm-chip-dot{width:5px;height:5px;position:relative;top:.75px}.pm-chip--sm{padding:1px 5px;font-size:10px;font-weight:600}.pm-chip--pill,button.pm-chip-btn--pill{border-radius:99px}.pm-chip--strong{font-weight:600}.pm-chip-dot{width:6px;height:6px;border-radius:50%;background:var(--pm-chip-color);flex-shrink:0}.pm-chip-icon{display:inline-flex;align-items:center;flex-shrink:0;margin-left:-1px;--icon-size: 15px;color:var(--pm-chip-color)}.pm-chip--interactive{cursor:pointer}.pm-chip--interactive:hover{background:var(--background-modifier-hover)}.pm-chip--solid.pm-chip--interactive:hover{background:color-mix(in srgb,var(--pm-chip-color) 18%,transparent)}button.pm-chip-rm{display:inline-flex;align-items:center;justify-content:center;background:transparent;border:none;cursor:pointer;color:inherit;padding:0;margin:0;height:auto;box-shadow:none;opacity:.6}.pm-chip-rm:hover{opacity:1;color:var(--text-error, var(--color-red))}.pm-chip-rm svg{width:12px;height:12px}.pm-table-spacer td{padding:0;border:0}.pm-table-add-row td{padding:8px 10px}.pm-gantt-view{display:flex;flex-direction:column;height:100%;overflow:hidden}.pm-gantt-controls{display:flex;align-items:center;gap:6px;padding:8px 16px;border-bottom:1px solid var(--background-modifier-border);flex-shrink:0;background:var(--background-primary);flex-wrap:wrap}.pm-gantt-body{display:flex;flex-direction:column;flex:1;min-height:0}.pm-gantt-wrapper{display:flex;flex:1;overflow:hidden;position:relative}.pm-gantt-left{flex-shrink:0;display:flex;flex-direction:column;background:var(--background-secondary);z-index:5}.pm-gantt-left-header{display:flex;align-items:flex-end;padding:0 12px 10px;box-shadow:inset 0 -2px 0 var(--background-modifier-border);flex-shrink:0;background:var(--background-primary);box-sizing:border-box}.pm-gantt-left-header-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-muted)}.pm-gantt-left-body{flex:1;overflow:hidden}.pm-gantt-label-row{display:flex;align-items:center;gap:6px;padding-right:8px;box-shadow:inset 0 -1px 0 var(--background-modifier-border);cursor:default;transition:background .1s;box-sizing:border-box}.pm-gantt-label-row:hover{background:var(--background-modifier-hover)}.pm-gantt-label-spacer{width:28px;flex-shrink:0}.pm-gantt-label-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}.pm-gantt-label-title{flex:1;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}.pm-gantt-label-title:hover{color:var(--interactive-accent)}.pm-gantt-label-progress{font-size:11px;color:var(--text-muted);flex-shrink:0;margin-right:8px}.pm-gantt-resize-handle{width:4px;cursor:col-resize;background:transparent;flex-shrink:0;position:relative;z-index:6;transition:background .15s}.pm-gantt-resize-handle:hover,.pm-gantt-resize-handle:active{background:var(--interactive-accent)}.pm-gantt-right{flex:1;overflow:auto;position:relative}.pm-gantt-header-sticky{position:sticky;top:0;z-index:4}.pm-gantt-header-svg{display:block}.pm-gantt-svg-container{position:relative}.pm-gantt-svg{display:block}.pm-gantt-header-bg{fill:var(--background-secondary)}.pm-gantt-band-even{fill:#0000}.pm-gantt-band-odd{fill:#00000006}.theme-dark .pm-gantt-band-odd{fill:#ffffff06}.pm-gantt-header-month-top{font-size:10px;fill:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.04em}.pm-gantt-header-year{font-size:11px;fill:var(--text-muted);font-weight:600}.pm-gantt-header-day{font-size:10px;fill:var(--text-muted);text-anchor:middle;dominant-baseline:central}.pm-gantt-header-week{font-size:10px;fill:var(--text-muted);text-anchor:middle;dominant-baseline:central;font-weight:600}.pm-gantt-header-month{font-size:11px;fill:var(--text-normal);text-anchor:middle;dominant-baseline:central;font-weight:600}.pm-gantt-header-quarter{font-size:12px;fill:var(--text-normal);text-anchor:middle;dominant-baseline:central;font-weight:700}.pm-gantt-header-tick{stroke:var(--background-modifier-border);stroke-width:1}.pm-gantt-weekend-header{fill:#0000000a}.theme-dark .pm-gantt-weekend-header{fill:#ffffff0a}.pm-gantt-gridline-v{stroke:var(--background-modifier-border);stroke-width:1;stroke-dasharray:3 4}.pm-gantt-gridline-h{stroke:var(--background-modifier-border);stroke-width:.5}.pm-gantt-weekend{fill:#00000006}.theme-dark .pm-gantt-weekend{fill:#ffffff06}.pm-gantt-row-hover{fill:transparent;cursor:default}.pm-gantt-row-hover:hover,.pm-gantt-empty-row-hit:hover{fill:color-mix(in srgb,var(--interactive-accent) 3%,transparent)}.pm-gantt-empty-row-preview{fill:var(--interactive-accent);opacity:.25}.pm-gantt-bar{cursor:pointer;transition:filter .15s}.pm-gantt-bar:hover{filter:brightness(1.15)}.pm-gantt-bar-progress{pointer-events:none}.pm-gantt-bar-label{font-size:10px;fill:#ffffffd9;font-weight:600;text-transform:uppercase;letter-spacing:.03em;pointer-events:none;dominant-baseline:central;text-shadow:0 0 3px rgba(0,0,0,.55)}.pm-gantt-today-line{stroke:color-mix(in srgb,var(--color-red) 65%,transparent);stroke-width:1.5;stroke-dasharray:5 4}.pm-gantt-today-diamond{fill:color-mix(in srgb,var(--color-red) 65%,transparent)}.pm-gantt-arrow{fill:none;stroke:var(--interactive-accent);stroke-width:1.5;stroke-dasharray:4 3;opacity:.4}.pm-gantt-arrowhead{fill:var(--interactive-accent);opacity:.5}.pm-content--kanban{overflow:hidden}.pm-kanban-view{overflow:hidden;display:flex;flex-direction:column;height:100%}.pm-kanban-board{display:flex;gap:14px;flex:1;min-height:0;padding:16px;overflow-x:auto;overflow-y:hidden;box-sizing:border-box}.pm-kanban-col{display:flex;flex-direction:column;width:280px;min-width:280px;height:100%;background:var(--background-secondary);border-radius:var(--radius-m);overflow:hidden}.pm-kanban-col-header{flex-shrink:0}.pm-kanban-col-topbar{height:3px;opacity:.5}.pm-kanban-col-title-row{display:flex;align-items:center;justify-content:space-between;padding:10px 12px 8px}.pm-kanban-col-badge{display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:600}.pm-kanban-col-badge-icon{display:inline-flex;--icon-size: 14px}.pm-kanban-col-header-right{display:flex;align-items:center;gap:6px}.pm-kanban-col-count{background:var(--background-modifier-hover);border-radius:99px;padding:1px 8px;font-size:12px;font-weight:700;color:var(--text-muted)}.pm-kanban-cards{flex:1;min-height:0;overflow-y:auto;padding:6px 10px;display:flex;flex-direction:column;gap:8px;transition:background .15s}.pm-kanban-drop-target{background:color-mix(in srgb,var(--interactive-accent) 10%,transparent)}.pm-kanban-card{flex-shrink:0;display:flex;flex-direction:column;min-height:112px;background:var(--background-primary);border:1px solid var(--pm-ghost-border);border-radius:var(--radius-m);overflow:hidden;cursor:pointer;transition:all .15s;position:relative}.pm-kanban-card:hover{box-shadow:0 2px 12px var(--pm-shadow-ambient);border-color:var(--background-modifier-border)}.pm-kanban-card--dragging{box-shadow:0 4px 16px var(--pm-shadow-ambient);border-color:var(--interactive-accent);z-index:100}.pm-kanban-card-priority-bar{height:3px;flex-shrink:0;opacity:.5}.pm-kanban-card-body{flex:1;padding:10px 12px;display:flex;flex-direction:column;gap:7px}.pm-kanban-card-body>.pm-chip{align-self:flex-start}.pm-kanban-card-title{margin:0;font-size:13px;font-weight:500;line-height:1.45}.pm-kanban-card-description{margin:0;font-size:12px;line-height:1.4;color:var(--text-muted);overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;line-clamp:3}.pm-kanban-card-tags{display:flex;flex-wrap:wrap;gap:4px}.pm-kanban-card-field{display:flex;align-items:baseline;gap:6px;min-width:0;font-size:var(--font-ui-smaller)}.pm-kanban-card-field-name{flex-shrink:0;color:var(--text-muted)}.pm-kanban-card-field-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pm-kanban-card-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:auto;padding-top:2px}.pm-kanban-card-parent{font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button.pm-kanban-hidden-rail{flex-direction:column;flex-shrink:0;gap:8px;width:32px;padding:12px 0;border:1px dashed var(--background-modifier-border);border-radius:var(--radius-m);color:var(--text-faint);writing-mode:vertical-rl;--icon-size: 14px}.pm-gantt-right::-webkit-scrollbar,.pm-kanban-board::-webkit-scrollbar,.pm-kanban-cards::-webkit-scrollbar,.pm-task-modal::-webkit-scrollbar,.pm-edit::-webkit-scrollbar{width:6px;height:6px}.pm-gantt-right::-webkit-scrollbar-track,.pm-kanban-board::-webkit-scrollbar-track,.pm-kanban-cards::-webkit-scrollbar-track{background:transparent}.pm-gantt-right::-webkit-scrollbar-thumb,.pm-kanban-board::-webkit-scrollbar-thumb,.pm-kanban-cards::-webkit-scrollbar-thumb,.pm-task-modal::-webkit-scrollbar-thumb,.pm-edit::-webkit-scrollbar-thumb{background:var(--background-modifier-border);border-radius:99px}.pm-gantt-right::-webkit-scrollbar-thumb:hover{background:var(--text-muted)}.pm-segmented{display:flex;gap:6px}.pm-time-est-row{display:flex;align-items:center;gap:10px;margin-bottom:4px}.pm-time-label{font-size:12px;color:var(--text-muted)}.pm-time-est-input{width:80px}.pm-time-log-list{display:flex;flex-direction:column;gap:4px;margin-bottom:4px}.pm-time-log-list:empty{display:none}.pm-time-log-row{display:flex;gap:6px;align-items:center;padding:5px 6px;border-radius:var(--radius-s);background:var(--background-modifier-hover);border:1px solid var(--pm-ghost-border)}.pm-time-log-date{width:120px}.pm-time-log-hours{width:60px;text-align:center}.pm-time-log-note{flex:1}.pm-kanban-card-title-row{display:flex;align-items:center;gap:5px}.pm-kanban-card-title-row .pm-kanban-card-title{flex:1;margin:0;font-size:12px;font-weight:500;line-height:1.45}.pm-inline-edit{padding:3px 6px;border:1px solid var(--interactive-accent);border-radius:var(--radius-s);background:var(--background-secondary);color:var(--text-normal);font-size:13px;outline:none;box-shadow:0 0 0 2px color-mix(in srgb,var(--interactive-accent) 20%,transparent);width:100%}.pm-gantt-drag-handle{fill:#ffffff14;opacity:0;transition:opacity .15s,fill .15s}.pm-gantt-bar-group:hover .pm-gantt-drag-handle{opacity:1;fill:#ffffff40}.pm-gantt-bar-group .pm-gantt-drag-handle:hover{fill:#ffffff73}.pm-gantt-bar-grabbing{cursor:grabbing}.pm-gantt-link-dot{fill:transparent;stroke:var(--interactive-accent);stroke-width:1.5;opacity:0;transition:opacity .15s,fill .15s;pointer-events:all}.pm-gantt-bar-group:hover .pm-gantt-link-dot{opacity:.5}.pm-gantt-bar-group .pm-gantt-link-dot:hover{opacity:1;fill:var(--interactive-accent)}.pm-gantt-bar-group .pm-gantt-link-dot--active{opacity:1;fill:var(--interactive-accent);stroke-width:2;filter:drop-shadow(0 0 3px var(--interactive-accent))}.pm-gantt-milestone{transition:transform .15s,filter .15s}.pm-gantt-milestone:hover{filter:brightness(1.2)}.pm-gantt-milestone-label{font-size:10px;font-weight:600;letter-spacing:.03em}.pm-gantt-bar-icon{font-size:11px;pointer-events:none}.theme-dark .pm-root,.theme-dark .pm-modal{--pm-ghost-border: rgba(255, 255, 255, .06);--pm-shadow-ambient: rgba(0, 0, 0, .15)}.pm-modal-desc-section{position:relative}.pm-modal-desc-preview{padding:6px 8px;background:transparent;border-radius:var(--radius-s);border:1px solid transparent;font-size:13px;line-height:1.6;min-height:32px;cursor:text;user-select:text}.pm-modal-desc-preview:hover{background:var(--background-modifier-hover);border-color:var(--background-modifier-border)}.pm-modal-desc-preview p{margin:0 0 .5em}.pm-modal-desc-preview p:last-child{margin-bottom:0}.pm-modal-desc-preview a{color:var(--interactive-accent);text-decoration:underline;cursor:pointer;transition:color .15s}.pm-modal-desc-preview a:hover{color:var(--interactive-accent-hover)}.pm-modal-desc-preview a.external-link{color:var(--interactive-accent)}.pm-note-suggest{position:absolute;z-index:300;width:280px;max-height:240px;overflow-y:auto;background:var(--background-primary);border:1px solid var(--background-modifier-border);border-radius:var(--radius-m);box-shadow:0 4px 16px var(--pm-shadow-ambient);padding:4px;display:none}.pm-note-suggest--visible{display:block}.pm-note-suggest-mirror{position:fixed;top:-9999px;left:-9999px;visibility:hidden;white-space:pre-wrap;word-wrap:break-word;overflow:hidden}.pm-note-suggest-item{display:flex;flex-direction:column;padding:6px 10px;border-radius:var(--radius-s);cursor:pointer;transition:background .1s}.pm-note-suggest-item:hover{background:var(--background-modifier-hover)}.pm-note-suggest-item--active{background:color-mix(in srgb,var(--interactive-accent) 10%,transparent)}.pm-note-suggest-name-row{display:flex;align-items:center;gap:6px;min-width:0}.pm-note-suggest-name{font-size:13px;font-weight:500;color:var(--text-normal);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pm-note-suggest-type{flex-shrink:0;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.03em;color:var(--text-faint);background:var(--background-modifier-hover);padding:1px 5px;border-radius:var(--radius-s)}.pm-note-suggest-path{font-size:11px;color:var(--text-faint);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pm-gantt-add-row .pm-prop-add{margin-left:20px}.pm-note-link{color:var(--text-accent);cursor:pointer;text-decoration:none}.pm-note-link:hover{text-decoration:underline}.pm-note-link:focus-visible{outline:2px solid var(--interactive-accent);outline-offset:2px;border-radius:var(--radius-s)}.pm-picker-suggestion{display:inline-flex;align-items:center;gap:6px;--pm-glyph-size: 15px}.pm-gantt-bar-aside{font-size:var(--font-ui-smaller);fill:var(--text-muted);dominant-baseline:central;pointer-events:none}.pm-hidden{display:none!important}.pm-invisible{visibility:hidden}.pm-dragging{opacity:.5}.pm-offscreen{position:fixed;opacity:0;pointer-events:none}.pm-no-shrink{flex-shrink:0}body.pm-resize-active,body.pm-resize-active *{cursor:col-resize!important;user-select:none!important}.pm-prompt-text{margin:0 0 .75rem;color:var(--text-normal);font-size:var(--font-ui-medium)}.pm-confirm-text{margin:0 0 1rem;color:var(--text-normal);font-size:var(--font-ui-medium)}.pm-prompt-input{width:100%;padding:.5rem;margin-bottom:1rem;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:var(--font-ui-medium);box-sizing:border-box}.pm-modal-btn-row{display:flex;justify-content:flex-end;gap:.5rem}.pm-gantt-label-row--dragging{opacity:.4}.pm-gantt-label-row--drop-before{box-shadow:inset 0 2px 0 var(--interactive-accent)}.pm-gantt-label-row--drop-after{box-shadow:inset 0 -2px 0 var(--interactive-accent)}.import-modal-header{padding:1rem;border-bottom:1px solid var(--background-modifier-border);display:flex;justify-content:space-between;align-items:center;gap:1rem}.import-modal-header h2{margin:0;font-size:1.125rem;color:var(--text-normal)}.import-counter{color:var(--text-muted);font-size:.875rem}.import-search-container{padding:1rem;border-bottom:1px solid var(--background-modifier-border)}.import-search-input{width:100%;padding:.5rem;border:1px solid var(--background-modifier-border);border-radius:.25rem;background-color:var(--background-primary);color:var(--text-normal)}.import-list-wrapper{flex:1;overflow-y:auto;overflow-x:hidden;max-height:300px;display:flex;flex-direction:column}.import-select-all-row{padding:.75rem 1rem;display:flex;align-items:center;gap:.75rem;border-bottom:1px solid var(--background-modifier-border);background-color:var(--background-secondary);position:sticky;top:0;z-index:1}.import-select-all-row input[type=checkbox]{cursor:pointer;accent-color:var(--interactive-accent)}.import-select-all-row label{cursor:pointer;flex:1;color:var(--text-normal);margin-bottom:0}.import-modal-footer{padding:1rem;border-top:1px solid var(--background-modifier-border);display:flex;justify-content:flex-end;gap:.75rem}.import-options-content{padding:1.5rem;display:flex;flex-direction:column;gap:1.5rem;max-height:300px;overflow-y:auto}.import-option-group>label{display:block;margin-bottom:.5rem;font-weight:600;color:var(--text-normal)}.import-option-group select{padding:.5rem;height:2.25rem;line-height:1.25rem;border-radius:.25rem;border:1px solid var(--background-modifier-border);background-color:var(--background-primary);color:var(--text-normal);cursor:pointer;width:100%}.import-radio-group{display:flex;flex-direction:column;gap:.5rem}.import-radio-group label{display:flex;align-items:center;gap:.5rem;cursor:pointer;color:var(--text-normal)}.import-radio-group input[type=radio]{cursor:pointer}.import-file-item{display:flex;align-items:center;gap:.75rem;border-bottom:1px solid var(--background-modifier-border);cursor:pointer;transition:background-color .15s;padding:.75rem 1rem .75rem .75rem;background-color:transparent;border-left:none}.import-file-item:hover{background-color:var(--background-secondary)}.import-file-item--selected{background-color:var(--background-secondary);border-left:3px solid var(--interactive-accent);padding-left:calc(1rem - 3px)}.import-file-item--selected:hover{background-color:var(--background-secondary)}.import-file-item input[type=checkbox]{cursor:pointer;accent-color:var(--interactive-accent)}.import-file-name{flex:1;color:var(--text-normal);font-weight:500}.import-file-folder{color:var(--text-muted);font-size:.875rem}.import-options-header{padding:1rem;border-bottom:1px solid var(--background-modifier-border)}.import-options-header h2{margin:0;font-size:1.125rem;color:var(--text-normal)}\n';

// src/generated/viewer-js.ts
var viewer_js_default = 'function vn(e){return(Array.isArray(e)?e:e.split(" ")).filter(Boolean)}function Ui(e,t,n){n===null?e.removeAttribute(t):e.setAttribute(t,String(n))}function Bl(e,t){if(t===void 0)return;let n=typeof t=="string"?{cls:t}:t;if(n.cls&&e.classList.add(...vn(n.cls)),n.text!==void 0&&Gl(e,n.text),n.attr)for(let[r,o]of Object.entries(n.attr))Ui(e,r,o);n.title!==void 0&&e.setAttribute("title",n.title),n.value!==void 0&&(e.value=n.value),n.type!==void 0&&e.setAttribute("type",n.type),n.placeholder!==void 0&&e.setAttribute("placeholder",n.placeholder),n.href!==void 0&&e.setAttribute("href",n.href)}function Vl(e,t,n){let r=typeof n=="string"||n===void 0?{}:n,o=r.parent??t;o&&(r.prepend?o.insertBefore(e,o.firstChild):o.appendChild(e))}function ur(e){return e instanceof Document?e:e?.ownerDocument??document}function Gl(e,t){if(typeof t=="string"){e.textContent=t;return}Wl(e),e.appendChild(t)}function Wl(e){for(;e.lastChild;)e.removeChild(e.lastChild)}function bn(e,t,n,r){let o=ur(e).createElement(t);return Bl(o,n),Vl(o,e,n),r?.(o),o}function $l(e,t,n,r){let o=ur(e).createElementNS("http://www.w3.org/2000/svg",t);return Bl(o,n),Vl(o,e,n),r?.(o),o}function ql(e){Object.assign(this.style,e)}function Ul(e){for(let[t,n]of Object.entries(e))this.style.setProperty(t,n)}var Am={createEl(e,t,n){return bn(this,e,t,n)},createDiv(e,t){return bn(this,"div",e,t)},createSpan(e,t){return bn(this,"span",e,t)},createSvg(e,t,n){return $l(this,e,t,n)},detach(){this.parentNode?.removeChild(this)},empty(){Wl(this)},insertAfter(e,t){return this.insertBefore(e,t?t.nextSibling:this.firstChild)},indexOf(e){return Array.prototype.indexOf.call(this.childNodes,e)},appendText(e){this.appendChild(ur(this).createTextNode(e))}},Om={getText(){return this.textContent??""},setText(e){Gl(this,e)},addClass(...e){this.classList.add(...e.flatMap(vn))},addClasses(e){this.classList.add(...e.flatMap(vn))},removeClass(...e){this.classList.remove(...e.flatMap(vn))},removeClasses(e){this.classList.remove(...e.flatMap(vn))},toggleClass(e,t){for(let n of vn(e))this.classList.toggle(n,t)},hasClass(e){return this.classList.contains(e)},setAttr(e,t){Ui(this,e,t)},setAttrs(e){for(let[t,n]of Object.entries(e))Ui(this,t,n)},getAttr(e){return this.getAttribute(e)},matchParent(e,t){let n=this.closest(e);return n&&(!t||t.contains(n))?n:null},find(e){return this.querySelector(e)},findAll(e){return Array.from(this.querySelectorAll(e))},findAllSelf(e){let t=Array.from(this.querySelectorAll(e));return this.matches(e)?[this,...t]:t},isActiveElement(){return this.ownerDocument.activeElement===this}},po="pm-hidden",jm="pm-invisible";function Hl(e){return e.classList.contains(po)||e.style.display==="none"}var Rm={show(){this.classList.remove(po)},hide(){this.classList.add(po)},toggle(e){this.classList.toggle(po,!e)},toggleVisibility(e){this.classList.toggle(jm,!e)},isShown(){if(!this.isConnected||Hl(this))return!1;for(let e=this.parentElement;e;e=e.parentElement)if(Hl(e))return!1;return!0},setCssStyles:ql,setCssProps:Ul,onClickEvent(e,t){this.addEventListener("click",e,t)}};function cr(e,t){for(let[n,r]of Object.entries(t))n in e||Object.defineProperty(e,n,{value:r,writable:!0,configurable:!0})}function uo(e,t,n){t in e||Object.defineProperty(e,t,{get:n,configurable:!0})}function Nm(){typeof Node>"u"||(cr(Node.prototype,Am),cr(Element.prototype,Om),cr(HTMLElement.prototype,Rm),cr(SVGElement.prototype,{setCssStyles:ql,setCssProps:Ul}),uo(Node.prototype,"doc",function(){return ur(this)}),uo(Node.prototype,"win",function(){return ur(this).defaultView??window}),cr(window,{createEl:(e,t,n)=>bn(void 0,e,t,n),createDiv:(e,t)=>bn(void 0,"div",e,t),createSpan:(e,t)=>bn(void 0,"span",e,t),createSvg:(e,t,n)=>$l(void 0,e,t,n),createFragment:e=>{let t=document.createDocumentFragment();return e?.(t),t}}),uo(window,"activeDocument",()=>document),uo(window,"activeWindow",()=>window))}Nm();var Zi;function Zl(e){Zi=e}function Gt(){if(!Zi)throw new Error("UI platform not configured; call setPlatform first");return Zi}function S(e,t){Gt().setIcon(e,t)}function le(e,t){Gt().setTooltip(e,t)}function kt(e){return Gt().createButton(e)}function fo(e){return Gt().createExtraButton(e)}function dr(){return Gt().createMenu()}function Yl(e){Gt().showNotice(e)}function Yi(){return Gt().activeDocument()}var _m=/^[a-z0-9]+(-[a-z0-9]+)*$/;function Hm(e,t){e.empty(),_m.test(t)&&e.createSvg("svg",{cls:["svg-icon",`lucide-${t}`],attr:{"data-icon":t}})}function Bm(e,t){e.setAttr("aria-label",t)}var zi=class{buttonEl;constructor(t){this.buttonEl=t.createEl("button")}setButtonText(t){return this.buttonEl.setText(t),this}setIcon(t){return S(this.buttonEl,t),this}setCta(){return this.buttonEl.addClass("mod-cta"),this}removeCta(){return this.buttonEl.removeClass("mod-cta"),this}setWarning(){return this.buttonEl.addClass("mod-warning"),this}setTooltip(t){return le(this.buttonEl,t),this}setDisabled(t){return this.buttonEl.disabled=t,this}setClass(t){return this.buttonEl.addClass(t),this}onClick(t){return this.buttonEl.addEventListener("click",t),this}},Ki=class{extraSettingsEl;constructor(t){this.extraSettingsEl=t.createDiv({cls:["clickable-icon","extra-setting-button"],attr:{tabindex:0}})}setIcon(t){return S(this.extraSettingsEl,t),this}setTooltip(t){return le(this.extraSettingsEl,t),this}setDisabled(t){return this.extraSettingsEl.toggleClass("is-disabled",t),this}onClick(t){return this.extraSettingsEl.addEventListener("click",t),this}},Xi=class{el;titleEl;iconEl;constructor(t,n){this.el=t.createDiv("menu-item"),this.iconEl=this.el.createDiv("menu-item-icon"),this.titleEl=this.el.createDiv("menu-item-title"),this.el.addEventListener("click",n)}setTitle(t){return this.titleEl.setText(t),this}setIcon(t){return t?S(this.iconEl,t):this.iconEl.empty(),this}setChecked(t){return this.el.toggleClass("mod-checked",t===!0),this}setDisabled(t){return this.el.toggleClass("is-disabled",t),this}onClick(t){return this.el.addEventListener("click",t),this}},Ji=class{el;constructor(){this.el=createDiv("menu")}addItem(t){return t(new Xi(this.el,()=>this.hide())),this}addSeparator(){return this.el.createDiv("menu-separator"),this}showAtMouseEvent(t){return this.showAtPosition({x:t.clientX,y:t.clientY})}showAtPosition(t){document.body.appendChild(this.el);let n=t.left?t.x-this.el.offsetWidth:t.x;return this.el.setCssProps({left:`${n}px`,top:`${t.y}px`}),this}hide(){return this.el.detach(),this}},zl={setIcon:Hm,setTooltip:Bm,iconIds:()=>[],isPhone:()=>!1,createButton:e=>new zi(e),createExtraButton:e=>new Ki(e),createMenu:()=>new Ji,showNotice:e=>{console.error(e)},activeWindow:()=>window,activeDocument:()=>document};var Qi=globalThis.Temporal;var Kl=(e,t)=>`Non-positive ${e}: ${t}`,Xl=(e,t)=>`Non-finite ${e}: ${t}`,Jl=e=>`Cannot convert bigint to ${e}`,Ql="Invalid object",pr=(e,t,n,r)=>Wt(e,t)+`; must be between ${n}-${r}`,Wt=(e,t)=>`Invalid ${e}: ${t}`;var es=1e3,ts=1e6,ns=1e9,rs=6e10,os=36e11;function xe(e){return e===void 0?Object.create(null):wt(e)}function mo(e,t="number"){if(typeof e=="bigint")throw new TypeError(Jl(t));if(e=Number(e),!Number.isFinite(e))throw new RangeError(Xl(t,e));return e}function V(e,t){return Math.trunc(mo(e,t))||0}function ho(e,t){return ec(V(e,t),t)}function ec(e,t="number"){if(e<=0)throw new RangeError(Kl(t,e));return e}function is(e,t,n){return Math.min(Math.max(e,t),n)}function $t(e){return e!==null&&(typeof e=="object"||typeof e=="function")}function wt(e){if(!$t(e))throw new TypeError(Ql);return e}function yo(e,t){return typeof e=="string"?((n,r)=>{let o=Object.create(null);return o[n]=r,o})(t,e):wt(e)}var nt="smallestUnit",qm={constrain:0,reject:1},Um={compatible:0,reject:1,earlier:2,later:3},Zm={reject:0,use:1,prefer:2,ignore:3},Ym={auto:0,never:1,critical:2,always:3},zm={auto:0,never:1,critical:2},Km={auto:0,never:1},Xm={floor:0,halfFloor:1,ceil:2,halfCeil:3,trunc:4,halfTrunc:5,expand:6,halfExpand:7,halfEven:8},tc=[Math.floor,vc,Math.ceil,bc,Math.trunc,kc,gc,yc,wc],Jm={previous:-1,next:1};function ss(e){let t=e.roundingIncrement;return t===void 0?1:V(t,"roundingIncrement")}function as(e){let t=e.fractionalSecondDigits;if(t!==void 0){if(typeof t!="number"){if(hr(t)==="auto")return;b(mr("fractionalSecondDigits",t))}t=Ae("fractionalSecondDigits",Math.floor(t),0,9,1)}return t}function ls(e,t,n=0,r){let o=t[e];if(o===void 0)return r?n:void 0;if(o=hr(o),o==="auto")return r?n:null;let i=go[o];return i===void 0&&(i=j.indexOf(o)),i<0&&b(fs(e,o,go)),i}function Tt(e,t,n,r=0){let o=n[e];if(o===void 0)return r;let i=hr(o),s=t[i];return s===void 0&&b(fs(e,i,t)),s}var wn=te(ls,nt),nc=te(ls,"largestUnit"),Qm=te(ls,"unit"),rc=te(Tt,"overflow",qm),oc=te(Tt,"disambiguation",Um),eh=te(Tt,"offset",Zm),cs=te(Tt,"calendarName",Ym),th=te(Tt,"timeZoneName",zm),nh=te(Tt,"offset",Km),Tn=te(Tt,"roundingMode",Xm),rh=te(Tt,"direction",Jm);function us(e,t,n,r){let o=r?qe:Ee[t+1];if(o){let i=Ee[t];o%((e=Ae("roundingIncrement",e,1,o/i-(r?0:1),1))*i)&&b(mr("roundingIncrement",e))}else e=Ae("roundingIncrement",e,1,n?10**9:1,1);return e}function kn(e,t,n,r){return t!=null&&Ae(e,t,n,r,1,bo),t}function ic(e,t){t>e&&b(hc)}function qt(e,t,n,r=9,o=0,i=4){t=xe(t);let s=nc(t,o),a=ss(t),l=Tn(t,i),c=wn(t,o,1);return s=kn("largestUnit",s,o,r),c=kn(nt,c,o,r),s==null?s=Math.max(n,c):ic(s,c),a=us(a,c,1),e&&(l=(u=>u<4?(u+2)%4:u)(l)),[s,c,a,l]}function sc(e,t,n){e=yo(e,nt);let r=nc(e),o=n(e.relativeTo),i=ss(e),s=Tn(e,7),a=wn(e);return r===void 0&&a===void 0&&b(mc),a==null&&(a=0),r==null&&(r=Math.max(a,t)),ic(r,a),i=us(i,a,1),i>1&&a>5&&r!==a&&b("For calendar units with roundingIncrement > 1, use largestUnit = smallestUnit"),[r,a,i,s,o]}function fr(e,t=6,n){let r=ss(e=yo(e,nt)),o=Tn(e,7),i=wn(e);return i=ms(nt,i),i=kn(nt,i,0,t),r=us(r,i,void 0,n),[i,r,o]}function ac(e,t){let n=t((e=yo(e,"unit")).relativeTo),r=Qm(e);return r=ms("unit",r),[r,n]}function x(e){return e===void 0?0:rc(wt(e))}function xt(e,t=0){e=xe(e);let n=oc(e),r=eh(e,t);return[rc(e),r,n]}function lc(e){return oc(xe(e))}function cc(e,t=4){let n=as(e),r=Tn(e,4),o=wn(e);return[r,...ps(kn(nt,o,0,t),n)]}function uc(e){return e=xe(e),[cs(e),...cc(e)]}function vo(e){return cs(xe(e))}function ds(e,t){return cc(xe(e),t)}function dc(e){e=xe(e);let t=cs(e),n=as(e),r=nh(e),o=Tn(e,4),i=wn(e);return[t,th(e),r,o,...ps(kn(nt,i,0,4),n)]}function pc(e){let t=as(e=xe(e)),n=Tn(e,4),r=wn(e);return[e.timeZone,n,...ps(kn(nt,r,0,4),t)]}function ps(e,t){return e!=null?[Ee[e],e<4?9-3*e:-1]:[t===void 0?1:10**(9-t),t]}function fc(e){let t=yo(e,"direction"),n=rh(t,0);return n||b(mr("direction",n)),n}var mr=Wt;var kr=e=>`Missing ${e}`,Fc=e=>"No valid fields: "+e.join(),Lc="Invalid bag",fs=(e,t,n)=>Wt(e,t)+"; must be "+Object.keys(n).join(),Ac="Cannot use valueOf",Oc="Invalid calling context",Ps=e=>"Missing year"+(e?"/era/eraYear":""),Zt="Invalid leap month",jc=e=>Wt("Calendar",e),Rc=(e,t)=>`Unknown calendar ${e}; might need ${t}`,Ms=e=>Wt("TimeZone",e),Et="Out-of-bounds date";var mc="Required smallestUnit or largestUnit",hc="smallestUnit > largestUnit",Nc=e=>`Cannot parse: ${e}`,rt=e=>`Invalid substring: ${e}`;var Is=is,fe=$t;function b(e){throw new RangeError(e)}function F(e){throw new TypeError(e)}function bs(e,t,n,r,o){return Ae(t,((i,s)=>{let a=i[s];return a===void 0&&F(kr(s)),a})(e,t),n,r,o)}function Ae(e,t,n,r,o,i){let s=Is(t,n,r);return o&&t!==s&&b(((a,l,c,u,d)=>d?pr(a,d[l],d[c],d[u]):pr(a,l,c,u))(e,t,n,r,i)),s}function En(e,t=Map){let n=new t;return(r,...o)=>{if(n.has(r))return n.get(r);let i=e(r,...o);return n.set(r,i),i}}var _c=e=>Po({name:e},1),Po=(e,t)=>Dt(n=>({value:n,configurable:1,writable:!t}),e),wr=e=>({[Symbol.toStringTag]:{value:e,configurable:1}});function Dt(e,t){let n={};for(let r in t)n[r]=e(t[r],r);return n}function Tr(e,t){let n={};for(let r of e)n[r]=t;return n}function Fs(e){let t={};for(let n of e)t[n]=r=>r[n];return t}function Ze(e,t,n=Object.create(null)){for(let r of e)n[r]=t[r];return n}function Hc(e,t,n){for(let r of e)if(t[r]!==n[r])return 0;return 1}function oh(e,t,n){let r={...n};for(let o=0;o<t;o++)r[e[o]]=0;return r}function te(e,...t){return(...n)=>e(...t,...n)}function Ls(){}function Tc(e){return e[0].toUpperCase()+e.substring(1)}function Z(...e){return[].concat(...e).sort()}function Dn(e){return new RegExp(`^${e}$`,"i")}function As(e){return parseInt(e.padEnd(9,"0"))}function Os(e){return e&&e!=="+"?-1:1}function xn(e){return e===void 0?0:parseInt(e)}function wo(e,t){return String(t).padStart(e,"0")}var Oe=te(wo,2);function ot(e,t){return Math.sign(e-t)}function ge(e,t){return e<t?-1:e>t?1:0}function Bc(e,t){let n=e/t;return e%t<0n?n-1n:n}function js(e,t){let n=Bc(e,t);return[n,e-n*t]}function Ue(e,t){return[Math.floor(e/t),Mo(e,t)]}function Mo(e,t){return(e%t+t)%t}function Pn(e,t){return Math.trunc(e/t)||0}function Rs(e,t){return e%t||0}function gc(e){return e<0?Math.floor(e):Math.ceil(e)}function Vc(e,t=1){return t*(.5+e/5)}function yc(e){return Math.sign(e)*Math.round(Math.abs(e))||0}function vc(e){return Io(e)?Math.floor(e):Math.round(e)}function bc(e){return Io(e)?Math.ceil(e):Math.round(e)}function kc(e){return Io(e)?Math.trunc(e)||0:Math.round(e)}function wc(e){return Io(e)?(e=Math.trunc(e)||0)+e%2:Math.round(e)}function Io(e){return Math.abs(e%1)===.5}var Ns="iso8601",Gc="gregory",ih={bce:-1,ce:0};function Wc(e){let t=e.normalize("NFD").toLowerCase().replace(/[^a-z0-9]/g,"");return t==="bc"||t==="b"?"bce":t==="ad"||t==="a"?"ce":t}var ye=void 0,$c=0;function Re(e){return e===ye?"iso8601":e===0?"gregory":e.id}var sh=/^M(\\d{2})(L?)$/;function qc(e){let t=sh.exec(e);return t||b((n=>`Invalid monthCode: ${n}`)(e)),[parseInt(t[1]),!!t[2]]}function Uc(e,t){return"M"+Oe(e)+(t?"L":"")}function ks(e,t,n){return e+(t||n&&e>=n?1:0)}var go={nanosecond:0,microsecond:1,millisecond:2,second:3,minute:4,hour:5,day:6,week:7,month:8,year:9},bo=Object.keys(go);var xr=es,Er=ts,Pt=ns,Cr=rs,Sr=os,qe=864e11,Ee=[1,xr,Er,Pt,Cr,Sr,qe],ah=BigInt(xr),Mn=BigInt(Er),Yt=BigInt(Pt),lh=BigInt(Cr),ch=BigInt(Sr),R=BigInt(qe);function Zc(e,t){let n=Number(e/R),r=Number(e%R);return n*(qe/t)+(Math.trunc(r/t)+r%t/t)}var ce=bo.slice(0,6),Dr=Fs(ce),Fo=["year"],Kt=["day"],_s=["day","month","year"],Lo=["offset"],Hs=["timeZone"],In=["era","eraYear"],uh=["era","eraYear","year"],Yc=["month","monthCode"],dh=["day","month","monthCode"],ws=Z(ce),ph=Z(In,Fo),Pr=Z(Yc,Fo),zc=Z(In,Pr),Mr=Z(["monthCode"],Fo),Kc=Z(In,Mr),Xc=Z(Kt,["monthCode"]),Xt=Z(Kt,Pr),Jt=Z(Kt,In,Pr),Jc=Z(Xt,ce),Qc=Z(Jt,ce),fh=Z(Xt,ce,Lo),mh=Z(Jt,ce,Lo),eu=Z(Xt,ce,Lo,Hs),tu=Z(Jt,ce,Lo,Hs),hh=Z(Kt,Mr),gh=Z(Kt,In,Mr),Ne=Tr(ce,0);function Ir(e){return Ao(e,1),e}var yh={hour:23,minute:59,second:59};function Ao(e,t){let n={};for(let r of ce)n[r]=Ae(r,e[r],0,yh[r]||999,t);return n}function ve(e){return Vs(e)*Pt+nu(e)}function Bs(e){return 1e3*Vs(e)+e.millisecond}function Vs(e){return 3600*e.hour+60*e.minute+e.second}function nu(e){return e.millisecond*Er+e.microsecond*xr+e.nanosecond}function Gs(e){let[t,n]=Ue(e,qe);return[ru(n),t]}function ru(e){let[t,n]=Ue(e,Er),[r,o]=Ue(n,xr);return vh(t,r,o)}function vh(e,t=0,n=0){let[r,o]=Ue(e,36e5),[i,s]=Ue(o,6e4),[a,l]=Ue(s,1e3);return{hour:r,minute:i,second:a,millisecond:l,microsecond:t,nanosecond:n}}function xc(e){let[t,n]=js(e,Yt);return[Number(t),Number(n)]}function Fr(e){return Number(Bc(e,Mn))}function ne(e){return it(e)+BigInt(ve(e))}function ou(e){return Lr(e)+Bs(e)}function it(e){return BigInt(Ye(e))*R}function Lr(e){return 864e5*Ye(e)}function Ye(e){return gr(e.year,e.month,e.day)}function gr(e,t=1,n=1){let r=t-1;return e+=Math.floor(r/12),t=Mo(r,12),Date.UTC(e%400-400,t,0)/864e5+146097*(Pn(e,400)+1)+n}function Ar(e){let[t,n]=js(e,R);return{...iu(Number(t)),...ru(Number(n))}}function iu(e){let t=new Date(864e5*Mo(e,146097));return{year:t.getUTCFullYear()+400*Math.floor(e/146097),month:t.getUTCMonth()+1,day:t.getUTCDate()}}var su=1972;function bh(e){return[e,0]}function Ts(e,t){if(!t)return{year:1972,month:e}}function kh(e,t,n){return{year:e,month:t,day:n}}function au(e,t){switch(t){case 2:return Oo(e)?29:28;case 4:case 6:case 9:case 11:return 30}return 31}function wh(e){return Oo(e)?366:365}function Oo(e){return e%4==0&&(e%100!=0||e%400==0)}function Th(e,t,n){return e+=Pn(n,12),(t+=Rs(n,12))<1?(e--,t+=12):t>12&&(e++,t-=12),{year:e,month:t}}function xh(e,t,n,r){return 12*(n-e)+r-t}function jo(e){return Mo(gr(e.year,e.month,e.day)+4,7)||7}function lu(e){return gr(e.year,e.month,e.day)-gr(e.year)+1}function cu(e){let t=e.year,n=Math.floor((lu(e)-jo(e)+10)/7),r=hs(t);return n<1?n=r=hs(--t):n>r&&(n=1,r=hs(++t)),{weekOfYear:n,yearOfWeek:t,De:r}}function hs(e){let t=jo({year:e,month:1,day:1});return t===4||t===3&&Oo(e)?53:52}function Eh({year:e}){return e<1?{era:"bce",eraYear:1-e}:{era:"ce",eraYear:e}}function Or(e){return at(e),Ir(e)}function at(e){return uu(e,1),e}function Ec(e){return Hc(_s,e,uu(e))}function uu(e,t){let{year:n}=e,r=bs(e,"month",1,12,t);return{year:n,month:r,day:bs(e,"day",1,au(n,r),t)}}function A(e,t){return e?e.de(t):t}function zt(e,t,n){return e?e.N(t,n):bh(n)}function jr(e,t){return e===0?Eh(t):e&&e.h?.(t)||{}}function Qt(e,t,n,r){return e?e.fe(t,n,r):kh(t,n,r)}function yr(e,t){return e?e.j(t):12}function vr(e,t,n){return e?e.o(t,n):au(t,n)}function Ro(e,t){let{year:n,month:r}=A(e,t),[o,i]=zt(e,n,r);return Uc(o,i)}function Ws(e,t){let{year:n}=A(e,t);return e?e.q(n):Oo(n)}function $s(e,t){let{year:n}=A(e,t);return yr(e,n)}function qs(e,t){let{year:n,month:r}=A(e,t);return vr(e,n,r)}function Us(e,t){let{year:n}=A(e,t);return e?e.i(n):wh(n)}function du(e,t){if(!e)return lu(t);let{year:n}=A(e,t),r=Qt(e,n,1,1);return Ye(t)-Ye(r)+1}function pu(e,t){return e===ye?cu(t).weekOfYear:void 0}function fu(e,t){return e===ye?cu(t).yearOfWeek:void 0}var j=bo.map(e=>e+"s"),Zs=Fs(j),mu=Z(j),Ch=j.slice(0,6),hu=j.slice(6),Sh=hu.slice(1),q=Tr(j,0),Ys=Tr(Ch,0),zs=te(oh,j);function ms(e,t){return t==null&&b(kr(e)),t}var re=te(Dh,"string");function Dh(e,t,n=e){return typeof t!==e&&F(mr(n,t)),t}function Ks(e,t="number"){return Number.isInteger(e)||b(((n,r)=>`Non-integer ${n}: ${r}`)(t,e)),e||0}function hr(e){return typeof e=="symbol"&&F("Cannot convert Symbol to string"),String(e)}function Xs(e){if(!$t(e))return e;let t=e[Symbol.toPrimitive];if(t!=null){typeof t!="function"&&F();let n=Reflect.apply(t,e,["string"]);return $t(n)&&F(),n}return Date.prototype[Symbol.toPrimitive].call(e,"string")}function No(e){return typeof e=="boolean"?BigInt(e?1:0):typeof e=="string"?BigInt(e):(typeof e!="bigint"&&F(`Invalid bigint: ${e}`),e)}function Rr(e,t){return Ks(mo(e,t),t)}function N(e,t){return Ze(_s,e,Ze(ce,t))}var Js=BigInt(1e8)*R,Qs=BigInt(-1e8)*R,gu=Qs-R,yu=-3261848;function _o(e){let t=12*e.year+e.month;return(t<yu||t>3309129)&&b(Et),e}function be(e,t=1){let n=it(e);return(n<(t?gu:Qs)||n>Js)&&b(Et),e}function en(e){return Ph(ne(e)),e}function Ph(e){return(e<=gu||e>=Js+R)&&b(Et),e}function He(e){return(e<Qs||e>Js)&&b(Et),e}function ea(e,t){return He(it(e)+BigInt(ve(e)-t))}function Cn(e,t,n){return ta(e/t,n)*t}function ta(e,t){return tc[t](e)}function Mh(e,t,n,r){let o=na(e,t,r,n);return vu(o,Number(n-o.I)/Number(o.O-o.I))}function Ih(e,t,n,r){return Cn(vu(e,bu(t,e.I,e.O)),n,r)}function na(e,t,n,r){let o=Cc(e,t,n);return((i,s,a,l)=>l>0?s<=i&&i<=a:a<=i&&i<=s)(r,o.I,o.O,Math.sign(t))||(o=Cc(e+t,t,n)),o}function Cc(e,t,n){let r=e+t;return{ve:e,qe:r,I:n(e),O:n(r)}}function vu(e,t){return e.ve+t*(e.qe-e.ve)}function bu(e,t,n){let r=n-t,o=e-t;if(!o)return 0;let i=o<0n?-o:o,s=r<0n?-r:r,a=ge(o,0n)===ge(r,0n)?1:-1;return ge(i,s)<=0?i===s?a:Vc(ge(2n*i,s),a):Number(o)/Number(r)}function Ce(e){return{epochNanoseconds:e}}function Se(e,t,n){return{calendar:n,timeZone:t,epochNanoseconds:e}}function ze(e,t){return Ze(ce,e,O(e,t))}function O(e,t){return Ze(_s,e,{calendar:t})}function tn(e){return Ze(ce,e)}function _e(e){return Ze(j,e,{sign:Wr(e)})}function ku(e,t,n,r){return Se(t===6?Lh(e,r):Ah(e,t,n,r),e.timeZone,e.calendar)}function wu(e){let[t,n]=xu(e);return Zc(n-t,Sr)}function Tu(e){let{timeZone:t,calendar:n}=e;return Se(Sn(t,N(U(e),Ne)),t,n)}function Ho(e,t,n,r,o,i,s,a){if(r===0&&o===1)return e;let l=Wr(e)||1,c=Eo(r,a)?a&&r<6&&n>=6?jh:Rh:Oh,[u,d,p]=c(l,e,t,n,r,o,i,s);return p&&r!==7&&(u=((f,g,y,h,v,k)=>{for(let C=h+1;C<=y;C++){if(C===7&&y!==7)continue;let D=zs(C,f);D[j[C]]+=v;let L=ge(g,Uo(k,D));if(L&&L!==v)break;f=D}return f})(u,d,n,Math.max(6,r),l,s)),u}function Fh(e,t,n){let r=Math.min(St(e),6);return Ct(Go(st(e),BigInt(t),n),r)}function Lh(e,t){let[n,r]=xu(e);return Nh(e.epochNanoseconds,n,r,t)}function Ah(e,t,n,r){if(t===0&&n===1)return e.epochNanoseconds;let o=U(e);return Ln(e.timeZone,Bo(o,Fn(t,n),r),o.offsetNanoseconds,2,0,1)}function Bo(e,t,n){let[r,o]=Vo(e,t,n),i=N(On(e,o),r);return en(i),i}function Vo(e,t,n){return Gs(Cn(ve(e),t,n))}function Oh(e,t,n,r,o,i,s,a){let l=j[o],c=zs(o,t);o===7&&(t={...t,weeks:t.weeks+Math.trunc(t.days/7)});let u=Pn(t[l],i)*i,d=na(u,i*e,f=>(c[l]=f,Uo(a,c)),n),p=Ih(d,n,i,s);return c[l]=p,[c,p===d.qe?d.O:d.I,p!==u]}function jh(e,t,n,r,o,i,s,a){let l=Number(jn(t)),c=Fn(o,i),u=Cn(l,c,s),d={...t,...Ys},p=na(d.days,e,k=>(d.days=k,Uo(a,d)),n),f=p.I,g=p.O,y=u-Number(g-f),h=0;y&&Math.sign(y)!==e?n=f+BigInt(u):(h+=e,u=Cn(y,c,s),n=g+BigInt(u));let v=Zo(u);return[{...t,...v,days:t.days+h},n,!!h]}function Rh(e,t,n,r,o,i,s){let a=st(t),l=Go(a,Nr(o,i),s),c=l-a,u=Math.sign(Number(l/R)-Number(a/R))===e,d=Ct(l,Math.min(r,6));return[{...t,...d},n+c,u]}function xu(e){let{timeZone:t}=e,n=N(U(e),Ne),r=N(On(n,1),Ne);return[Sn(t,n),Sn(t,r)]}function Nh(e,t,n,r){return ta(bu(e<n?e:n-1n,t,n),r)?n:t}function To(e){return Cn(e,Cr,7)}function Go(e,t,n){return Eu(e,t,n,e/t%2n)}function Wo(e,t,n){let[r,o]=js(e,R),i=r*R;return i+Eu(o,t,n,(i/t+o/t)%2n)}function Eu(e,t,n,r){let o=e/t,i=e%t,s=0;i&&(s=Vc(ge(2n*(i<0n?-i:i),t),Math.sign(Number(i))));let a=ta(Number(r)+s,n);return(o-r+BigInt(a))*t}function Fn(e,t){return Ee[e]*t}function Nr(e,t){return BigInt(Ee[e])*BigInt(t)}var U=En(_h,WeakMap);function _h(e){let{epochNanoseconds:t,timeZone:n}=e,r=n.B(t);return{...Ar(t+BigInt(r)),offsetNanoseconds:r}}function Ln(e,t,n,r=0,o=0,i,s){if(n!==void 0&&r===1&&(r===1||s))return ea(t,n);r!==2&&r!==0||be(t,0);let a=e.R(t);if(n!==void 0&&r!==3){let l=((c,u,d,p)=>{let f=ne(u);p&&(d=To(d));for(let g of c){let y=Number(f-g);if(p&&(y=To(y)),y===d)return g}})(a,t,n,i);if(l!==void 0)return l;r===0&&b("Invalid TimeZone offset")}return s?ne(t):An(e,t,o,a)}function An(e,t,n=0,r=e.R(t)){if(r.length===1)return r[0];if(n===1&&b("Ambiguous offset"),r.length)return r[n===3?1:0];let o=ne(t),i=((a,l)=>{let c=a.B(l-R);return(u=>(u>qe&&b("Out-of-bounds TimeZone gap"),u))(a.B(l+R)-c)})(e,o),s=Ar(o+BigInt(i*(n===2?-1:1)));return(r=e.R(s))[n===2?0:r.length-1]}function Sn(e,t){let n=e.R(t);if(n.length)return n[0];let r=ne(t)-R;return e.C(r,1)}function ra(e,t,n,r=0){Wr(n)&&St(n)<8&&b("Cannot use small units");let o=be(br(e,t));return br(e,lt(e,o,n,r))}function _r(e,t,n=0){let{calendar:r,epochNanoseconds:o,timeZone:i}=e,s=jn(t),a=o;if(pa(t)){let l=U(e);a=An(i,N(lt(r,l,{...t,...Ys},n),l))+s}else a+=s;return{...e,epochNanoseconds:He(a)}}function Hr(e,t,n,r=0){let[o,i]=$o(t,n);return en(N(lt(e,t,{...n,...Ys,days:n.days+i},r),o))}function $o(e,t){return Hh(e,jn(t))}function oa(e,t){return Bh(e,(pa(n=t)&&b("Cannot use large units"),jn(n)));var n}function lt(e,t,n,r=0){let{years:o,months:i,weeks:s,days:a}=n,l;if(a+=Number(jn(n)/R),o||i)l=xo(e,t,o,i,r);else{if(!s&&!a)return t;l=t}return(s||a)&&(l=On(l,7*s+a)),be(l)}function br(e,t){return On(t,1-A(e,t).day)}function xo(e,t,n,r,o){let i=A(e,t),{year:s,month:a,day:l}=i;if(n){let[c,u]=zt(e,s,a);s+=n,a=xs(e,c,u,e?e.p(s):void 0,o),a=Ae("month",a,1,yr(e,s),o)}return r&&({year:s,month:a}=Cu(e,s,a,r)),l=Ae("day",l,1,vr(e,s,a),o),Qt(e,s,a,l)}function Cu(e,t,n,r){return e?e.ae(t,n,r):Th(t,n,r)}function xs(e,t,n,r,o){if(n){let i=e?e.l:void 0;return r!==void 0&&(i<0||r===t+1)?r:(o===1&&b(Zt),i<0?-i:t)}return ks(t,0,r)}function Hh(e,t){let n=Number(t/R),r=Number(t%R),[o,i]=Gs(ve(e)+r);return[o,n+i]}function Bh(e,t){return He(e+t)}function On(e,t){return t?iu(Ye(e)+t):e}function Br(e,t){return Re(e)!==Re(t)&&b("Mismatching Calendars"),e}function Su(e,t){return e.m!==t.m&&b("Mismatching TimeZones"),e}function Du(e){return e.timeZone.id}function Pu(e,t,n,r,o,i,s){return r<6?Vr(t.epochNanoseconds,n.epochNanoseconds,r,o,i,s):((a,l,c,u,d,p,f)=>{let g=c.epochNanoseconds;if(g===l.epochNanoseconds)return q;let y,h=Su(l.timeZone,c.timeZone);return y=ia(h,a,l,c,u),y=Ho(y,g,u,d,p,f,aa(a,h,l),1),y})(e,t,n,r,o,i,s)}function Mu(e,t,n,r,o,i,s){return r<=6?Vr(ne(t),ne(n),r,o,i,s):((a,l,c,u,d,p,f)=>{let g=ne(c),y=ge(g,ne(l));if(!y)return q;let h;return h=ju(a,l,c,y,u),h=Ho(h,g,u,d,p,f,((v,k)=>({ne:ne(k),ke:C=>ne(N(lt(v,k,C),k))}))(a,l)),h})(e,t,n,r,o,i,s)}function Iu(e,t,n,r,o,i,s){let a=br(e,t),l=br(e,n);return sa(a,l)?Au(e,be(a),be(l),r,o,i,s,8):q}function Fu(e,t,n,r,o,i,s,a=6){return r===6?Vr(it(t),it(n),r,o,i,s):Au(e,t,n,r,o,i,s,a)}function Lu(e,t,n,r,o,i){let s=Cn(ve(t)-ve(e),Fn(r,o),i);return{...q,...Zo(s,n)}}function Au(e,t,n,r,o,i,s,a=6){let l=it(n);if(!sa(t,n))return q;let c;return c=qo(e,t,n,r),o===a&&i===1||(c=Ho(c,l,r,o,i,s,la(e,t))),c}function Vr(e,t,n,r,o,i){return{...q,...Ct(Go(t-e,Nr(r,o),i),n)}}function ia(e,t,n,r,o){return o<6?{...q,...Ct(r.epochNanoseconds-n.epochNanoseconds,o)}:((i,s,a)=>{let l=ge(a.epochNanoseconds,s.epochNanoseconds);if(!l)return q;if(!sa(U(s),U(a)))return{...q,...Ct(a.epochNanoseconds-s.epochNanoseconds,5)};let[c,u,d]=Vh(i,s,a,l);return{...(p=c,f=u,qo(t,p,f,o)),...Zo(d)};var p,f})(e,n,r)}function Ou(e,t,n,r){let o=ne(t),i=ne(n),s=ge(i,o);return s?r<=6?{...q,...Ct(i-o,r)}:ju(e,t,n,s,r):q}function ju(e,t,n,r,o){let i=n,s=ve(n)-ve(t);return Math.sign(s)===-r&&(i=On(n,-r),s+=qe*r),{...qo(e,t,i,o),...Zo(s)}}function Vh(e,t,n,r){let o=U(t),i=U(n),s=n.epochNanoseconds,a=0,l=ve(i)-ve(o);Math.sign(l)===-r&&a++;let c=a+(r>0?1:0);for(;;a++){let u=On(i,a*-r),d=An(e,N(u,o));if(a===c||ge(s,d)!==-r)return[o,u,Number(s-d)]}}function qo(e,t,n,r){if(r<=7)return((y,h,v)=>{let k=gs(h,v);return y?{...q,weeks:Pn(k,7),days:Rs(k,7)}:{...q,days:k}})(r===7,t,n);let o=A(e,t),i=A(e,n);if(r===8){let{year:y,month:h,day:v}=o,{year:k,month:C,day:D}=i,L=Math.sign(ot(k,y)||ot(C,h)||gs(t,n)),T=0,Q=0;if(L){T=e?e.ee(y,h,k,C):xh(y,h,k,C);let ee=xo(e,t,0,T,0);L*ot(v,D)>0&&(T-=L,ee=xo(e,t,0,T,0)),Q=gs(ee,n)}return{...q,months:T,days:Q}}let{year:s,month:a,day:l}=o,{year:c,month:u,day:d}=i,p=c-s,f=u-a,g=d-l;if(p||f){let y=Math.sign(p||f),h=vr(e,c,u),v=0;if(Math.sign(d-l)===-y){let k=h;({year:c,month:u}=Cu(e,c,u,-y)),p=c-s,f=u-a,h=vr(e,c,u),v=y<0?-k:h}if(g=d-Math.min(l,h)+v,p){let[k,C]=zt(e,s,a),[D,L]=zt(e,c,u),T=e?e.l:void 0;if(f=T!==void 0&&C&&!L&&(T<0?y>0&&D===-T:y<0&&D===k)?0:D-k||Number(L)-Number(C),Math.sign(f)===-y){let Q=y<0&&-yr(e,c);c-=y,p=c-s,f=u-xs(e,k,C,e?e.p(c):void 0,0)+(Q||yr(e,c))}else if(e){let Q=xs(e,k,C,e.p(c),0);f=e.ee(c,Q,c,u)}}}return{...q,years:p,months:f,days:g}}function sa(e,t){return ot(e.year,t.year)||ot(e.month,t.month)||ot(e.day,t.day)}function gs(e,t){return Ye(t)-Ye(e)}function Ru(e,t,n){return Gr(e)?((r,o,i)=>{let{calendar:s,timeZone:a}=r,l=_r(r,o);return[ia(a,s,r,l,i),l.epochNanoseconds,aa(s,a,r)]})(e,t,n):((r,o,i)=>{let{calendar:s}=r,a=en(N(r,Ne)),l=Hr(s,a,o);return[Ou(s,a,l,i),ne(l),la(s,r)]})(e,t,n)}function Sc(e,t){return Gr(e)?_r(e,t).epochNanoseconds:ne(Hr(e.calendar,N(e,Ne),t))}function Uo(e,t){return pa(t)?e.ke(t):e.ne}function aa(e,t,n){let r=U(n);return{ne:n.epochNanoseconds,ke:o=>An(t,N(lt(e,r,o),r))}}function la(e,t){return{ne:it(t),ke:n=>it(lt(e,t,n))}}function Gr(e){return"timeZone"in e}function Eo(e,t){return e<=6-(t?1:0)}function ca(e,t,n){let r={};for(let o=t;o>=0;o--){let i=Ee[o];r[n[o]]=Pn(e,i),e=Rs(e,i)}return r}var Gh=2**53;function ua(e,t,n){let r=Math.max(St(t),St(n));return r>6&&b("Cannot use large units"),((o,i,s,a)=>_e(Mt(((l,c,u,d)=>{let p=st(l)+st(c)*BigInt(d?-1:1);return Number.isFinite(Number(p/R))||b(Et),{...q,...Ct(p,u)}})(i,s,a,o))))(e,t,n,r)}function Nu(e,t,n){let r=St(t),[o,i,s,a,l]=sc(n,r,e);if(!l&&Math.max(r,o)<=6)return _e(Mt(((f,g,y,h,v)=>{let k=Go(st(f),Nr(y,h),v);return{...q,...Ct(k,g)}})(t,o,i,s,a)));l||b("Missing relativeTo");let c=Gr(l);if(!t.sign&&(!c||o<6))return t;let[u,d,p]=Ru(l,t,o);return _e(Ho(u,d,o,i,s,a,p,c))}function _u(e){return e.sign===-1?da(e):e}function da(e){return _e(De(e))}function De(e){let t={};for(let n of j)t[n]=-1*e[n]||0;return t}function Wr(e,t=j){let n=0;for(let r of t){let o=Math.sign(e[r]);o&&(n&&n!==o&&b("Cannot mix duration signs"),n=o)}return n}function Mt(e){for(let n of Sh)Wh(n,e[n]);let t=st(e);return Hu(Number(t/Yt)),e}function Wh(e,t){return Ae(e,t,-4294967295,4294967295,1)}function Hu(e){Number.isSafeInteger(e)||b("Out-of-bounds duration")}function st(e){return BigInt(e.days)*R+jn(e)}function jn(e){return BigInt(e.hours)*ch+BigInt(e.minutes)*lh+Bu(e)}function Bu(e){return BigInt(e.seconds)*Yt+BigInt(e.milliseconds)*Mn+BigInt(e.microseconds)*ah+BigInt(e.nanoseconds)}function Ct(e,t=6){let n=Number(e/R),r=Number(e%R),o=Ee[t],i=t<=3?Number(e/BigInt(o)):n*(qe/o)+Pn(r,o);Number.isFinite(i)||b(Et),t<=3&&Math.abs(i)/(Pt/Ee[t])>=Gh&&b(Et);let s=ca(r,t,j);return s[j[t]]=i,s}function Zo(e,t=5){return ca(e,t,j)}function pa(e){return!!Wr(e,hu)}function St(e){let t=9;for(;t>0&&!e[j[t]];t--);return t}function $r(e,t){return ge(e.epochNanoseconds,t.epochNanoseconds)}function Vu(e,t,n,r){let o=e(xe(r).relativeTo),i=Math.max(St(t),St(n));return Hc(j,t,n)?0:Eo(i,o&&Gr(o))?ge(st(t),st(n)):(o||b("Missing relativeTo"),ge(Sc(o,t),Sc(o,n)))}function fa(e,t){return nn(e,t)||Yo(e,t)}function nn(e,t){return ot(Ye(e),Ye(t))}function Yo(e,t){return ot(ve(e),ve(t))}function Gu(e,t){return!$r(e,t)}function Wu(e,t){return!$r(e,t)&&e.timeZone.m===t.timeZone.m&&e.calendar===t.calendar}function $u(e,t){return!fa(e,t)&&e.calendar===t.calendar}function qu(e,t){return!nn(e,t)&&e.calendar===t.calendar}function Uu(e,t){return!nn(e,t)&&e.calendar===t.calendar}function Zu(e,t){return!nn(e,t)&&e.calendar===t.calendar}function Yu(e,t){return!Yo(e,t)}function qr(e){return e===0?ih:e?e.k:void 0}function ue(e,t,n=t){return qr(e)?n:t}function zu(e,t){let n=t||void 0,r=qr(t),{era:o,eraYear:i,year:s}=e;if(s!==void 0&&(s=V(s,"year")),i!==void 0&&(i=V(i,"eraYear")),o!==void 0||i!==void 0){o!==void 0&&i!==void 0||F("Mismatching era/eraYear"),r||b("Forbidden era/eraYear");let a=Wc(o),l=r[a];l===void 0&&b((u=>`Invalid era: ${u}`)(o));let c=n?._?n._(i,a,l):$h(i,l);s!==void 0&&s!==c&&b("Mismatching year/eraYear"),s=c}else s===void 0&&F(Ps(r));return s}function Co(e,t,n,r,o){let{month:i,monthCode:s}=e;if(s!==void 0){let a=((l,c,u,d,p=qc(c))=>{let f=l?l.p(u):void 0,[g,y]=p,h=ks(g,y,f);if(y){let v=l?l.l:void 0;v===void 0&&b(Zt),v>0?(h>v&&b(Zt),f!==h&&(d===1&&b(Zt),h=ks(g,0,f))):(h!==-v&&b(Zt),f===void 0&&d===1&&b(Zt))}return h})(t,s,n,o,r);i!==void 0&&i!==a&&b("Mismatching month/monthCode"),i=a,o=1}else i===void 0&&F("Missing month/monthCode");return Ae("month",i,1,yr(t,n),o)}function Es(e,t,n,r,o){return bs(e,"day",1,vr(t,n,r),o)}function $h(e,t){return(t+e)*(Math.sign(t)||1)||0}function Rn(e,t){return Ao(Ze(ce,{...Ne,...e}),t)}var qh=Dn("([+-])(\\\\d{2})(?::?(\\\\d{2})(?::?(\\\\d{2})(?:[.,](\\\\d{1,9}))?)?)?");function zo(e){let t=ma(e);return t===void 0&&b(Nc(e)),t}function ma(e,t){let n=qh.exec(e);if(n&&(r=>(o=>{o[0]!=="T"&&o[0]!=="t"||(o=o.slice(1));let i=o.search(/[.,]/),s=i<0?o:o.slice(0,i),a=s.split(":");return a.length===1?/^(?:\\d{2}|\\d{4}|\\d{6})$/i.test(s):(a.length===2||a.length===3)&&a.every(l=>l.length===2&&/^\\d{2}$/i.test(l))})(r.slice(1)))(n[0]))return((r,o)=>{let i=r[4]||r[5];return o&&i&&b(rt(i)),a=(xn(r[2])*Sr+xn(r[3])*Cr+xn(r[4])*Pt+As(r[5]||""))*Os(r[1]),Math.abs(a)>=qe&&b("Out-of-bounds offset"),a;var a})(n,t)}var Pe={era:hr,month:ho,monthCode(e,t){return re(Xs(e),t)},day:ho},ha=Tr(ce,V),Ku=Tr(j,Rr),ga=Object.assign({},Pe,ha),ya={offset(e){return zo(re(Xs(e)))},...ga};function H(e,t,n,r,o=!r){let i={},s=0;for(let a of t){let l=e[a];if(l!==void 0){s=1;let c=n[a];c&&(l=c(l,a)),i[a]=l}else r&&r.includes(a)&&F(kr(a))}return o&&!s&&F(Fc(t)),i}function Me(e,t,n){let r=qr(t);e.year!==void 0||e.era!==void 0&&e.eraYear!==void 0||F(Ps(r)),e.monthCode===void 0&&e.month===void 0&&F("Missing month/monthCode"),n||e.day!==void 0||F(kr("day"));let o=Xu(e);return[zu(e,t),o]}function Ko(e,t){let n=t===ye,r=qr(t);e.day===void 0&&F(kr("day")),n||e.month===void 0||e.year!==void 0||e.era!==void 0&&e.eraYear!==void 0||F(Ps(r));let o=Xu(e);return[e.eraYear!==void 0||e.year!==void 0?zu(e,t):void 0,o]}function Ur(e,t=Ne,n){let r=N(e,t);return en(r),ze(r,n)}function ct(e,t,n,r,o){let i=Co(e,t,n,r,o);return O(be(Qt(t,n,i,Es(e,t,n,i,o))),t)}function Xo(e,t,n,r,o){return Uh(t,n,Co(e,t,n,r,o))}function Jo(e,t,n,r,o){let i=t===ye,s=n,a,l,c;if(s===void 0&&i&&(s=1972),s!==void 0){i||be(Qt(t,s,1,1));let u=Co(e,t,s,r,o);a=Es(e,t,s,u,o),[l,c]=zt(t,s,u)}else{e.monthCode===void 0&&F("Missing month/monthCode"),[l,c]=r;let u=t?t.re:1972;if(u!==void 0)a=Es(e,t,u,Co(e,t,u,r,o),o);else{let d=o===0&&t?t.ge?.(l,c,e.day):void 0;a=d!==void 0?d:e.day}}return Zh(t,l,c,a,e.day,o)}function Uh(e,t,n){return O(_o(Qt(e,t,n,1)),e)}function Zh(e,t,n,r,o,i){let s=n;s&&((e&&e.V?.[t])??1/0)<o&&(i===1&&b(Zt),s=0,r=Is(o,1,(e&&e.U)??1/0));let a=e?e.u(t,!!s,r):Ts(t,!!s);for(;!a&&i===0&&r>1;)r--,a=e?e.u(t,!!s,r):Ts(t,!!s);a||b("Cannot guess year");let{year:l,month:c}=a;return O(be(Qt(e,l,c,r)),e)}function Xu(e){if(e.monthCode!==void 0)return qc(e.monthCode)}var Ke=Intl.DateTimeFormat;function Yh(e,t){t<-864e13&&b(Et);let n=e.formatToParts(t),r={};for(let o of n)r[o.type]=o.value;return r}var zh={El_Aaiun:17,Tucuman:12,Tirane:11,Riga:10,Simferopol:9,Vienna:9,Tunis:8,Boa_Vista:6,Fortaleza:6,Maceio:6,Noronha:6,Recife:6,Gaza:6,Hebron:6,DeNoronha:6},ys=-388152e4;function va(e,t,n){let[r,o,i,s]=pc(n),a=r!==void 0;return((l,c,u,d,p,f)=>{u=Wo(u,BigInt(p),d);let g=c.B(u);return Ca(Ar(u+BigInt(g)),f)+(l?Zr(To(g)):"Z")})(a,me(a?e(r):"UTC"),t.epochNanoseconds,o,i,s)}function ba(e,t){let n=dc(t);return((r,o,i,s,a,l,c,u,d,p)=>{s=Wo(s,BigInt(d),u);let f=i.B(s);return Ca(Ar(s+BigInt(f)),p)+Zr(To(f),c)+Jh(o,l)+Sa(r,a)})(e.calendar,e.timeZone.id,e.timeZone,e.epochNanoseconds,...n)}function ka(e,t){let n=uc(t);return((r,o,i,s,a,l)=>Ca(Bo(o,a,s),l)+Sa(r,i))(e.calendar,e,...n)}function wa(e,t){return n=e.calendar,r=e,o=vo(t),So(r)+Sa(n,o);var n,r,o}function Ta(e,t){return Ju(e.calendar,Qu,e,vo(t))}function xa(e,t){return Ju(e.calendar,Xh,e,vo(t))}function Ju(e,t,n,r){let o=r>1||r===0&&e!==ye;return r===1?e===ye?t(n):So(n):o?So(n)+td(Re(e),r===2):t(n)}function Ea(e,t){return((n,r,o,i)=>ed(Vo(n,o,r)[0],i))(e,...ds(t))}function Qo(e,t){let[n,r,o]=ds(t,3);return r>1&&Mt(e={...e,...Fh(e,r,n)}),Kh(e,o)}function Kh(e,t){let{sign:n}=e,r=n===-1?De(e):e,{hours:o,minutes:i}=r,s=Bu(r),a=Number(s/Yt),l=Number(s%Yt);Hu(a);let c=Da(l,t),u=t>=0||!n||c;return(n<0?"-":"")+"P"+Dc({Y:Ut(r.years),M:Ut(r.months),W:Ut(r.weeks),D:Ut(r.days)})+(o||i||a||u?"T"+Dc({H:Ut(o),M:Ut(i),S:Ut(a,u)+c}):"")}function Dc(e){let t=[];for(let n in e){let r=e[n];r&&t.push(r,n)}return t.join("")}function Ut(e,t){if(!e&&!t)return"";let n=Object.create(null);return n.useGrouping=0,e.toLocaleString("fullwide",n)}function Ca(e,t){return So(e)+"T"+ed(e,t)}function So(e){return Qu(e)+"-"+Oe(e.day)}function Qu(e){let{year:t}=e;return(t<0||t>9999?nd(t)+wo(6,Math.abs(t)):wo(4,t))+"-"+Oe(e.month)}function Xh(e){return Oe(e.month)+"-"+Oe(e.day)}function ed(e,t){let n=[Oe(e.hour),Oe(e.minute)];return t!==-1&&n.push(Oe(e.second)+((r,o,i,s)=>Da(r*Er+o*xr+i,s))(e.millisecond,e.microsecond,e.nanosecond,t)),n.join(":")}function Zr(e,t=0){if(t===1)return"";let[n,r]=Ue(Math.abs(e),Sr),[o,i]=Ue(r,Cr),[s,a]=Ue(i,Pt);return nd(e)+Oe(n)+":"+Oe(o)+(s||a?":"+Oe(s)+Da(a):"")}function Jh(e,t){return t!==1?"["+(t===2?"!":"")+e+"]":""}function Sa(e,t){return t>1||t===0&&e!==ye?td(Re(e),t===2):""}function td(e,t){return"["+(t?"!":"")+"u-ca="+e+"]"}var Qh=/0+$/;function Da(e,t){let n=wo(9,e);return n=t===void 0?n.replace(Qh,""):n.slice(0,t),n?"."+n:""}function nd(e){return e<0?"-":"+"}var eg=/^(AC|AE|AG|AR|AS|BE|BS|CA|CN|CS|CT|EA|EC|IE|IS|JS|MI|NE|NS|PL|PN|PR|PS|SS|VS)T$/,tg=/[^\\w\\/:+-]+/;function rd(e){return ei(re(e))}function ei(e){return od(e).id}function od(e){let t=e.toUpperCase(),n=(o=>{let i=ma(o,1);if(i!==void 0)return{id:Zr(i),Z:i,m:i}})(t);if(n)return{kind:"fixed",...n};let r=t==="UTC"?"UTC":(o=>(tg.test(o)&&b(Ms(o)),eg.test(o)&&b("Forbidden ICU TimeZone"),o.toLowerCase().split("/").map((i,s)=>(i.length<=3||/\\d/.test(i))&&!/etc|yap/.test(i)?i.toUpperCase():i.replace(/baja|dumont|[a-z]+/g,(a,l)=>a.length<=2&&!s||a==="in"||a==="chat"?a.toUpperCase():a.length>2||!l?Tc(a).replace(/island|noronha|murdo|rivadavia|urville/,Tc):a)).join("/")))(e);return ng(r)}var ng=En(e=>{if(e==="UTC")return{kind:"utc",id:e,m:e};let t=e.toUpperCase(),n=rg(t);return{kind:"named",id:e,format:n,m:n.resolvedOptions().timeZone}}),rg=En(e=>new Ke("en-u-hc-h23",{calendar:"iso8601",timeZone:e,era:"short",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}));function me(e){let t=od(e);return og(t.id,t)}var og=En((e,t)=>t.kind==="named"?new Ss(e,t.m,t.format):new Cs(e,t.m,t.kind==="fixed"?t.Z:0)),Cs=class{constructor(t,n,r){this.id=t,this.m=n,this.Z=r}B(){return this.Z}R(t){return[ea(t,this.Z)]}C(){}},Ss=class{constructor(t,n,r){this.id=t,this.m=n,this.oe=((o,i)=>{let s=En(o),a=En(ig),l=86400*i;function c(d){let[p,f]=Mc(d,l),g=ko(p),y=ko(f),h=s(g),v=s(y);return h===v?h:u(a(g,y),h,v,d)}function u(d,p,f,g){let y,h;for(;(g===void 0||(y=g<d[0]?p:g>=d[1]?f:void 0)===void 0)&&(h=d[1]-d[0]);){let v=d[0]+Math.floor(h/2);o(v)===f?d[1]=v:d[0]=v+1}return y}return{Ae(d){let p=c(d-86400),f=c(d+86400),g=d-p,y=d-f;if(p===f)return[g];let h=c(g);return h===c(y)?[d-h]:p>f?[g,y]:[]},ze:c,C:function d(p,f){if(f>0&&p>=864e10)return;if(f<0){if(p<=ys)return;let D=Pc()+94867200;if(p>D)return d(D,-1)}let g=f>0?Math.max(p,ys):p,[y,h]=Mc(g,l),v=l*f,k=f>0?Math.max(p,Pc())+94867200:ys,C=()=>f<0?h>k:y<k;for(;C();){let D=ko(y),L=ko(h),T=s(D),Q=s(L);if(T!==Q){let ee=a(D,L);u(ee,T,Q);let $=ee[0];if((ot($,p)||1)===f)return $}y+=v,h+=v}}}})((o=>i=>{let s=Yh(o,1e3*i);return 86400*gr((a=>{let l=a.relatedYear;if(l!==void 0)return parseInt(l);let c=parseInt(a.year);return a.era!==void 0&&Wc(a.era)==="bce"?1-c:c})(s),parseInt(s.month),parseInt(s.day))+3600*parseInt(s.hour)+60*parseInt(s.minute)+parseInt(s.second)-i})(r),(o=>{let i=o.split("/").pop();return zh[i]||60})(t))}B(t){return this.oe.ze((n=>xc(n)[0])(t))*Pt}R(t){let n=86400*Ye(t)+Vs(t),r=nu(t);return this.oe.Ae(n).map(o=>He(BigInt(o)*Yt+BigInt(r)))}C(t,n){let[r,o]=xc(t),i=this.oe.C(r+(n>0||o?1:0),n);if(i!==void 0)return BigInt(i)*Yt}};function Pc(){return Math.floor(Date.now()/1e3)}function ig(e,t){return[e,t]}function Mc(e,t){let n=Math.floor(e/t)*t;return[n,n+t]}function ko(e){return Is(e,-1e10,864e10)}function id(e,t,n){let r=H(n,ue(t,eu,tu),ya,[],0),o=r.timeZone!==void 0,[i,s]=Me(r,t),a=ct(r,t,i,s,0);if(o){let l=Rn(r),c=me(e(r.timeZone));return{epochNanoseconds:Ln(c,N(a,l),r.offset),timeZone:c,calendar:t}}return a}function sd(e,t,n,r){let o=H(n,ue(t,eu,tu),ya,Hs,0),i=e(o.timeZone),[s,a]=Me(o,t),[l,c,u]=xt(r),d=ct(o,t,s,a,l),p=Rn(o,l),f=me(i);return Se(Ln(f,N(d,p),o.offset,c,u),f,t)}function ad(e,t,n){let r=H(t,ue(e,Jc,Qc),ga,[],0),[o,i]=Me(r,e),s=x(n);return Ur(ct(r,e,o,i,s),Rn(r,s),e)}function ld(e,t,n,r=[]){let o=H(t,ue(e,Xt,Jt),Pe,r),[i,s]=Me(o,e);return ct(o,e,i,s,x(n))}function cd(e,t,n,r){let o=H(t,ue(e,Pr,zc),Pe,r),[i,s]=Me(o,e,1);return Xo(o,e,i,s,x(n))}function ud(e,t,n,r){let o=H(n,ue(e,Xt,Jt),Pe,Kt,0);t&&o.month!==void 0&&o.monthCode===void 0&&o.year===void 0&&(o.year=1972);let[i,s]=Ko(o,e);return Jo(o,e,i,s,x(r))}function dd(e,t){return Rn(H(e,ws,ha,[],1),x(t))}function pd(e){let t=H(e,mu,Ku);return _e(Mt({...q,...t}))}function je(e){b(Nc(e))}function fd(e){let t=It(e=re(Xs(e))),n;return t||je(e),t.F?n=0:t.offset?n=zo(t.offset):je(e),t.timeZoneId&&ma(t.timeZoneId,1),Or(t),Ce(ea(t,n))}function md(e,t){let n=It(re(e));return n||je(e),n.timeZoneId?Ed(n,t,void 0):(n.F&&je(e),Ds(n,t))}function hd(e,t,n){let r=It(re(e));return r&&r.timeZoneId||je(e),Ed(r,t,n)}function gd(e,t){let n=It(re(e));return n&&!n.F||je(e),Cd(n,t)}function yd(e,t){let n=Ia(Ma(re(e)),void 0,t);return O(n,n.calendar)}function vd(e,t){let n=Fa(re(e));if(n)return Pa(n),O(_o(at(n)),t(n.calendarId));let r=Ia(Ma(e),sg,t),{calendar:o}=r;return O(br(o,r),o)}function Pa(e){e.calendarId!=="iso8601"&&b(rt(e.calendarId))}function bd(e,t){let n=La(re(e));if(n)return Pa(n),O(at(n),t(n.calendarId));let r=Ia(Ma(e),ag,t),{calendar:o}=r,{year:i,month:s,day:a}=A(o,r),[l,c]=zt(o,i,s),{year:u,month:d}=((p,f,g,y)=>{let h=p?p.u(f,g,y):Ts(f,g);return h||b("Cannot guess year"),h})(o,l,c,a);return O(be(Qt(o,u,d,a)),o)}function kd(e){let t=(r=>{let o=Sd(r);return o?(Yr(o[13]),Dd(o,1)):void 0})(e=re(e));if(!t){let r=It(e);r&&r.te||je(e),r.F&&b(rt("Z")),Pa(r),t=r}let n;return(n=Fa(e))&&Ec(n)&&je(e),(n=La(e))&&Ec(n)&&je(e),tn(Ir(t))}function wd(e){let t=mg.exec(re(e));return t||je(e),_e(Mt((n=>{let r=0,o=0,i=0,s={years:a(n[2]),months:a(n[3]),weeks:a(n[4]),days:a(n[5]),hours:a(n[6],n[7],5),minutes:a(n[8],n[9],4),seconds:a(n[10],n[11],3),...ca(i,2,j)};return r||b(Fc(j)),Os(n[1])<0&&(s=De(s)),s;function a(l,c,u){let d=0,p=0;return u&&([d,i]=Ue(i,Ee[u])),l!==void 0&&(o&&b(rt(l)),p=(f=>{let g=parseInt(f);return Number.isFinite(g)||b(rt(f)),g})(l),r=1,c&&(i=As(c)*(Ee[u]/Pt),o=1)),d+p}})(t)))}function Td(e){let t=It(e)||Fa(e)||La(e);if(t)return t.calendarId;let n=Sd(e);return n?Yr(n[13]).calendarId:e}function xd(e){let t=It(e);return t&&(t.timeZoneId||t.F&&"UTC"||t.offset)||e}function Ma(e){let t=It(e);return t&&!t.F||je(e),t}function Ia(e,t,n){return t&&e.calendarId==="iso8601"?(at(e),e.te&&Ir(e),Ds(t(e),n)):e.te?Cd(e,n):Ds(e,n)}function sg(e){let t=12*e.year+e.month===yu?20:1;return{...e,day:t}}function ag(e){return{...e,year:1972}}function Ed(e,t,n){let r=me(ei(e.timeZoneId)),o;if(Or(e),e.te){let s=e.offset?zo(e.offset):void 0,[,a,l]=xt(n);o=Ln(r,e,s,a,l,!(r.Z||e.offset===void 0||(i=e.offset,i.replace(/\\D/g,"").length>4)),e.F)}else xt(n),o=Sn(r,e);var i;return He(o),Se(o,r,t(e.calendarId))}function Cd(e,t){return Or(e),en(e),{...N(e,e),calendar:t(e.calendarId)}}function Ds(e,t){return at(e),be(e),{calendar:t(e.calendarId),year:e.year,month:e.month,day:e.day}}function Do(e){return`(\\\\d{2})(?:(:?)(\\\\d{2})(?:\\\\${e}(\\\\d{2})(?:[.,](\\\\d{1,9}))?)?)?`}var lg="(?:(?:([+-])(\\\\d{6}))|(\\\\d{4}))(-?)(\\\\d{2})\\\\4(\\\\d{2})(?:[T ]"+Do(8)+"(Z|([+-])"+Do(15)+")?)?",cg=Dn("(?:(?:([+-])(\\\\d{6}))|(\\\\d{4}))-?(\\\\d{2})((?:\\\\[(!?)([^\\\\]]*)\\\\]){0,9})"),ug=Dn("(?:--)?(\\\\d{2})-?(\\\\d{2})((?:\\\\[(!?)([^\\\\]]*)\\\\]){0,9})"),dg=Dn(lg+"((?:\\\\[(!?)([^\\\\]]*)\\\\]){0,9})"),pg=Dn("T?"+Do(2)+`(([+-])${Do(9)})?((?:\\\\[(!?)([^\\\\]]*)\\\\]){0,9})`),fg=new RegExp("\\\\[(!?)([^\\\\]]*)\\\\]","g"),mg=Dn("([+-])?P(\\\\d+Y)?(\\\\d+M)?(\\\\d+W)?(\\\\d+D)?(?:T(?!$)(?:(\\\\d+)(?:[.,](\\\\d{1,9}))?H)?(?:(\\\\d+)(?:[.,](\\\\d{1,9}))?M)?(?:(\\\\d+)(?:[.,](\\\\d{1,9}))?S)?)?");function It(e){let t=dg.exec(e);return t?(n=>{let r=n[12],o=(r||"").toUpperCase()==="Z";return{year:Pd(n),month:parseInt(n[5]),day:parseInt(n[6]),...Dd(n,7),...Yr(n[19]),te:!!n[7],F:o,offset:o?void 0:r}})(t):void 0}function Fa(e){let t=cg.exec(e);if(t)return(n=>({year:Pd(n),month:parseInt(n[4]),day:1,...Yr(n[5])}))(t)}function La(e){let t=ug.exec(e);return t?(n=>({year:1972,month:parseInt(n[1]),day:parseInt(n[2]),...Yr(n[3])}))(t):void 0}function Sd(e){let t=pg.exec(e);if(t)return t[6]&&zo(t[6]),t}function Dd(e,t){let n=xn(e[t+3]);return{...Gs(As(e[t+4]||""))[0],hour:xn(e[t]),minute:xn(e[t+2]),second:n===60?59:n}}function Pd(e){let t=Os(e[1]),n=parseInt(e[2]||e[3]);return t<0&&!n&&b(rt(-0)),t*n}function Yr(e){let t,n,r=[];return e.replace(fg,(o,i,s)=>{let a=!!i,[l,c]=s.split("=").reverse();return c?c==="u-ca"?(r.push(l.toLowerCase()),t||(t=a)):(a||/[A-Z]/.test(c))&&b(rt(o)):(n&&b(rt(o)),n=l),""}),r.length>1&&t&&b(rt(e)),{timeZoneId:n,calendarId:r[0]||"iso8601"}}function Nn(e,t,n){let r=Object.assign(Object.create(null),t);return vs(r,n,Yc),qr(e)&&(vs(r,n,uh),e&&e.je&&vs(r,n,dh,In)),r}function vs(e,t,n,r){let o=0,i=[];for(let s of n)t[s]!==void 0?o=1:i.push(s);if(Object.assign(e,t),o)for(let s of r||i)delete e[s]}function Md(e,t,n){let r=ue(e,fh,mh),o=U(t),{year:i,month:s,day:a}=A(e,o),l={year:i,monthCode:zr(e,i,s),day:a,hour:o.hour,minute:o.minute,second:o.second,millisecond:o.millisecond,microsecond:o.microsecond,nanosecond:o.nanosecond,offset:o.offsetNanoseconds},c=H(n,r,ya),u=Nn(e,l,c);return[{...l,...c},u]}function Id(e,t,n){let r=ue(e,Jc,Qc),{year:o,month:i,day:s}=A(e,t),a={year:o,monthCode:zr(e,o,i),day:s,hour:t.hour,minute:t.minute,second:t.second,millisecond:t.millisecond,microsecond:t.microsecond,nanosecond:t.nanosecond},l=H(n,r,ga),c=Nn(e,a,l);return[{...a,...l},c]}function Fd(e,t,n){let r=ue(e,Xt,Jt),{year:o,month:i,day:s}=A(e,t);return Nn(e,{year:o,monthCode:zr(e,o,i),day:s},H(n,r,Pe))}function Ld(e,t,n){let r=ue(e,Pr,zc),{year:o,month:i}=A(e,t);return Nn(e,{year:o,monthCode:zr(e,o,i)},H(n,r,Pe))}function Ad(e,t,n){let r=ue(e,Xt,Jt),{year:o,month:i,day:s}=A(e,t);return Nn(e,{monthCode:zr(e,o,i),day:s},H(n,r,Pe))}function Od(e,t,n,r,o,i,s,a){let{calendar:l,timeZone:c}=e;return Se(Ln(c,N(ct(n,l,r,o,i),Ao(t,i)),t.offset,s,a),c,l)}function jd(e,t,n,r,o,i){return Ur(ct(t,n,r,o,i),Ao(e,i),n)}function Rd(e,t){return{...Ze(ws,e),...H(t,ws,ha)}}function Nd(e,t){return _e((n=e,r=t,Mt({...n,...H(r,mu,Ku)})));var n,r}function zr(e,t,n){let[r,o]=zt(e,t,n);return Uc(r,o)}function _d(e,t,n){let[r,o]=ac(n,e),i=St(t),s=Math.max(r,i),a=o&&Gr(o);if(!o&&Eo(s,a))return Ic(t,r);if(o||b("Missing relativeTo"),!t.sign&&(!a||r<6))return 0;let[l,c,u]=Ru(o,t,r);return Eo(r,a)?Ic(l,r):((d,p,f,g)=>{let y=j[f],h=zs(f,d);return Mh(d[y],Wr(d)||1,p,v=>(h[y]=v,Uo(g,h)))})(l,c,r,u)}function Ic(e,t){return Zc(st(e),Ee[t])}function Hd(e,t,n){return Se(e.epochNanoseconds,t,n)}function Bd(e){return Ce(e.epochNanoseconds)}function Aa(e){return ze(U(e),e.calendar)}function Oa(e){return O(U(e),e.calendar)}function ja(e){return tn(U(e))}function Vd(e,t,n){return Se(He(An(t,e,n)),t,e.calendar)}function Gd(e,t,n){let r;return r=n?An(t,N(e,n)):Sn(t,N(e,Ne)),Se(r,t,e.calendar)}function Wd(e,t,n){return Zd(e,Ze(ue(e,Mr,Kc),t),H(wt(n),Kt,Pe,[]))}function $d(e,t,n){let r=ue(e,Fo,ph);return Zd(e,Ze(Xc,t),H(wt(n),r,Pe,[]))}function qd(e,t){let n=H(t,Xc,Pe),[r,o]=Ko(n,e);return Jo(n,e,r,o,0)}function Ud(e,t){let n=H(t,ue(e,Mr,Kc),Pe),[r,o]=Me(n,e,1);return Xo(n,e,r,o,0)}function Zd(e,t,n){let r=ue(e,hh,gh),o=Nn(e,t,n);o=H(o,r,Pe,[]);let[i,s]=Me(o,e);return ct(o,e,i,s,0)}function Yd(e){return Ce(He(BigInt(Rr(e))*Mn))}function zd(e){return Ce(He(No(e)))}function _n(e){return e.timeZone="UTC",["full","long"].includes(e.timeStyle)&&(e.timeStyle="medium"),e}function Kd(e,t){return e.timeZone!==void 0&&F("Cannot specify TimeZone"),e.timeZone=t,e}function Hn(e,t,n){let r=e.resolvedOptions().calendar;!n&&t.calendar===ye||Re(t.calendar)===r||b("Mismatching Calendars")}function rn(e,t,n,r,o){let i=new Set(e),s=new Set(t),a=new Set(n);return(l,c)=>{let u,d,p={},f={},g={},y=0,h=0;for(let $ of Object.keys(l)){let yn=l[$];yn===void 0||a.has($)||(i.has($)?$==="dateStyle"?u=yn:$==="timeStyle"?d=yn:p[$]=yn:$==="era"?f[$]=yn:s.has($)?$==="dateStyle"||$==="timeStyle"?h=1:y=1:g[$]=yn)}let v=u!==void 0,k=d!==void 0,C=v||k,D=Object.keys(p).length>0,L=y||h,T=D||v||k,Q=Object.keys(f).length>0;(!c&&L||c&&L&&!T||C&&(D||Q||y))&&F("Invalid formatting options");let ee={};return C||T||Object.assign(ee,r),Object.assign(ee,p,f,g),v&&(o?Object.assign(ee,o[u]):ee.dateStyle=u),k&&(ee.timeStyle=d),ee}}var Xd={year:"numeric",month:"numeric",day:"numeric"},Jd={hour:"numeric",minute:"numeric",second:"numeric"},Ra=Object.assign({},Xd,Jd),Na=["weekday","year","month","day","dateStyle"],Kr=["dayPeriod","hour","minute","second","fractionalSecondDigits","timeStyle"],_a=Na.concat(Kr),hg=["weekday","day"].concat(Kr),gg=["weekday","year"].concat(Kr),Qd=rn(_a,[],[],Ra),ep=rn(_a,[],[],{...Ra,timeZoneName:"short"}),tp=rn(_a,[],["timeZoneName"],Ra),np=rn(Na,Kr,["timeZoneName"],Xd),rp=rn(Kr,Na,["timeZoneName","era"],Jd),op=rn(["year","month","dateStyle"],hg,["timeZoneName"],{year:"numeric",month:"numeric"},{full:{year:"numeric",month:"long"},long:{year:"numeric",month:"long"},medium:{year:"numeric",month:"short"},short:{year:"2-digit",month:"numeric"}}),ip=rn(["month","day","dateStyle"],gg,["timeZoneName","era"],{month:"numeric",day:"numeric"},{full:{month:"long",day:"numeric"},long:{month:"long",day:"numeric"},medium:{month:"short",day:"numeric"},short:{month:"numeric",day:"numeric"}});function sp(e,t){let{timeZone:n}=e,r=U(e),{offsetNanoseconds:o}=r,i=t||Ne,s;return s=t?Ln(n,N(r,i),o,2):Sn(n,N(r,i)),Se(s,n,e.calendar)}function ti(e){let t=ni(),n=e.B(t);return Ar(t+BigInt(n))}function ni(){return BigInt(Date.now())*Mn}function Bn(){return new Ke().resolvedOptions().timeZone}var Ha="PlainYearMonth",Ba="PlainMonthDay",Va="PlainDate",Ga="PlainDateTime",Wa="PlainTime",$a="ZonedDateTime",qa="Instant",Ua="Duration";function ut(e,t,n,...r){return Object.defineProperties(t,_c(e)),Object.defineProperties(t.prototype,wr("Temporal."+e)),Object.defineProperties(t.prototype,Dt(o=>({get(){return o(n(this))},configurable:1}),Object.assign({},...r))),t}var dt=Ls.name==="noop"?e=>{Object.defineProperty(e,"_str_",{value:e.toJSON()})}:Ls;function pt(){F(Oc)}function ft(){F(Ac)}var ap={era(e){return jr(e.calendar,e).era},eraYear(e){return jr(e.calendar,e).eraYear},year(e){return A(e.calendar,e).year},month(e){return A(e.calendar,e).month},monthCode(e){return Ro(e.calendar,e)}},ri={era(e){return jr(e.calendar,e).era},eraYear(e){return jr(e.calendar,e).eraYear},year(e){return A(e.calendar,e).year},month(e){return A(e.calendar,e).month},monthCode(e){return Ro(e.calendar,e)},day(e){return A(e.calendar,e).day}},lp={monthCode(e){return Ro(e.calendar,e)},day(e){return A(e.calendar,e).day}},cp={daysInMonth(e){return qs(e.calendar,e)},daysInYear(e){return Us(e.calendar,e)},monthsInYear(e){return $s(e.calendar,e)},inLeapYear(e){return Ws(e.calendar,e)}},oi={dayOfWeek(e){return jo(e)},dayOfYear(e){return du(e.calendar,e)},weekOfYear(e){return pu(e.calendar,e)},yearOfWeek(e){return fu(e.calendar,e)},daysInWeek(){return 7},daysInMonth(e){return qs(e.calendar,e)},daysInYear(e){return Us(e.calendar,e)},monthsInYear(e){return $s(e.calendar,e)},inLeapYear(e){return Ws(e.calendar,e)}};function Za(e,t,n,r){let[o,i,s,a]=qt(e,r,3,5);return Vn(e,Vr(t.epochNanoseconds,n.epochNanoseconds,o,i,s,a))}function Ya(e,t,n,r){let o=Br(t.calendar,n.calendar),[i,s,a,l]=qt(e,r,5);return Vn(e,Pu(o,t,n,i,s,a,l))}function za(e,t,n,r){let o=Br(t.calendar,n.calendar),[i,s,a,l]=qt(e,r,6);return Vn(e,Mu(o,t,n,i,s,a,l))}function Ka(e,t,n,r){let o=Br(t.calendar,n.calendar),[i,s,a,l]=qt(e,r,6,9,6);return Vn(e,Fu(o,t,n,i,s,a,l))}function Xa(e,t,n,r){let o=Br(t.calendar,n.calendar),[i,s,a,l]=qt(e,r,9,9,8);return Vn(e,Iu(o,t,n,i,s,a,l))}function Ja(e,t,n,r){let[o,i,s,a]=qt(e,r,5,5);return Vn(e,Lu(t,n,o,i,s,a))}function Vn(e,t){return _e(e?De(t):t)}function up(e,t,n){let{calendar:r}=e,o=Fd(r,e,t),[i,s]=Me(o,r),a=x(n);return ct(o,r,i,s,a)}function dp(e,t,n){let{calendar:r}=e,[o,i]=Id(r,e,t),[s,a]=Me(i,r),l=x(n);return jd(o,i,r,s,a,l)}function pp(e,t,n){let{calendar:r}=e,o=Ld(r,e,t),[i,s]=Me(o,r,1),a=x(n);return Xo(o,r,i,s,a)}function fp(e,t,n){let{calendar:r}=e,o=Ad(r,e,t),[i,s]=Ko(o,r),a=x(n);return Jo(o,r,i,s,a)}function mp(e,t,n){let r=Rd(e,t),o=x(n);return Rn(r,o)}function hp(e,t,n){let{calendar:r}=e,[o,i]=Md(r,e,t),[s,a]=Me(i,r),[l,c,u]=xt(n,2);return Od(e,o,i,s,a,l,c,u)}function Ot(e){let t=re(e).toLowerCase();return t===Ns?ye:t===Gc?$c:void b(Rc(e,"temporal-polyfill/full"))}function Jr(e=Ns){return Ot(e)}var yp=new WeakMap,vp=ut($a,class{constructor(e,t,n=void 0){let r=He(No(e)),o=me(rd(t)),i=Jr(n);bp(this,Se(r,o,i))}static from(e,t=void 0){return he(Gn(e,t))}static compare(e,t){return $r(Gn(e),Gn(t))}get calendarId(){return Re(M(this).calendar)}get timeZoneId(){return M(this).timeZone.id}get epochMilliseconds(){return Fr(M(this).epochNanoseconds)}get epochNanoseconds(){return M(this).epochNanoseconds}get offset(){return Zr(U(M(this)).offsetNanoseconds)}get offsetNanoseconds(){return U(M(this)).offsetNanoseconds}get hoursInDay(){return wu(M(this))}with(e,t=void 0){return he(hp(M(this),Zn(e),t))}withCalendar(e){return he({...M(this),calendar:ai(e)})}withTimeZone(e){return he({...M(this),timeZone:me(Le(e))})}withPlainTime(e=void 0){return he(sp(M(this),rl(e)))}add(e,t=void 0){let n=M(this);return he(_r(n,J(e),x(t)))}subtract(e,t=void 0){let n=M(this);return he(_r(n,De(J(e)),x(t)))}until(e,t=void 0){let n=M(this),r=Gn(e);return G(Ya(0,n,r,t))}since(e,t=void 0){let n=M(this),r=Gn(e);return G(Ya(1,n,r,t))}round(e){let t=M(this),[n,r,o]=fr(e);return he(ku(t,n,r,o))}startOfDay(){return he(Tu(M(this)))}equals(e){return Wu(M(this),Gn(e))}toInstant(){return mt(Bd(M(this)))}toPlainDateTime(){return Xe(Aa(M(this)))}toPlainDate(){return Je(Oa(M(this)))}toPlainTime(){return At(ja(M(this)))}toLocaleString(e=void 0,t={}){let n=M(this),r=new Ke(e,Kd(ep(t),Du(n)));return Hn(r,n),r.format(Fr(n.epochNanoseconds))}toString(e=void 0){return ba(M(this),e)}toJSON(){return ba(M(this))}getTimeZoneTransition(e){let t=M(this),n=t.timeZone.C(t.epochNanoseconds,fc(e));return n!==void 0?he({...t,epochNanoseconds:n}):null}valueOf(){return ft()}},yg,ri,oi,Dr);function he(e){return bp(Object.create(vp.prototype),e)}function M(e){return Qe(e)||pt()}function yg(e){let t=M(e);return{...U(t),calendar:t.calendar}}function Qe(e){return yp.get(e)}function Gn(e,t){if(fe(e)){let n=Qe(e);if(n)return xt(t),n;let r=Qr(e);return sd(Le,r,e,t)}return hd(e,Ot,t)}function bp(e,t){return yp.set(e,t),dt(e),e}function Le(e){if(fe(e)){let t=Qe(e);return t||F(Ms(e)),t.timeZone.id}return(t=>ei(xd(re(t))))(e)}var kp=new WeakMap,wp=ut(qa,class{constructor(e){let t=He(No(e));xp(this,Ce(t))}static from(e){return mt(Wn(e))}static fromEpochMilliseconds(e){return mt(Yd(e))}static fromEpochNanoseconds(e){return mt(zd(e))}static compare(e,t){return $r(Wn(e),Wn(t))}get epochMilliseconds(){return Fr(Ie(this).epochNanoseconds)}get epochNanoseconds(){return Ie(this).epochNanoseconds}add(e){let t=Ie(this);return mt(Ce(oa(t.epochNanoseconds,J(e))))}subtract(e){let t=Ie(this);return mt(Ce(oa(t.epochNanoseconds,De(J(e)))))}until(e,t=void 0){return G(Za(0,Ie(this),Wn(e),t))}since(e,t=void 0){return G(Za(1,Ie(this),Wn(e),t))}round(e){let t=Ie(this),[n,r,o]=fr(e,5,1);return mt(Ce(Wo(t.epochNanoseconds,Nr(n,r),o)))}equals(e){return Gu(Ie(this),Wn(e))}toZonedDateTimeISO(e){return he(Hd(Ie(this),me(Le(e))))}toLocaleString(e=void 0,t={}){let n=Ie(this);return new Ke(e,Qd(t)).format(Fr(n.epochNanoseconds))}toString(e=void 0){return va(Le,Ie(this),e)}toJSON(){return va(Le,Ie(this))}valueOf(){return ft()}});function mt(e){return xp(Object.create(wp.prototype),e)}function Ie(e){return tl(e)||pt()}function tl(e){return kp.get(e)}function Wn(e){if(fe(e)){let t=tl(e);if(t)return t;let n=Qe(e);if(n)return Ce(n.epochNanoseconds)}return fd(e)}var{toTemporalInstant:Tp}={toTemporalInstant(){let e=Date.prototype.valueOf.call(this);return mt(Ce(BigInt(Ks(e))*Mn))}};function xp(e,t){return kp.set(e,t),dt(e),e}var Ep=new WeakMap,Cp=ut(Ba,class{constructor(e,t,n=void 0,r){let o=V(e),i=V(t),s=Jr(n),a=V(r??su),l=be(at({year:a,month:o,day:i}));Sp(this,O(l,s))}static from(e,t=void 0){return el(gp(e,t))}get calendarId(){return Re(Ft(this).calendar)}with(e,t=void 0){return el(fp(Ft(this),Zn(e),t))}equals(e){return Zu(Ft(this),gp(e))}toPlainDate(e){let t=Ft(this);return Je($d(t.calendar,this,e))}toLocaleString(e=void 0,t={}){let n=Ft(this),r=new Ke(e,_n(ip(t)));return Hn(r,n,1),r.format(Lr(n))}toString(e=void 0){return xa(Ft(this),e)}toJSON(){return xa(Ft(this))}valueOf(){return ft()}},Ft,lp);function el(e){return Sp(Object.create(Cp.prototype),e)}function Ft(e){return ii(e)||pt()}function ii(e){return Ep.get(e)}function gp(e,t){if(fe(e)){let r=ii(e);if(r)return x(t),r;let o=Hp(e);return ud(o===void 0?ye:o,o===void 0,e,t)}let n=bd(e,Ot);return x(t),n}function Sp(e,t){return Ep.set(e,t),dt(e),e}var Dp=new WeakMap,Pp=ut(Ha,class{constructor(e,t,n=void 0,r){let o=V(e),i=V(t),s=Jr(n),a=V(r??1),l=_o(at({year:o,month:i,day:a}));Mp(this,O(l,s))}static from(e,t=void 0){return Xr($n(e,t))}static compare(e,t){return nn($n(e),$n(t))}get calendarId(){return Re(Fe(this).calendar)}with(e,t=void 0){return Xr(pp(Fe(this),Zn(e),t))}add(e,t=void 0){let n=Fe(this);return Xr(O(ra(n.calendar,n,J(e),x(t)),n.calendar))}subtract(e,t=void 0){let n=Fe(this);return Xr(O(ra(n.calendar,n,De(J(e)),x(t)),n.calendar))}until(e,t=void 0){let n=Fe(this),r=$n(e);return G(Xa(0,n,r,t))}since(e,t=void 0){let n=Fe(this),r=$n(e);return G(Xa(1,n,r,t))}equals(e){return Uu(Fe(this),$n(e))}toPlainDate(e){let t=Fe(this);return Je(Wd(t.calendar,this,e))}toLocaleString(e=void 0,t={}){let n=Fe(this),r=new Ke(e,_n(op(t)));return Hn(r,n,1),r.format(Lr(n))}toString(e=void 0){return Ta(Fe(this),e)}toJSON(){return Ta(Fe(this))}valueOf(){return ft()}},Fe,ap,cp);function Xr(e){return Mp(Object.create(Pp.prototype),e)}function Fe(e){return si(e)||pt()}function si(e){return Dp.get(e)}function $n(e,t){if(fe(e)){let r=si(e);if(r)return x(t),r;let o=Qr(e);return cd(o,e,t)}let n=vd(e,Ot);return x(t),n}function Mp(e,t){return Dp.set(e,t),dt(e),e}function vg(e){if(!fe(e))return;let t=tl(e);return t?[qa,t]:(t=Qe(e),t?[$a,t]:(t=on(e),t?[Ga,t]:(t=Yn(e),t?[Va,t]:(t=nl(e),t?[Wa,t]:(t=si(e),t?[Ha,t]:(t=ii(e),t?[Ba,t]:(t=ol(e),t?[Ua,t]:void 0)))))))}function Zn(e){return(vg(e)||e.calendar!==void 0||e.timeZone!==void 0)&&F(Lc),e}var Ip=new WeakMap,Fp=ut(Wa,class{constructor(e=0,t=0,n=0,r=0,o=0,i=0){let s=Ir(Dt(V,{hour:e,minute:t,second:n,millisecond:r,microsecond:o,nanosecond:i}));Lp(this,tn(s))}static from(e,t=void 0){return At(Lt(e,t))}static compare(e,t){return Yo(Lt(e),Lt(t))}with(e,t=void 0){return At(mp(Be(this),Zn(e),t))}add(e){let t=Be(this);return At($o(t,J(e))[0])}subtract(e){let t=Be(this);return At($o(t,De(J(e)))[0])}until(e,t=void 0){return G(Ja(0,Be(this),Lt(e),t))}since(e,t=void 0){return G(Ja(1,Be(this),Lt(e),t))}round(e){let t=Be(this),[n,r,o]=fr(e,5);return At(Vo(t,Fn(n,r),o)[0])}equals(e){return Yu(Be(this),Lt(e))}toLocaleString(e=void 0,t={}){let n=Be(this);return new Ke(e,_n(rp(t))).format(Bs(n))}toString(e=void 0){return Ea(Be(this),e)}toJSON(){return Ea(Be(this))}valueOf(){return ft()}},Be,Dr);function At(e){return Lp(Object.create(Fp.prototype),e)}function Be(e){return nl(e)||pt()}function nl(e){return Ip.get(e)}function Lt(e,t){if(fe(e)){let r=nl(e);if(r)return x(t),r;let o=on(e);if(o)return x(t),tn(o);let i=Qe(e);return i?(x(t),ja(i)):dd(e,t)}let n=kd(e);return x(t),n}function rl(e){return e===void 0?void 0:Lt(e)}function Lp(e,t){return Ip.set(e,t),dt(e),e}var Ap=new WeakMap,Op=ut(Ga,class{constructor(e,t,n,r=0,o=0,i=0,s=0,a=0,l=0,c=void 0){let u=en(Or(Dt(V,{year:e,month:t,day:n,hour:r,minute:o,second:i,millisecond:s,microsecond:a,nanosecond:l}))),d=Jr(c);jp(this,ze(u,d))}static from(e,t=void 0){return Xe(qn(e,t))}static compare(e,t){let n=qn(e),r=qn(t);return fa(n,r)}get calendarId(){return Re(X(this).calendar)}with(e,t=void 0){return Xe(dp(X(this),Zn(e),t))}withCalendar(e){let t=X(this);return Xe(ze(t,ai(e)))}withPlainTime(e=void 0){let t=X(this);return Xe(Ur(t,rl(e),t.calendar))}add(e,t=void 0){let n=X(this);return Xe(ze(Hr(n.calendar,n,J(e),x(t)),n.calendar))}subtract(e,t=void 0){let n=X(this);return Xe(ze(Hr(n.calendar,n,De(J(e)),x(t)),n.calendar))}until(e,t=void 0){let n=X(this),r=qn(e);return G(za(0,n,r,t))}since(e,t=void 0){let n=X(this),r=qn(e);return G(za(1,n,r,t))}round(e){let t=X(this),[n,r,o]=fr(e);return Xe(ze(Bo(t,Fn(n,r),o),t.calendar))}equals(e){return $u(X(this),qn(e))}toZonedDateTime(e,t=void 0){return he(Vd(X(this),me(Le(e)),lc(t)))}toPlainDate(){let e=X(this);return Je(O(e,e.calendar))}toPlainTime(){return At(tn(X(this)))}toLocaleString(e=void 0,t={}){let n=X(this),r=new Ke(e,_n(tp(t)));return Hn(r,n),r.format(ou(n))}toString(e=void 0){return ka(X(this),e)}toJSON(){return ka(X(this))}valueOf(){return ft()}},X,ri,oi,Dr);function Xe(e){return jp(Object.create(Op.prototype),e)}function X(e){return on(e)||pt()}function on(e){return Ap.get(e)}function qn(e,t){if(fe(e)){let r=on(e);if(r)return x(t),r;let o=Yn(e);if(o)return x(t),ze(N(o,Ne),o.calendar);let i=Qe(e);if(i)return x(t),Aa(i);let s=Qr(e);return ad(s,e,t)}let n=gd(e,Ot);return x(t),n}function jp(e,t){return Ap.set(e,t),dt(e),e}var Rp=new WeakMap,Np=ut(Va,class{constructor(e,t,n,r=void 0){let o=be(at(Dt(V,{year:e,month:t,day:n}))),i=Jr(r);_p(this,O(o,i))}static from(e,t=void 0){return Je(Un(e,t))}static compare(e,t){return nn(Un(e),Un(t))}get calendarId(){return Re(oe(this).calendar)}with(e,t=void 0){return Je(up(oe(this),Zn(e),t))}withCalendar(e){let t=oe(this);return Je(O(t,ai(e)))}add(e,t=void 0){let n=oe(this);return Je(O(lt(n.calendar,n,J(e),x(t)),n.calendar))}subtract(e,t=void 0){let n=oe(this);return Je(O(lt(n.calendar,n,De(J(e)),x(t)),n.calendar))}until(e,t=void 0){let n=oe(this),r=Un(e);return G(Ka(0,n,r,t))}since(e,t=void 0){let n=oe(this),r=Un(e);return G(Ka(1,n,r,t))}equals(e){return qu(oe(this),Un(e))}toZonedDateTime(e){let t=fe(e)?{timeZone:e.timeZone,plainTime:e.plainTime}:{timeZone:e},n=oe(this),r=Le(t.timeZone),o=t.plainTime,i=o!==void 0?Lt(o):void 0;return he(Gd(n,me(r),i))}toPlainDateTime(e=void 0){let t=oe(this);return Xe(Ur(t,rl(e),t.calendar))}toPlainYearMonth(){let e=oe(this);return Xr(Ud(e.calendar,this))}toPlainMonthDay(){let e=oe(this);return el(qd(e.calendar,this))}toLocaleString(e=void 0,t={}){let n=oe(this),r=new Ke(e,_n(np(t)));return Hn(r,n),r.format(Lr(n))}toString(e=void 0){return wa(oe(this),e)}toJSON(){return wa(oe(this))}valueOf(){return ft()}},oe,ri,oi);function Je(e){return _p(Object.create(Np.prototype),e)}function oe(e){return Yn(e)||pt()}function Yn(e){return Rp.get(e)}function Un(e,t){if(fe(e)){let r=Yn(e);if(r)return x(t),r;let o=on(e);if(o)return x(t),O(o,o.calendar);let i=Qe(e);if(i)return x(t),Oa(i);let s=Qr(e);return ld(s,e,t)}let n=yd(e,Ot);return x(t),n}function _p(e,t){return Rp.set(e,t),dt(e),e}function Qr(e){let t=Hp(e);return t===void 0?ye:t}function Hp(e){let{calendar:t}=e;if(t!==void 0)return ai(t)}function ai(e){if(fe(e)){let t=Yn(e)||on(e)||Qe(e)||ii(e)||si(e);return t||F(jc(e)),t.calendar}return(t=>Ot(Td(re(t))))(e)}var Bp=new WeakMap,Vp=ut(Ua,class{constructor(e=0,t=0,n=0,r=0,o=0,i=0,s=0,a=0,l=0,c=0){let u=Mt(Dt(Rr,{years:e,months:t,weeks:n,days:r,hours:o,minutes:i,seconds:s,milliseconds:a,microseconds:l,nanoseconds:c}));Gp(this,_e(u))}static from(e){return G(J(e))}static compare(e,t,n=void 0){return Vu(Qa,J(e),J(t),n)}get sign(){return ke(this).sign}get blank(){return!ke(this).sign}with(e){return G(Nd(ke(this),e))}negated(){return G(da(ke(this)))}abs(){return G(_u(ke(this)))}add(e){return G(ua(0,ke(this),J(e)))}subtract(e){return G(ua(1,ke(this),J(e)))}round(e){return G(Nu(Qa,ke(this),e))}total(e){return _d(Qa,ke(this),e)}toLocaleString(e=void 0,t){let n=ke(this);return Intl.DurationFormat?new Intl.DurationFormat(e,t).format(n):Qo(n,t)}toString(e=void 0){return Qo(ke(this),e)}toJSON(){return Qo(ke(this))}valueOf(){return ft()}},ke,Zs);function G(e){return Gp(Object.create(Vp.prototype),e)}function ke(e){return ol(e)||pt()}function ol(e){return Bp.get(e)}function J(e){return fe(e)?ol(e)||pd(e):wd(e)}function Qa(e){if(e!==void 0){if(fe(e)){let t=Qe(e);if(t)return t;let n=Yn(e);if(n)return n;let r=on(e);if(r)return O(r,r.calendar);let o=Qr(e);return id(Le,o,e)}return md(e,Ot)}}function Gp(e,t){return Bp.set(e,t),dt(e),e}var bg=Object.defineProperties({},{...wr("Temporal.Now"),...Po({timeZoneId(){return Bn()},instant(){return mt(Ce(ni()))},zonedDateTimeISO(e=Bn()){let t=me(Le(e));return he(Se(ni(),t))},plainDateTimeISO(e=Bn()){let t=ti(me(Le(e)));return Xe(ze(t))},plainDateISO(e=Bn()){let t=ti(me(Le(e)));return Je(O(t))},plainTimeISO(e=Bn()){let t=ti(me(Le(e)));return At(tn(t))}})}),Wp=Object.defineProperties({},{...wr("Temporal"),...Po({PlainYearMonth:Pp,PlainMonthDay:Cp,PlainDate:Np,PlainTime:Fp,PlainDateTime:Op,ZonedDateTime:vp,Instant:wp,Duration:Vp,Now:bg})});var W=Qi||Wp;var Ib=Qi?Date.prototype.toTemporalInstant:Tp;var $p={};var qp={};var sn={"archive.confirm.one":"Archive {count} completed task in {projects}?","archive.confirm.other":"Archive {count} completed tasks in {projects}?","archive.confirmButton":"Archive","archive.done.one":"Archived {count} task.","archive.done.other":"Archived {count} tasks.","archive.nothingReady":"No completed tasks are ready to archive.","archive.sweepDone.one":"Archived {count} completed task in {projects}.","archive.sweepDone.other":"Archived {count} completed tasks in {projects}.","bulk.clearAssignees":"Clear assignees","bulk.clearDueDate":"Clear due date","bulk.clearSelection":"Clear selection","bulk.clearTags":"Clear tags","bulk.enterTag":"Enter tag:","bulk.failed":"Bulk action failed. Please try again.","bulk.inOneWeek":"In 1 week ({date})","bulk.inTwoWeeks":"In 2 weeks ({date})","bulk.newTag":"+ new tag...","bulk.pickDate":"Pick date...","bulk.removeParent":"Remove parent","bulk.setAssignee":"Set assignee","bulk.setParent":"Set parent","bulk.setPriority":"Set priority","bulk.setProgress":"Set progress","bulk.setStatus":"Set status","bulk.setTag":"Set tag","bulk.tagPlaceholder":"Tag","bulk.today":"Today ({date})","bulk.tomorrow":"Tomorrow ({date})","cell.projectActions":"Project actions","cell.taskActions":"Task actions","chip.milestone":"M","chip.recurring":"R","chip.recurringTooltip":"Recurring","chip.subtask":"Sub","collapse.collapse":"Collapse {subject}","collapse.expand":"Expand {subject}","collapse.subProjects":"sub-projects","collapse.subtasks":"subtasks","columns.assignees":"Assignees","columns.due":"Due","columns.members":"Members","columns.priority":"Priority","columns.progress":"Progress","columns.project":"Project","columns.status":"Status","columns.task":"Task","columns.tasks":"Tasks","columns.time":"Time","commands.archiveCompleted":"Archive completed tasks","commands.duplicateProject":"Duplicate project","commands.exportViewHtml":"Export current view as HTML","commands.importNotes":"Import notes as tasks","commands.linkPeople":"Link assignees to their person notes","commands.newProject":"Create new project","commands.newSubtask":"Create new subtask","commands.newTask":"Create new task","commands.openAllProjects":"Open all projects in one view","commands.openCurrentAsProject":"Open current file as project","commands.openProjects":"Open projects pane","commands.personTasks":"Show tasks assigned to a person","commands.personTasksThisNote":"Show tasks assigned to this note","commands.rebuildIndex":"Rebuild project index","commands.rebuildIndexDone.one":"Found {count} project.","commands.rebuildIndexDone.other":"Found {count} projects.","commands.redo":"Redo last action","commands.showReleaseNotes":"Show release notes","commands.taskFromSelection":"Create task from selection","commands.undo":"Undo last action","common.addAnother":"Add another","common.archive":"Archive","common.archived":"Archived","common.cancel":"Cancel","common.clear":"Clear","common.close":"Close","common.delete":"Delete","common.description":"Description","common.hide":"Hide","common.no":"No","common.noParent":"No parent","common.none":"None","common.off":"Off","common.ok":"OK","common.on":"On","common.project":"Project","common.remove":"Remove","common.selectedCount":"{count} selected","common.show":"Show","common.somethingWentWrong":"Something went wrong. Check the console for details.","common.task":"Task","common.unarchive":"Unarchive","common.untitled":"Untitled","common.yes":"Yes","count.projects.one":"{count} project","count.projects.other":"{count} projects","count.tasks.one":"{count} task","count.tasks.other":"{count} tasks","customField.addOption":"Add option","customField.addValue":"Add value","customField.filterable":"Shown in filters","customField.namePlaceholder":"Field name","customField.notFilterable":"Hidden from filters","customField.option":"Option {index}","customField.removeField":"Remove field","customField.removeOption":"Remove option","customField.setPerson":"Set person","dashboard.title":"Projects","dates.daysLate.one":"{count}d late","dates.daysLate.other":"{count}d late","dates.inDays.one":"In {count}d","dates.inDays.other":"In {count}d","dates.onTime":"On time","dates.overdueDays.one":"{count}d overdue","dates.overdueDays.other":"{count}d overdue","dates.today":"Today","dates.tomorrow":"Tomorrow","dialog.duplicateWithSubtasks":\'Duplicate "{title}" with its subtasks?\',"dialog.taskOnly":"Task only","dialog.withSubtasks":"With subtasks","export.saved":"Saved {path}","fieldType.checkbox":"Checkbox","fieldType.date":"Date","fieldType.multiselect":"Multi-select","fieldType.number":"Number","fieldType.person":"Person","fieldType.select":"Select","fieldType.text":"Text","fieldType.url":"URL","fields.dates":"Dates","fields.description":"Description preview","fields.subtasks":"Subtasks as cards","fileType.base":"Database","fileType.canvas":"Canvas","filter.addFilter":"Add filter","filter.assignee":"Assignee","filter.back":"Back","filter.clearAll":"Clear all","filter.clearAllFilters":"Clear all filters","filter.count.one":"{count} filter","filter.count.other":"{count} filters","filter.customFields":"Custom fields","filter.dueDate":"Due date","filter.emptyNone":"No single filter brings any task back.","filter.emptySuggest.one":"Removing {label} would show {count} task.","filter.emptySuggest.other":"Removing {label} would show {count} tasks.","filter.emptyTitle":"No tasks match these filters","filter.filterBy":"Filter by...","filter.findValue":"Find value...","filter.from":"from {date}","filter.hideBar":"Hide filters","filter.includeArchived":"Include archived","filter.included":"Included","filter.is":"is","filter.isAnyOf":"is any of","filter.noDate":"No date","filter.noSearchMatch":"Nothing matches {text}","filter.noValues":"No values in this view yet.","filter.op.all":"has all of","filter.op.between":"is between","filter.op.checked":"is checked","filter.op.contains":"contains","filter.op.empty":"is empty","filter.op.eq":"equals","filter.op.gte":"is at least","filter.op.lte":"is at most","filter.op.ne":"does not equal","filter.op.none":"is not","filter.op.noneOf":"is none of","filter.op.notContains":"does not contain","filter.op.notEmpty":"is not empty","filter.op.unchecked":"is not checked","filter.overdue":"Overdue","filter.range":"{from} to {to}","filter.remove":"Remove {label} filter","filter.removeNamed":"Remove {label}","filter.startDate":"Start date","filter.tag":"Tag","filter.thisMonth":"This month","filter.thisWeek":"This week","filter.title":"Title","filter.today":"Today","filter.type":"Type","filter.until":"until {date}","filter.valuePlaceholder":"Value","gantt.clickToSetDates":"Click to set dates","gantt.collapseAll":"Collapse all","gantt.datesReverted":"Dates reverted. Dependent task dates may need adjustment.","gantt.dependsElsewhere.one":"Depends on {count} elsewhere","gantt.dependsElsewhere.other":"Depends on {count} elsewhere","gantt.expandAll":"Expand all","gantt.inProject":"{title} ({project})","gantt.linkCycle":"That link would create a dependency cycle.","gantt.linkDirection":"Connect a right dot (output) to a left dot (input).","gantt.linkExists":"This dependency already exists.","gantt.linkGone":"That task is no longer in this view.","gantt.linkSaveFailed":"Failed to save dependency.","gantt.milestoneTitle":"{title} (milestone)","gantt.quarterShort":"Q{quarter}","gantt.quarterYear":"Q{quarter} {year}","gantt.saveDateFailed":"Failed to save date change. Please try again.","gantt.setDatesFailed":"Failed to set task dates. Please try again.","gantt.today":"Today","gantt.tooltipAssignees":"Assignees: {names}","gantt.tooltipDate":"Date: {date}","gantt.tooltipDue":"Due: {date}","gantt.tooltipProgress":"Progress: {percent}%","gantt.tooltipStart":"Start: {date}","gantt.weekShort":"W{week}","gantt.weekWithRange":"W{week}: {range}","granularity.day":"Day","granularity.month":"Month","granularity.quarter":"Quarter","granularity.week":"Week","granularity.year":"Year","group.none":"No {field}","header.addSortKey":"Add sort key","header.allProjects":"All projects","header.allTasks":"All tasks","header.builtIn":"Built in","header.changedArchived":"Archived","header.changedDays":"Non-working days","header.changedFields":"Fields","header.changedFilter":"Filter","header.changedGroup":"Grouping","header.changedSort":"Sort","header.columns":"Columns","header.columnsBy":"Columns by","header.deleteView":"Delete view","header.emptyColumn":"empty","header.fields":"Fields","header.fieldsBoard":"Board card","header.fieldsTable":"Table columns","header.fieldsTimeline":"Timeline label","header.filter":"Filter","header.findProject":"Find project or folder...","header.findView":"Find view...","header.group":"Group","header.groupBy":"Group by","header.groupFolder":"Folder","header.groupNone":"No grouping","header.groupTag":"Tag","header.hiddenCount.one":"{count} hidden","header.hiddenCount.other":"{count} hidden","header.hiddenFields":"Hidden","header.hideAll":"Hide all","header.hideColumn":"Hide column","header.hideEmpty":"Hide empty columns","header.hideField":"Hide field","header.isDefault":"Opens with this view","header.lockedField":"Always shown","header.makeDefault":"Open with this view","header.mode":"View mode","header.more":"More options","header.moreToAdd":"More to add","header.newProject":"New project","header.noProjectMatch":"No matching projects","header.noSort":"Tasks keep the order they are stored in.","header.noViewsHint":"Save the current filters and sort as a view to come back to them.","header.nothingToSave":"Set a filter first to save it as a view.","header.parentProjects":"Parent projects","header.removeSortKey":"Remove sort key","header.rename":"Rename view","header.resetSort":"Reset","header.resetWidths":"Reset widths","header.revert":"Revert changes","header.saveAsNew":"Save as new","header.saveAsNewTitle":"Save as new view","header.saveChanges":"Save","header.saveCurrent":"Save current as view...","header.savedViews":"Saved views","header.scale":"Timeline scale","header.scopeCount":"{projects} \\xB7 {tasks}","header.search":"Search","header.selectedSummary.one":"{count} selected \\xB7 {tasks}","header.selectedSummary.other":"{count} selected \\xB7 {tasks}","header.showAll":"Show all","header.showColumn":"Show column","header.showField":"Show field","header.showHiddenColumns":"Show hidden columns","header.showProject":"Show {title} in this view","header.showProjects.one":"Show {count} project","header.showProjects.other":"Show {count} projects","header.showTasks.one":"Show {count} task","header.showTasks.other":"Show {count} tasks","header.shownOf":"{shown} of {total}","header.shownSummary":"{shown} of {total} shown","header.sort":"Sort","header.sortBy":"Sort by","header.sortCount":"{count} of {max}","header.storedInNote":"Kept in the note of {name}.","header.storedInSettings":"Kept in plugin settings on this vault.","header.switchProject":"Switch project","header.taskCount.one":"{count} task","header.taskCount.other":"{count} tasks","header.unsaved":"Unsaved changes: {changes}","header.updateView":"Update view","header.viewMode":"View mode: {mode}","header.viewName":"View name\\u2026","header.viewOptions":"View options","header.widthFill":"fill","idRepair.repaired":\'Repaired duplicated ids in "{title}" (copied project).\',"import.back":"Back","import.copy":"Copy (keep original)","import.defaultPriority":"Default priority","import.defaultStatus":"Default status","import.fileHandling":"File handling","import.imported.one":"Imported {count} task","import.imported.other":"Imported {count} tasks","import.importedWithSkipped.one":"Imported {count} task ({skipped} skipped)","import.importedWithSkipped.other":"Imported {count} tasks ({skipped} skipped)","import.move":"Move to tasks folder (default)","import.next":"Next","import.noProject":"Error: project not set for import","import.options":"Import options","import.searchFiles":"Search files...","import.selectAll":"Select all","import.selectNotes":"Select notes to import","import.submit":"Import ({count})","linkPeople.allLinked":"Every assignee already links to a note.","linkPeople.ambiguous.one":"{count} name matches several notes and is left alone.","linkPeople.ambiguous.other":"{count} names match several notes and are left alone.","linkPeople.confirm.one":"Link {count} name to its note: {names}.","linkPeople.confirm.other":"Link {count} names to their notes: {names}.","linkPeople.confirmButton":"Link","linkPeople.done":"Linked {tasks} and {projects}.","linkPeople.namesMore.one":"{names}, and {count} more","linkPeople.namesMore.other":"{names}, and {count} more","linkPeople.noMatches.one":"No note matches the {count} name in use.","linkPeople.noMatches.other":"No note matches any of the {count} names in use.","list.allArchived":"Every project is archived","list.allArchivedBody":\'Turn on "Archived" above to see them.\',"list.empty":"No projects yet","list.emptyBody":"Create your first project to get started.","list.looking":"Looking for projects","list.noFolder":"Vault root","list.noMatch":"No projects match these filters","list.noTag":"No tag","localApi.listenFailed":"The local API could not listen on port {port}.","migration.failed":\'dotpm: Migration failed for "{file}". Check console for details.\',"migration.migrated.one":"dotpm: Migrated {count} project to new format.","migration.migrated.other":"dotpm: Migrated {count} projects to new format.","migration.migrating":"Migrating project: {title}...","migration.moveFailed":\'dotpm: Could not move "{path}" into its own folder. Check console for details.\',"migration.moved.one":"dotpm: Moved {count} project into its own folder.","migration.moved.other":"dotpm: Moved {count} projects into their own folders.","migration.updatedRefs.one":"dotpm: Updated the references in {count} task note.","migration.updatedRefs.other":"dotpm: Updated the references in {count} task notes.","notify.dueIn.one":\'\\u{1F4C5} Due in {count}d: "{task}" in {project}\',"notify.dueIn.other":\'\\u{1F4C5} Due in {count}d: "{task}" in {project}\',"notify.dueToday":\'\\u{1F4C5} Due today: "{task}" in {project}\',"notify.overdue.one":\'\\u26A0\\uFE0F Overdue: "{task}" in {project} was due {count}d ago\',"notify.overdue.other":\'\\u26A0\\uFE0F Overdue: "{task}" in {project} was due {count}d ago\',"overview.archiveTooltip":"Archive this project and its sub-projects","overview.archivedBanner":"This project is archived. It stays out of the project list, pickers and reminders.","overview.archivedWithBanner":\'This project is archived with "{title}". Unarchive that project to bring it back.\',"overview.done":"done","overview.doneOfTotal":"{done} of {total}","overview.latestDue":"Latest due","overview.loggedEstimate":"logged / estimate","overview.members.one":"{count} member","overview.members.other":"{count} members","overview.milestones":"Milestones","overview.milestonesDone":"{done} of {total} done","overview.noDates":"No dates","overview.noDescription":"No description.","overview.noEstimate":"No estimate","overview.noMembers":"No members","overview.noMilestones":"No milestones.","overview.noTags":"No tags","overview.nobodyAssigned":"Nobody assigned","overview.ofTasks.one":"of {count} task","overview.ofTasks.other":"of {count} tasks","overview.overdue":"Overdue","overview.pastDue":"tasks past due","overview.progress":"Progress","overview.properties":"Properties","overview.subProjects.one":"{count} sub-project","overview.subProjects.other":"{count} sub-projects","overview.subProjectsHeading":"Sub-projects","overview.tasks":"Tasks","overview.tasksDone.one":"{done} of {count} task done","overview.tasksDone.other":"{done} of {count} tasks done","overview.time":"Time","palette.complete":"Done","people.add":\'Add "{name}"\',"people.addMember":"Add member","people.createNote":\'Create person note "{name}"\',"people.inVault":"People in your vault","people.search":"Search people\\u2026","personTasks.none":"No tasks assigned to {name}","picker.indexing":"Still looking for projects. Try again in a moment.","picker.noProjects":"No projects yet. Create a project first.","picker.noTasks":"No tasks in this project. Create a task first.","picker.openFailed":\'Could not open "{title}".\',"picker.pickParentTask":"Pick a parent task\\u2026","picker.pickPerson":"Pick a person\\u2026","picker.pickProject":"Pick a project\\u2026","priority.critical":"Critical","priority.high":"High","priority.low":"Low","priority.medium":"Medium","priorityIcons.alerts":"Alerts","priorityIcons.arrows":"Arrows","priorityIcons.chevrons":"Chevrons","priorityIcons.none":"None","priorityIcons.signal":"Signal bars","project.archive":"Archive project","project.archived":\'Archived "{title}".\',"project.color":"Color","project.delete":"Delete project","project.deleteConfirm":\'Delete "{title}"?\',"project.duplicateDefaultTitle":"{title} copy","project.duplicatePrompt":\'Duplicate "{title}" as\',"project.edit":"Edit project","project.icon":"Icon","project.members":"Members","project.missingBody":"It may have been deleted or renamed.","project.missingTitle":"No project here","project.namePlaceholder":"Project name","project.openAsNote":"Open as note","project.openOverview":"Open overview","project.openTasks":"Open tasks","project.openWithSubProjects":"Open with sub-projects","project.parent":"Parent","project.settings":"Project settings","project.unarchive":"Unarchive project","project.unarchived":\'Unarchived "{title}".\',"projectChip.open":"Open {title}","projectCreate.crumb":"New project","projectCreate.descriptionPlaceholder":"What this project covers and what done looks like","projectCreate.nameTaken":"A note with this name is already there.","projectCreate.submit":"Create project ({shortcut})","projectEdit.afterDays.one":"After {count} day","projectEdit.afterDays.other":"After {count} days","projectEdit.archivedWith":\'Yes, with "{title}"\',"projectEdit.behavior":"View and scheduling","projectEdit.behaviorHint":"Overrides for this project","projectEdit.customFieldsHint":"Extra properties for tasks","projectEdit.customPriorities":"Use custom priorities instead of the global ones","projectEdit.customStatuses":"Use custom statuses instead of the global ones","projectEdit.deleteHint":"Removes the project note. Its task files are left in the vault.","projectEdit.descriptionPlaceholder":"What is this project about?","projectEdit.done":"Done","projectEdit.from":"from {source}","projectEdit.general":"General","projectEdit.hideField":"Hide on this project","projectEdit.inherited":"Inherited","projectEdit.lineBorders":"Line borders in table","projectEdit.membersHint":"Who is on this project","projectEdit.merge":"Merge","projectEdit.mergeConfirm":"Move this project\'s {field} values onto the {target} from {source}, and stop defining it here?","projectEdit.mergeTooltip":"Merge into the {field} from {source}","projectEdit.name":"Name","projectEdit.never":"Never","projectEdit.overrideField":"Override on this project","projectEdit.overrides":"overrides {source}","projectEdit.prioritiesHint":"The priority scale for this project","projectEdit.projectColor":"Project color","projectEdit.pullForward":"Pull forward on early finish","projectEdit.showField":"Show on this project","projectEdit.statusesHint":"The workflow for this project","projectEdit.subtreeConnections":"Subtree connections in table","projectEdit.thisProject":"This project","projectEdit.useGlobal":"Use global","projectEdit.vaultSettings":"vault settings","projectFilter.complete":"Complete","projectFilter.inProgress":"In progress","projectFilter.noTags":"Add a tags property to a project note to filter by it.","projectFilter.notStarted":"Not started","projectRow.overdue.one":"{count} overdue","projectRow.overdue.other":"{count} overdue","projectView.addMilestone":"Add milestone","projectView.addTask":"Add task","projectView.missing":"No project here. It may have been deleted or renamed.","projectView.nothingToShow":"Nothing to show","property.add":"Add property","property.create":\'Create "{name}"\',"property.iconsShowing":"Showing {shown} of {total}. Keep typing to narrow.","property.noIcon":"No icon","property.noIconMatch":"No icon matches that.","property.searchIcons":"Search icons or paste an emoji","property.setValue":"Set value","property.useGlyph":"Use {glyph}","releaseNotes.empty":"No release notes","releaseNotes.emptyBody":"Version {version} has no notes.","releaseNotes.fullChangelog":"Full changelog","releaseNotes.heading":"What\'s new in dotpm {version}","releaseNotes.title":"Release notes","ribbon.openProjects":"Project manager","scope.all":"All projects","scope.folder":"Folder: {folder}","scope.only":"Only {title}","scope.projectCount.one":"{count} project","scope.projectCount.other":"{count} projects","scope.subtree":"With sub-projects","scope.subtreeLabel":"{title} and sub-projects","scope.vault":"Vault","scope.vaultFolder":"Vault folder","settings.archive.heading":"Archive","settings.atLeastOnePriority":"You must have at least one priority.","settings.atLeastOneStatus":"You must have at least one status.","settings.autoArchiveDays.desc":"Move completed tasks to the project\'s archive after this many days. Set it to 0 to keep them in place.","settings.autoArchiveDays.name":"Auto-archive completed tasks","settings.autoSchedule.desc":"Adjust dependent task dates when a task changes.","settings.autoSchedule.name":"Auto-schedule","settings.changeCount.one":"{count} change","settings.changeCount.other":"{count} changes","settings.customFields.add":"Add custom field","settings.customFields.desc":"Manage the extra task properties available across all projects.","settings.customFields.empty":"No custom fields.","settings.customFields.name":"Custom fields","settings.customFields.newLabel":"New field","settings.dateFormat.desc":"Set how dates are written, using tokens such as YYYY, MM, DD, MMM and ddd. Leave it empty to follow the interface language.","settings.dateFormat.name":"Date format","settings.defaultView.desc":"Choose the view a project\'s tasks open in.","settings.defaultView.name":"Default tasks view","settings.excludedFolders.add":"Add folder","settings.excludedFolders.desc":"Manage the folders to skip when looking for projects and tasks, such as templates.","settings.excludedFolders.empty":"No folders excluded.","settings.excludedFolders.name":"Excluded folders","settings.excludedFolders.placeholder":"Templates","settings.excludedFolders.unnamed":"Unnamed folder","settings.fieldCount.one":"{count} field","settings.fieldCount.other":"{count} fields","settings.folderCount.one":"{count} folder","settings.folderCount.other":"{count} folders","settings.gantt.heading":"Timeline","settings.ganttGranularity.desc":"Choose the time unit for each column in the timeline.","settings.ganttGranularity.name":"Default granularity","settings.ganttWeekLabel.both":"Both (w15: Apr 7 \\u2013 13)","settings.ganttWeekLabel.dateRange":"Date range (Apr 7 \\u2013 13)","settings.ganttWeekLabel.desc":"Choose the text shown in weekly header cells.","settings.ganttWeekLabel.name":"Week label","settings.ganttWeekLabel.weekNumber":"Week number (w15)","settings.general.heading":"General","settings.integrations.heading":"Integrations","settings.lineBorders.both":"Both","settings.lineBorders.desc":"Draw rules between rows, between columns, or both.","settings.lineBorders.horizontal":"Horizontal","settings.lineBorders.name":"Line borders","settings.lineBorders.none":"None","settings.lineBorders.vertical":"Vertical","settings.localApi.heading":"Local API","settings.localApiEnabled.desc":"Allow tools on this computer to read and edit tasks over HTTP and MCP at http://127.0.0.1:{port}. Only this computer can connect, and every request needs the token. The MCP endpoint is /mcp.","settings.localApiEnabled.name":"Serve projects to other apps","settings.localApiPort.desc":"Set the port the server listens on. The default comes from the vault name, so two open vaults use different ports.","settings.localApiPort.invalid":"Use a port from 1024 to 65535.","settings.localApiPort.name":"Port","settings.localApiToken.desc":"Set the bearer token clients send with every request.","settings.localApiToken.invalid":"Use at least 16 characters.","settings.localApiToken.name":"Token","settings.notificationLeadDays.desc":"Notify this many days before a task is due.","settings.notificationLeadDays.name":"Days in advance","settings.notifications.heading":"Notifications","settings.notificationsEnabled.desc":"Show a banner when a task is approaching its due date.","settings.notificationsEnabled.name":"Due date reminders","settings.peopleFolder.desc":"Find and create person notes in this folder. Leave it empty to search the whole vault.","settings.peopleFolder.name":"People folder","settings.peopleFolder.placeholder":"Whole vault","settings.personCount.one":"{count} person","settings.personCount.other":"{count} people","settings.priorities.add":"Add priority","settings.priorities.desc":"Manage the labels, colors, and icons of task priorities.","settings.priorities.empty":"No priorities.","settings.priorities.name":"Priorities","settings.priorities.newLabel":"New priority","settings.priorityCount.one":"{count} priority","settings.priorityCount.other":"{count} priorities","settings.priorityIcons.desc":"Choose the icons for priorities that have no icon of their own.","settings.priorityIcons.name":"Priority icons","settings.projectSurface.desc":\'Choose where a project opens. Select "Tasks" to skip the overview page and open the table, timeline, or board.\',"settings.projectSurface.name":"Open projects in","settings.projectSurface.overview":"Overview","settings.projectSurface.tasks":"Tasks","settings.projectsFolder.desc":"Create new projects in this folder. Leave it empty to use the vault root.","settings.projectsFolder.name":"New project folder","settings.projectsFolder.placeholder":"Vault root","settings.pullForward.desc":"Move dependent tasks earlier when a task is completed before its due date.","settings.pullForward.name":"Pull dependents forward","settings.regenerateToken.desc":"Replace the token with a new random one. Every connected client will need the new one.","settings.regenerateToken.name":"Regenerate token","settings.remappedTasks.one":"Remapped {count} task from \'{from}\' to \'{to}\'.","settings.remappedTasks.other":"Remapped {count} tasks from \'{from}\' to \'{to}\'.","settings.saveShortcut.desc":"Choose the shortcut that creates or saves tasks and projects.","settings.saveShortcut.name":"Save shortcut","settings.saveTaskOnClose.desc":"Save changes when the task editor is closed.","settings.saveTaskOnClose.name":"Save tasks on close","settings.scheduling.heading":"Scheduling","settings.showReleaseNotes.desc":"Open a tab with the release notes after the plugin updates.","settings.showReleaseNotes.name":"Show release notes after updates","settings.showSubtreeConnections.desc":"Draw lines tying a subtask row back to its parent.","settings.showSubtreeConnections.name":"Show subtree connections","settings.showTagColors.desc":"Give each tag a colored dot derived from its name.","settings.showTagColors.name":"Show tag colors","settings.statusCount.one":"{count} status","settings.statusCount.other":"{count} statuses","settings.statuses.add":"Add status","settings.statuses.desc":"Manage the labels, colors, and icons of task statuses.","settings.statuses.empty":"No statuses.","settings.statuses.name":"Statuses","settings.statuses.newLabel":"New status","settings.style.heading":"Style","settings.table.heading":"Table","settings.taskEditorSurface.desc":`Choose where tasks open. Select "Tab" to also open task notes in the task editor instead of Obsidian\'s editor.`,"settings.taskEditorSurface.modal":"Modal","settings.taskEditorSurface.name":"Open tasks in","settings.taskEditorSurface.tab":"Tab","settings.taskFields.heading":"Task fields","settings.taskNotes.alreadyMatch":"Statuses and priorities already match TaskNotes.","settings.taskNotes.desc":"Share statuses and priorities with the TaskNotes plugin.","settings.taskNotes.import":"Import from TaskNotes","settings.taskNotes.imported":"Imported from TaskNotes: {added} added, {updated} updated.","settings.taskNotes.name":"TaskNotes","settings.taskNotes.palettes.desc":"Copy labels, colors, and completion from TaskNotes 4.10 or newer.","settings.taskNotes.palettes.name":"Statuses and priorities","settings.taskNotes.required":"TaskNotes 4.10 or newer is required.","settings.taskNotes.upToDate":"Up to date","settings.taskNotes.updateRequired":"Update required","settings.teamMembers.desc":"Manage the people available as assignees across all projects.","settings.teamMembers.name":"Team members","settings.teamMembersList.desc":"Offer these people as assignees and members in every project.","settings.teamMembersList.name":"Team members","sort.az":"A to Z","sort.earliest":"Earliest first","sort.firstNamed":"{label} first","sort.highest":"Highest first","sort.latest":"Latest first","sort.lowest":"Lowest first","sort.za":"Z to A","status.blocked":"Blocked","status.cancelled":"Cancelled","status.done":"Done","status.inProgress":"In Progress","status.review":"In Review","status.todo":"To Do","store.loadFailed":\'dotpm: Failed to load "{file}". Check console for details.\',"store.loadTaskFailed":\'dotpm: Failed to load task "{file}". Check console for details.\',"store.notSavedUnreadable":\'dotpm: "{title}" was not saved because a note could not be read.\',"store.noteExists":\'A note named "{file}" already exists.\',"store.projectExists":\'A project named "{title}" already exists here.\',"store.saveFailed":\'dotpm: Failed to save "{title}". Check console for details.\',"store.unreadableNote":\'Could not read the properties of "{file}".\',"subtasks.addPlaceholder":"Add subtask\\u2026","subtasks.done":"Done: {title}","subtasks.heading":"Subtasks","subtasks.remove":"Remove subtask","table.archivedTasks.one":"Archived {count} task","table.archivedTasks.other":"Archived {count} tasks","table.deleteTasksConfirm.one":"Delete {count} task? This cannot be undone.","table.deleteTasksConfirm.other":"Delete {count} tasks? This cannot be undone.","table.movedTasksToTopLevel.one":"Moved {count} task to top level","table.movedTasksToTopLevel.other":"Moved {count} tasks to top level","table.movedTasksUnderParent.one":"Moved {count} task under new parent","table.movedTasksUnderParent.other":"Moved {count} tasks under new parent","table.resizeColumn":"Resize column","table.unarchivedTasks.one":"Unarchived {count} task","table.unarchivedTasks.other":"Unarchived {count} tasks","task.add":"Add task","task.archived":"Task archived","task.deleteConfirm":\'Delete "{title}"?\',"task.newTitle":"New Task","task.unarchived":"Task unarchived","taskEditor.attachmentFailed":"Failed to save attachment","taskEditor.copiedId":"Copied task ID","taskEditor.copiedPath":"Copied file path","taskEditor.copyId":"Copy task ID","taskEditor.copyPath":"Copy file path","taskEditor.create":"Create ({shortcut})","taskEditor.descriptionPlaceholder":"Add a description\\u2026","taskEditor.moreActions":"More actions","taskEditor.notSavedConflict":\'Task not saved: a note named "{name}" already exists.\',"taskEditor.openAsNote":"Open as note","taskEditor.openInTab":"Open in tab","taskEditor.save":"Save ({shortcut})","taskEditor.titleConflict":\'A note named "{name}" already exists. Choose a different title.\',"taskEditor.titlePlaceholder":"Task title","taskForm.addDependency":"Add dependency","taskForm.addTags":"Add tags","taskForm.assign":"Assign","taskForm.assignees":"Assignees","taskForm.blocks":"Blocks","taskForm.completed":"Completed","taskForm.date":"Date","taskForm.dependsOn":"Depends on","taskForm.due":"Due","taskForm.findOrCreate":"Find or create\\u2026","taskForm.inProject":"In {title}","taskForm.parentTask":"Parent task","taskForm.priority":"Priority","taskForm.progress":"Progress","taskForm.removeDependency":"Remove dependency","taskForm.repeat":"Repeat","taskForm.repeatDaily":"Daily","taskForm.repeatMonthly":"Monthly","taskForm.repeatNone":"Does not repeat","taskForm.repeatWeekly":"Weekly","taskForm.repeatYearly":"Yearly","taskForm.searchTasks":"Search tasks\\u2026","taskForm.selectParent":"Select parent","taskForm.setDate":"Set date","taskForm.setDueDate":"Set due date","taskForm.setStart":"Set start","taskForm.start":"Start","taskForm.status":"Status","taskForm.tags":"Tags","taskForm.type":"Type","taskForm.typeMilestone":"Milestone","taskForm.typeSubtask":"Subtask","taskForm.typeTask":"Task","taskMenu.addSubtask":"Add subtask","taskMenu.delete":"Delete task","taskMenu.duplicate":"Duplicate task","taskMenu.edit":"Edit task","taskMenu.moveToProject":"Move to project","taskMenu.moved":\'Moved "{title}" to {project}\',"taskMenu.noOtherProject":"There is no other project to move this task to.","taskView.missingTitle":"No task here","taskView.newTask":"New task","taskView.notInProject":"This note does not belong to a project.","taskView.notTask":"This note is not a task in {project}.","time.estimate":"Estimate:","time.heading":"Time tracking ({logged}h / {estimate}h)","time.headingLogged":"Time tracking ({logged}h logged)","time.hours":"Hours","time.logTime":"Log time","time.logged":"{hours}h","time.loggedOfEstimate":"{logged}/{estimate}h","time.notePlaceholder":"Note\\u2026","time.removeLog":"Remove log","timeline.addHoliday":"Add day","timeline.hideHolidays":"Hide holidays","timeline.hideWeekends":"Hide weekends","timeline.holidaysNote":"Holidays are kept in plugin settings for the whole vault.","timeline.nonWorkingDays":"Non-working days","timeline.removeHoliday":"Remove holiday","timeline.resetZoom":"Reset zoom","timeline.zoom":"Zoom","timeline.zoomIn":"Zoom in","timeline.zoomOut":"Zoom out","viewer.meta":"{tasks} \\xB7 exported {date} {time}","viewer.noSnapshot":"This page holds no readable snapshot.","views.gantt":"Timeline","views.kanban":"Board","views.overview":"Overview","views.table":"Table"};var Up={};var Zp={};var Yp={};var zp={};var Kp={};var Xp={};var Jp={};var Qp={};var ef={};var tf={};var nf={};var il={bn:$p,de:qp,en:sn,es:Up,fr:Zp,it:Yp,ja:zp,ko:Kp,pl:Xp,"pt-BR":Jp,ro:Qp,ru:ef,sv:tf,zh:nf},Og=sn,sl="en",li=sn,rf=new Intl.PluralRules("en");function of(e){let t;try{t=new Intl.PluralRules(e)}catch{e="en",t=new Intl.PluralRules(e)}sl=e,rf=t,li=il[e]??il[e.split("-")[0]]??sn}function Y(){return sl}function sf(e,t){return t?e.replace(/\\{(\\w+)\\}/g,(n,r)=>{let o=t[r];return o===void 0?n:typeof o=="number"?o.toLocaleString(sl):o}):e}function m(e,t){return sf(li[e]??sn[e],t)}function zn(e,t,n){let r=`${e}.${rf.select(t)}`,o=`${e}.other`,i=li[r]??li[o]??Og[r]??sn[o];return sf(i,{count:t,...n})}function we(){return W.Now.plainDateISO()}function B(e){if(!e)return null;try{return W.PlainDate.from(e)}catch{return null}}var al="";function lf(e){al=e.trim()}var ci=(e,t)=>String(e).padStart(t,"0"),jg={YYYY:e=>ci(e.year,4),YY:e=>ci(e.year%100,2),MMMM:e=>e.toLocaleString(Y(),{month:"long"}),MMM:e=>e.toLocaleString(Y(),{month:"short"}),MM:e=>ci(e.month,2),M:e=>String(e.month),DD:e=>ci(e.day,2),D:e=>String(e.day),dddd:e=>e.toLocaleString(Y(),{weekday:"long"}),ddd:e=>e.toLocaleString(Y(),{weekday:"short"})},Rg=/\\[([^\\]]*)\\]|YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd/g;function cf(e,t){let n=B(e);return n?al?al.replace(Rg,(r,o)=>o??jg[r](n)):n.toLocaleString(Y(),t):""}function ui(e){return cf(e,{month:"short",day:"numeric"})}function an(e){return cf(e,{month:"short",day:"numeric",year:"2-digit"})}function uf(e,t){return new Intl.DateTimeFormat(Y(),{month:"short",day:"numeric",timeZone:"UTC"}).formatRange(af(e),af(t))}function af(e){return new Date(Date.UTC(e.year,e.month-1,e.day))}var ll=["title","status","priority","due","assignees","progress"],cl=3,df=["any","none","all","empty","not-empty","contains","not-contains","eq","ne","gte","lte","between","bucket","checked","unchecked"];var ul={chevrons:["chevrons-up","chevron-up","equal","chevron-down","chevrons-down"],signal:["signal","signal-high","signal-medium","signal-low","signal-zero"],arrows:["arrow-up","arrow-up-right","arrow-right","arrow-down-right","arrow-down"],alerts:["octagon-alert","triangle-alert","circle-alert","info","circle-small"],none:[]};var Ng=[{id:"todo",label:"To Do",color:"#8a94a0",icon:"",complete:!1},{id:"in-progress",label:"In Progress",color:"#8b72be",icon:"",complete:!1},{id:"blocked",label:"Blocked",color:"#c47070",icon:"",complete:!1},{id:"review",label:"In Review",color:"#b8a06b",icon:"",complete:!1},{id:"done",label:"Done",color:"#79b58d",icon:"",complete:!0},{id:"cancelled",label:"Cancelled",color:"#767491",icon:"",complete:!0}],_g=[{id:"critical",label:"Critical",color:"#c47070",icon:""},{id:"high",label:"High",color:"#b8a06b",icon:""},{id:"medium",label:"Medium",color:"#8a94a0",icon:""},{id:"low",label:"Low",color:"#79b58d",icon:""}];var pf=27140;var pk={projectsFolder:"Projects",peopleFolder:"People",excludedFolders:[],defaultView:"table",ganttGranularity:"week",ganttWeekLabel:"weekNumber",holidays:[],statuses:Ng,priorities:_g,priorityIcons:"chevrons",customFields:[],globalTeamMembers:[],showSubtreeConnections:!0,lineBorders:"none",showTagColors:!0,dateFormat:"",notificationsEnabled:!0,notificationLeadDays:2,autoArchiveDays:0,lastAutoArchiveDate:"",autoSchedule:!0,pullForwardOnEarlyFinish:!1,saveTaskOnClose:!0,taskEditorSurface:"modal",editorSaveModifier:"Shift",projectSurface:"overview",projectFilters:{},defaultFields:{},scopeViews:{},collapsedTasks:{},collapsedProjects:[],showArchivedProjects:!1,projectList:Hg(),projectListViews:[],localApiEnabled:!1,localApiPort:pf,localApiToken:"",showReleaseNotes:!0,lastSeenVersion:""};function dl(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36)}function pl(e={}){let t=new Date().toISOString();return{id:dl(),title:m("task.newTitle"),description:"",type:"task",status:"todo",priority:"medium",start:we().toString(),due:"",progress:0,completed:"",assignees:[],tags:[],subtasks:[],dependencies:[],customFields:{},createdAt:t,updatedAt:t,...e}}var fl=/^#[0-9a-fA-F]{6}$/;function Hg(){return{filter:{},sort:[],group:"none",activeViewId:null}}function di(){return{field:"status"}}function ff(){return[{key:"status",dir:"asc"}]}function z(e){let t=typeof e=="string"?e.trim():"",n=t.match(/^\\[\\[([^\\]]+)\\]\\]$/);if(!n)return t;let r=n[1],o=r.indexOf("|");if(o>=0){let c=r.slice(o+1).trim();if(c)return c}let i=o>=0?r.slice(0,o):r,s=i.indexOf("#"),a=s<0?i:i.slice(0,s),l=a.split("/").pop()??a;return(l.endsWith(".md")?l.slice(0,-3):l).trim()}function pi(e){let t=0;for(let n=0;n<e.length;n++)t=e.charCodeAt(n)+((t<<5)-t);return`hsl(${Math.abs(t)%360}, 55%, 45%)`}function ln(e,t){let n=t.find(r=>r.id===e);return n?n.complete:!1}function ml(e,t){let n=t.findIndex(r=>r.id===e);return n>=0?n:999}function Bg(e,t){let n=B(e);if(!n)return"normal";let r=we().until(n,{largestUnit:"day"}).days;return r<0?t?"overdue":"normal":r<3?"near":"normal"}function fi(e,t){return ln(e.status,t)?"normal":Bg(e.due,!0)}function et(e){return e==null?"":typeof e=="string"?e:typeof e=="number"||typeof e=="boolean"?String(e):Array.isArray(e)?e.map(t=>String(t)).join(", "):""}function Ve(e,t){return e.find(n=>n.id===t)}function ht(e,t){return e.find(n=>n.id===t)}function eo(e,t,n){let r=ht(e,t)?.icon;if(r)return r;let o=e.findIndex(i=>i.id===t);return ul[n][o]??""}function de(e,t){let n=[],r=(o,i,s,a)=>{for(let l of o)n.push({task:l,depth:i,parentId:s,visible:!a}),l.subtasks.length>0&&r(l.subtasks,i+1,l.id,a||t?.has(l.id)===!0)};return r(e,0,null,!1),n}function mi(e){return e.timeLogs?.length?e.timeLogs.reduce((t,n)=>t+n.hours,0):0}var mf=["status","priority","assignee","tag","due","start","type","project","title"],Vg={status:"list",priority:"list",assignee:"multi",tag:"multi",due:"date",start:"date",type:"list",project:"list",title:"text"},hf={text:"text",url:"text",number:"number",date:"date",select:"list",multiselect:"multi",person:"multi",checkbox:"checkbox"},hl="cf:";function gf(e){return hl+e}function Gg(e){return mf.includes(e)}function hi(e,t){if(!e.startsWith(hl))return;let n=e.slice(hl.length);return t.find(r=>r.id===n)}function to(e,t){if(Gg(e))return Vg[e];let n=hi(e,t);return n?hf[n.type]:null}function gi(e,t){let n=hi(e,t);if(n)return n.name;switch(e){case"status":return m("taskForm.status");case"priority":return m("taskForm.priority");case"assignee":return m("filter.assignee");case"tag":return m("filter.tag");case"due":return m("filter.dueDate");case"start":return m("filter.startDate");case"type":return m("filter.type");case"project":return m("common.project");case"title":return m("filter.title");default:return e}}function Kn(e,t,n){switch(t){case"status":return e.status;case"priority":return e.priority;case"assignee":return e.assignees;case"tag":return e.tags;case"due":return e.due;case"start":return e.start;case"type":return e.type;case"project":return n.projectOf?.(e)??"";case"title":return e.title}let r=hi(t,n.customFields);if(!r)return null;let o=e.customFields[r.id];switch(hf[r.type]){case"multi":return(Array.isArray(o)?o:[o]).map(i=>et(i)).filter(Boolean);case"number":{let i=typeof o=="number"?o:typeof o=="string"&&o.trim()?Number(o):NaN;return Number.isFinite(i)?i:null}case"checkbox":return o===!0||o==="true";default:return et(o)}}function jt(e,t,n){return e==="assignee"||hi(e,n.customFields)?.type==="person"?(n.keyOf??z)(t):t}function vf(e){return e.text.trim().length>0||e.filter.conditions.length>0}function yi(e,t,n){return e.archived&&!t.filter.showArchived||!t.filter.conditions.every(r=>$g(e,r,n))?!1:Wg(e,t.text,n)}function Wg(e,t,n){let r=t.trim().toLowerCase();return!r||e.id.toLowerCase()===r||e.title.toLowerCase().includes(r)||e.tags.some(o=>o.toLowerCase().includes(r))||e.assignees.some(o=>o.toLowerCase().includes(r)||z(o).toLowerCase().includes(r))?!0:n.customFields.some(o=>et(e.customFields[o.id]).toLowerCase().includes(r))}function $g(e,t,n){let r=to(t.field,n.customFields);if(!r)return!0;let o=Kn(e,t.field,n),{op:i}=t;switch(r){case"list":case"multi":{let s=(Array.isArray(o)?o:o?[String(o)]:[]).map(l=>jt(t.field,l,n));if(i==="empty")return s.length===0;if(i==="not-empty")return s.length>0;let a=yf(t).map(l=>jt(t.field,l,n));return a.length?i==="none"?!s.some(l=>a.includes(l)):i==="all"?a.every(l=>s.includes(l)):s.some(l=>a.includes(l)):!0}case"text":{let s=typeof o=="string"?o:"";if(i==="empty")return!s.trim();if(i==="not-empty")return!!s.trim();let a=typeof t.value=="string"?t.value.trim().toLowerCase():"";if(!a)return!0;let l=s.toLowerCase().includes(a);return i==="not-contains"?!l:l}case"number":{let s=typeof o=="number"?o:null;if(i==="empty")return s===null;let[a,l]=qg(t);return i==="between"?a===void 0&&l===void 0?!0:Ug(s,a,l):a===void 0?!0:i==="ne"?s!==a:s===null?!1:i==="gte"?s>=a:i==="lte"?s<=a:s===a}case"date":{let s=typeof o=="string"?o:"";if(i==="empty")return!s;if(i==="not-empty")return!!s;if(i==="between")return Zg(s,yf(t));let a=typeof t.value=="string"?t.value:null;return a?Yg(e,s,a,n.statuses):!0}case"checkbox":return i==="unchecked"?o!==!0:o===!0}}function yf(e){return Array.isArray(e.value)?e.value.map(String):[]}function qg(e){return Array.isArray(e.value)?e.value.map(t=>typeof t=="number"&&Number.isFinite(t)?t:void 0):[]}function Ug(e,t,n){return e===null?!1:(t===void 0||e>=t)&&(n===void 0||e<=n)}function Zg(e,[t,n]){return!t&&!n?!0:e?(!t||e>=t)&&(!n||e<=n):!1}function Yg(e,t,n,r){let o=B(t);if(!o)return!1;let i=we(),s=W.PlainDate.compare(o,i);switch(n){case"overdue":return s<0&&!ln(e.status,r);case"today":return s===0;case"this-week":{let a=i.add({days:7-i.dayOfWeek%7});return s>=0&&W.PlainDate.compare(o,a)<=0}case"this-month":return o.year===i.year&&o.month===i.month&&s>=0}}function gl(e,t,n){let r=[];for(let o of e){let i=o.subtasks.length?gl(o.subtasks,t,n):[];yi(o,t,n)?r.push({...o,subtasks:i}):r.push(...i)}return r}function bf(e,t,n){return e.filter(({task:r})=>yi(r,t,n))}var kf={table:["title","project","status","priority","assignees","due","progress","time"],kanban:["priority","description","time","tags","progress","project","assignees","due","subtasks"],gantt:["title","assignees","progress","dates","status","priority"]},wf={table:new Set,kanban:new Set(["description","subtasks"]),gantt:new Set(["assignees","progress","dates","status","priority"])},zg={table:!0,kanban:!1,gantt:!1},Kg={project:130,status:130,priority:110,assignees:140,due:110,progress:120,time:90},Xg=120;function yl(e,t){return[...kf[e].filter(r=>r!=="project"||t.multi),...t.customFields.map(r=>`cf:${r.id}`)]}function Jg(e,t){return yl(e,t).filter(n=>n.startsWith("cf:")?zg[e]:!wf[e].has(n))}function Tf(e,t){return t==="title"&&e!=="kanban"}function cn(e,t,n){let r=yl(t,n),o=e[t]?.visible,i=o?o.filter(a=>r.includes(a)):Jg(t,n),s=r.filter(a=>Tf(t,a));return[...s,...i.filter(a=>!s.includes(a))]}function vl(e,t){if(t!=="title")return e.table?.widths?.[t]??Kg[t]??Xg}function xf(e,t){return!e&&!t?{}:{kanban:{visible:kf.kanban.filter(r=>!wf.kanban.has(r)||r==="subtasks"&&e||r==="description"&&t)}}}function bl(e,t){if(e.startsWith("cf:"))return t.find(n=>`cf:${n.id}`===e)?.name??e.slice(3);switch(e){case"title":return m("columns.task");case"project":return m("columns.project");case"status":return m("columns.status");case"priority":return m("columns.priority");case"assignees":return m("columns.assignees");case"due":return m("columns.due");case"progress":return m("columns.progress");case"time":return m("columns.time");case"tags":return m("taskForm.tags");case"description":return m("fields.description");case"subtasks":return m("fields.subtasks");case"dates":return m("fields.dates");default:return e}}function vi(e){let t=[],n=new Map;for(let r of e)for(let o of r){let i=n.get(o.id);i===void 0?(n.set(o.id,t.length),t.push(o)):t[i]=o}return t}function Ef(e){if(!Array.isArray(e))return[];let t=[];for(let n of e)typeof n=="string"?n.trim()&&t.push(n):typeof n=="number"&&Number.isFinite(n)&&t.push(String(n));return t}var ry=["overdue","today","this-week","this-month"];function oy(e,t){if(typeof e=="string")return e;if(!Array.isArray(e))return;let n=r=>typeof r=="number"&&Number.isFinite(r);return e.some(n)&&e.every(r=>n(r)||t==="between"&&r===null)?e:t==="between"?e.map(r=>typeof r=="string"?r:""):Ef(e)}function Cf(e){let t=e&&typeof e=="object"?e:{},n={conditions:[],showArchived:t.showArchived===!0};if(Array.isArray(t.conditions)){for(let i of t.conditions){if(!i||typeof i!="object")continue;let s=i;if(typeof s.field!="string"||!s.field)continue;let a=df.find(c=>c===s.op);if(!a)continue;let l=oy(s.value,a);n.conditions.push(l===void 0?{field:s.field,op:a}:{field:s.field,op:a,value:l})}return n}let r=[["statuses","status"],["priorities","priority"],["assignees","assignee"],["tags","tag"]];for(let[i,s]of r){let a=Ef(t[i]);a.length&&n.conditions.push({field:s,op:"any",value:a})}t.dueDateFilter==="no-date"&&n.conditions.push({field:"due",op:"empty"});let o=ry.find(i=>i===t.dueDateFilter);return o&&n.conditions.push({field:"due",op:"bucket",value:o}),typeof t.text=="string"&&t.text.trim()&&n.conditions.push({field:"title",op:"contains",value:t.text.trim()}),n}function Sf(e){if(Array.isArray(e.sort)){let n=[];for(let r of e.sort){if(!r||typeof r!="object")continue;let o=r,i=ll.find(s=>s===o.key);!i||n.some(s=>s.key===i)||n.push({key:i,dir:o.dir==="desc"?"desc":"asc"})}return n.slice(0,cl)}let t=ll.find(n=>n===e.sortKey);return t?[{key:t,dir:e.sortDir==="desc"?"desc":"asc"}]:ff()}function Df(e){let t=e&&typeof e=="object"?e:{},n=typeof t.field=="string"&&t.field?{field:t.field}:di();if(t.hideEmpty===!0&&(n.hideEmpty=!0),t.columns&&typeof t.columns=="object"){let r={};for(let[o,i]of Object.entries(t.columns)){if(!i||typeof i!="object")continue;let s=i,a={};Array.isArray(s.order)&&(a.order=s.order.filter(l=>typeof l=="string")),Array.isArray(s.hidden)&&(a.hidden=s.hidden.filter(l=>typeof l=="string")),(a.order||a.hidden)&&(r[o]=a)}Object.keys(r).length&&(n.columns=r)}return n}var iy=["table","gantt","kanban"];function Pf(e){let t=e&&typeof e=="object"?e:{},n={};for(let r of iy){let o=t[r];if(!o||typeof o!="object")continue;let i=o;if(!Array.isArray(i.visible))continue;let s={visible:i.visible.filter(a=>typeof a=="string")};if(i.widths&&typeof i.widths=="object"){let a=Object.entries(i.widths).filter(l=>typeof l[1]=="number"&&Number.isFinite(l[1])&&l[1]>0);a.length&&(s.widths=Object.fromEntries(a.map(([l,c])=>[l,Math.round(c)])))}n[r]=s}return n}function Mf(e){let t=e&&typeof e=="object"?e:{},n={};return t.weekends===!0&&(n.weekends=!0),t.holidays===!0&&(n.holidays=!0),n}var bi,sy={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0};function ay(e){return!e&&!bi?sy:{lang:e?.lang??bi?.lang,message:e?.message,abortEarly:e?.abortEarly??bi?.abortEarly,abortPipeEarly:e?.abortPipeEarly??bi?.abortPipeEarly}}var ly;function cy(e){return ly?.get(e)}var uy;function dy(e){return uy?.get(e)}var py;function fy(e,t){return py?.get(e)?.get(t)}function Xn(e){let t=typeof e;return t==="string"?`"${e}"`:t==="number"||t==="bigint"||t==="boolean"?`${e}`:t==="object"||t==="function"?(e&&Object.getPrototypeOf(e)?.constructor?.name)??"null":t}function Te(e,t,n,r,o){let i=o&&"input"in o?o.input:n.value,s=o?.expected??e.expects??null,a=o?.received??Xn(i),l={kind:e.kind,type:e.type,input:i,expected:s,received:a,message:`Invalid ${t}: ${s?`Expected ${s} but r`:"R"}eceived ${a}`,requirement:e.requirement,path:o?.path,issues:o?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},c=e.kind==="schema",u=o?.message??e.message??fy(e.reference,l.lang)??(c?dy(l.lang):null)??r.message??cy(l.lang);u!==void 0&&(l.message=typeof u=="function"?u(l):u),c&&(n.typed=!1),n.issues?n.issues.push(l):n.issues=[l]}function my(e,t){return Object.prototype.hasOwnProperty.call(e,t)&&t!=="__proto__"&&t!=="prototype"&&t!=="constructor"}function hy(e,t){let n=[...new Set(e)];return n.length>1?`(${n.join(` ${t} `)})`:n[0]??"never"}function Ge(e){return e["~standard"]={version:1,vendor:"valibot",validate:t=>e["~run"]({value:t},ay())},e}function gt(e,t){return{kind:"validation",type:"check",reference:gt,async:!1,expects:null,requirement:e,message:t,"~run"(n,r){return n.typed&&!this.requirement(n.value)&&Te(this,"input",n,r),n}}}function tt(e){return{kind:"metadata",type:"description",reference:tt,description:e}}function no(e){return{kind:"validation",type:"integer",reference:no,async:!1,expects:null,requirement:Number.isInteger,message:e,"~run"(t,n){return t.typed&&!this.requirement(t.value)&&Te(this,"integer",t,n),t}}}function kl(e,t){return{kind:"validation",type:"max_value",reference:kl,async:!1,expects:`<=${e instanceof Date?e.toJSON():Xn(e)}`,requirement:e,message:t,"~run"(n,r){return n.typed&&!(n.value<=this.requirement)&&Te(this,"value",n,r,{received:n.value instanceof Date?n.value.toJSON():Xn(n.value)}),n}}}function ro(e,t){return{kind:"validation",type:"min_value",reference:ro,async:!1,expects:`>=${e instanceof Date?e.toJSON():Xn(e)}`,requirement:e,message:t,"~run"(n,r){return n.typed&&!(n.value>=this.requirement)&&Te(this,"value",n,r,{received:n.value instanceof Date?n.value.toJSON():Xn(n.value)}),n}}}function wl(e,t){return{kind:"validation",type:"regex",reference:wl,async:!1,expects:`${e}`,requirement:e,message:t,"~run"(n,r){return n.typed&&!this.requirement.test(n.value)&&Te(this,"format",n,r),n}}}function gy(e,t,n){return typeof e.fallback=="function"?e.fallback(t,n):e.fallback}function Tl(e,t,n){return typeof e.default=="function"?e.default(t,n):e.default}function xl(e,t){return Ge({kind:"schema",type:"array",reference:xl,expects:"Array",async:!1,item:e,message:t,"~run"(n,r){let o=n.value;if(Array.isArray(o)){n.typed=!0,n.value=[];for(let i=0;i<o.length;i++){let s=o[i],a=this.item["~run"]({value:s},r);if(a.issues){let l={type:"array",origin:"value",input:o,key:i,value:s};for(let c of a.issues)c.path?c.path.unshift(l):c.path=[l],n.issues?.push(c);if(n.issues||(n.issues=a.issues),r.abortEarly){n.typed=!1;break}}a.typed||(n.typed=!1),n.value.push(a.value)}}else Te(this,"type",n,r);return n}})}function ki(e){return Ge({kind:"schema",type:"boolean",reference:ki,expects:"boolean",async:!1,message:e,"~run"(t,n){return typeof t.value=="boolean"?t.typed=!0:Te(this,"type",t,n),t}})}function un(e,t){return Ge({kind:"schema",type:"nullable",reference:un,expects:`(${e.expects} | null)`,async:!1,wrapped:e,default:t,"~run"(n,r){return n.value===null&&(this.default!==void 0&&(n.value=Tl(this,n,r)),n.value===null)?(n.typed=!0,n):this.wrapped["~run"](n,r)}})}function Jn(e){return Ge({kind:"schema",type:"number",reference:Jn,expects:"number",async:!1,message:e,"~run"(t,n){return typeof t.value=="number"&&!isNaN(t.value)?t.typed=!0:Te(this,"type",t,n),t}})}function yt(e,t){return Ge({kind:"schema",type:"object",reference:yt,expects:"Object",async:!1,entries:e,message:t,"~run"(n,r){let o=n.value;if(o&&typeof o=="object"){n.typed=!0,n.value={};for(let i in this.entries){let s=this.entries[i];if(i in o||(s.type==="exact_optional"||s.type==="optional"||s.type==="nullish")&&s.default!==void 0){let a=i in o?o[i]:Tl(s),l=s["~run"]({value:a},r);if(l.issues){let c={type:"object",origin:"value",input:o,key:i,value:a};for(let u of l.issues)u.path?u.path.unshift(c):u.path=[c],n.issues?.push(u);if(n.issues||(n.issues=l.issues),r.abortEarly){n.typed=!1;break}}l.typed||(n.typed=!1),n.value[i]=l.value}else if(s.fallback!==void 0)n.value[i]=gy(s);else if(s.type!=="exact_optional"&&s.type!=="optional"&&s.type!=="nullish"&&(Te(this,"key",n,r,{input:void 0,expected:`"${i}"`,path:[{type:"object",origin:"key",input:o,key:i,value:o[i]}]}),r.abortEarly))break}}else Te(this,"type",n,r);return n}})}function E(e,t){return Ge({kind:"schema",type:"optional",reference:E,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:t,"~run"(n,r){return n.value===void 0&&(this.default!==void 0&&(n.value=Tl(this,n,r)),n.value===void 0)?(n.typed=!0,n):this.wrapped["~run"](n,r)}})}function wi(e,t){return Ge({kind:"schema",type:"picklist",reference:wi,expects:hy(e.map(Xn),"|"),async:!1,options:e,message:t,"~run"(n,r){return this.options.includes(n.value)?n.typed=!0:Te(this,"type",n,r),n}})}function El(e,t,n){return Ge({kind:"schema",type:"record",reference:El,expects:"Object",async:!1,key:e,value:t,message:n,"~run"(r,o){let i=r.value;if(i&&typeof i=="object"){r.typed=!0,r.value={};for(let s in i)if(my(i,s)){let a=i[s],l=this.key["~run"]({value:s},o);if(l.issues){let u={type:"object",origin:"key",input:i,key:s,value:a};for(let d of l.issues)d.path=[u],r.issues?.push(d);if(r.issues||(r.issues=l.issues),o.abortEarly){r.typed=!1;break}}let c=this.value["~run"]({value:a},o);if(c.issues){let u={type:"object",origin:"value",input:i,key:s,value:a};for(let d of c.issues)d.path?d.path.unshift(u):d.path=[u],r.issues?.push(d);if(r.issues||(r.issues=c.issues),o.abortEarly){r.typed=!1;break}}(!l.typed||!c.typed)&&(r.typed=!1),l.typed&&(r.value[l.value]=c.value)}}else Te(this,"type",r,o);return r}})}function ie(e){return Ge({kind:"schema",type:"string",reference:ie,expects:"string",async:!1,message:e,"~run"(t,n){return typeof t.value=="string"?t.typed=!0:Te(this,"type",t,n),t}})}function Cl(){return Ge({kind:"schema",type:"unknown",reference:Cl,expects:"unknown",async:!1,"~run"(e){return e.typed=!0,e}})}function se(...e){return Ge({...e[0],pipe:e,"~run"(t,n){for(let r of e)if(r.kind!=="metadata"){if(t.issues&&(r.kind==="schema"||r.kind==="transformation")){t.typed=!1;break}(!t.issues||!n.abortEarly&&!n.abortPipeEarly)&&(t=r["~run"](t,n))}return t}})}var Ff=["task","milestone","subtask"],Lf=["daily","weekly","monthly","yearly"];function Qn(e,t=""){return n=>{let r=n.path?.[0]?.key;return typeof r=="string"?`${t}${r} is required`:e}}function yy(e){return e===""||/^\\d{4}-\\d{2}-\\d{2}$/.test(e)&&B(e)!==null}function We(e,t){return se(ie(`${e} must be a string`),tt(t))}function Sl(e){return se(ie(`${e} must be a string`),gt(yy,`${e} must be YYYY-MM-DD or empty`),tt("YYYY-MM-DD, or empty to clear"))}function Ti(e,t){let n=`${e} must be a list of strings`;return se(xl(ie(n),n),tt(t))}function Of(e,t,n){let r=`${e} must be an integer from ${t} to ${n}`;return se(Jn(r),no(r),ro(t,r),kl(n,r))}var vy=yt({interval:wi(Lf,`recurrence.interval must be one of ${Lf.join(", ")}`),every:se(Jn("recurrence.every must be a positive integer"),no("recurrence.every must be a positive integer"),ro(1,"recurrence.every must be a positive integer")),endDate:E(Sl("recurrence.endDate"))},Qn("recurrence must be an object or null","recurrence.")),Dl={title:E(se(ie("title must be a string"),gt(e=>e.trim()!=="","title must not be empty"))),description:E(We("description","Markdown body of the task note")),type:E(wi(Ff,`type must be one of ${Ff.join(", ")}`)),status:E(We("status","One of the project\'s status ids (see get_project)")),priority:E(We("priority","One of the project\'s priority ids (see get_project)")),start:E(Sl("start")),due:E(Sl("due")),progress:E(Of("progress",0,100)),assignees:E(Ti("assignees","Names or wikilinks of the people on the task")),tags:E(Ti("tags","Tags without the leading hash")),dependencies:E(Ti("dependencies","Ids of tasks this one waits for")),recurrence:E(un(vy)),timeEstimate:E(un(se(Jn("timeEstimate must be a non-negative number or null"),ro(0,"timeEstimate must be a non-negative number or null"),tt("Hours")))),customFields:E(El(ie(),Cl(),"customFields must be an object"))},jf={...Dl,title:se(ie("title must be a string"),gt(e=>e.trim()!=="","title must not be empty")),parentId:E(un(ie("parentId must be a string or null")),null)},Rf={parentId:E(un(ie("parentId must be a string or null"))),projectId:E(We("projectId","Move the task to this project")),before:E(We("before","Id of the sibling to sit in front of")),after:E(We("after","Id of the sibling to sit behind"))},Nf={query:E(We("query","Case-insensitive match on the title")),projectId:E(We("projectId","Only tasks of this project")),status:E(We("status","Only tasks with this status id")),assignee:E(We("assignee","Only tasks this person is on")),includeArchived:E(ki("includeArchived must be true or false")),limit:E(Of("limit",1,500))},_f={title:se(ie("title must be a string"),gt(e=>e.trim()!=="","title must not be empty")),description:E(We("description","Markdown body of the project note")),icon:E(se(ie("icon must be a string"),gt(e=>e.trim()!=="","icon must not be empty"),tt("An emoji"))),color:E(se(ie("color must be a hex color like #8b72be"),wl(fl,"color must be a hex color like #8b72be"))),teamMembers:E(Ti("teamMembers","Names or wikilinks of the people on the project")),parentId:E(un(se(ie("parentId must be a string or null"),tt("Id of the parent project, from list_projects"))))},Rw=yt(_f,Qn("expected an object")),Nw=yt(Dl,Qn("expected an object")),_w=yt(jf,Qn("expected an object")),Hw=se(yt(Rf,Qn("expected an object")),gt(e=>e.before===void 0||e.after===void 0,"pass before or after, not both"),gt(e=>e.parentId!==void 0||e.projectId!==void 0||!!(e.before||e.after),"nothing to move: pass parentId, projectId, before or after")),Bw=yt(Nf,Qn("expected an object"));function Hf(e){let t=new Map;for(let o of e)t.set(o.id,pl({id:o.id,title:o.title,description:o.description,type:o.type,status:o.status,priority:o.priority,start:o.start,due:o.due,completed:o.completed,progress:o.progress,assignees:[...o.assignees],tags:[...o.tags],dependencies:[...o.dependencies],recurrence:o.recurrence??void 0,timeEstimate:o.timeEstimate??void 0,timeLogs:o.timeLogs.map(i=>({...i})),customFields:{...o.customFields},archived:o.archived,createdAt:o.createdAt,updatedAt:o.updatedAt,filePath:o.path||void 0}));let n=[],r=[...e].sort((o,i)=>o.position-i.position);for(let o of r){let i=t.get(o.id);if(!i)continue;let s=o.parentId?t.get(o.parentId):void 0;s?s.subtasks.push(i):n.push(i)}return n}var Bf=Symbol();var Vf=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,n=>n.toLowerCase())}}).formData();var by=1e4,xi=e=>"headers"in e,$f=async(e,t=Object.create(null))=>{let{all:n=!1,dot:r=!1}=t,o=(xi(e)?e.headers:e.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();return o==="multipart/form-data"||o==="application/x-www-form-urlencoded"?ky(e,{all:n,dot:r}):{}};async function ky(e,t){if(!xi(e)&&e.bodyCache.formData)return Gf(await e.bodyCache.formData,t);let n=xi(e)?e.headers:e.raw.headers,r=await e.arrayBuffer(),o=Vf(r,n.get("Content-Type")||"");xi(e)||(e.bodyCache.formData=o);let i=await o;return i?Gf(i,t):{}}function Gf(e,t){let n=Object.create(null),r={count:0};return e.forEach((o,i)=>{t.all||i.endsWith("[]")?wy(n,i,o):n[i]=o}),t.dot&&Object.entries(n).forEach(([o,i])=>{o.includes(".")&&(Ty(n,o,i,r),delete n[o])}),n}var wy=(e,t,n)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(n):e[t]=[e[t],n]:t.endsWith("[]")?e[t]=[n]:e[t]=n},Ty=(e,t,n,r)=>{if(/(?:^|\\.)__proto__\\./.test(t))return;let o=e,i=t.split(".",34);i.length>33&&Wf(),i.forEach((s,a)=>{a===i.length-1?o[s]=n:((!o[s]||typeof o[s]!="object"||Array.isArray(o[s])||o[s]instanceof File)&&(r.count++>=by&&Wf(),o[s]=Object.create(null)),o=o[s])})},Wf=()=>{throw new Error("Nesting limit exceeded")};var xy=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,n=>{try{return t(n)}catch{return n}})}};var Ei=e=>e.indexOf("%")!==-1?xy(e,Ey):e,Pl=e=>(e.indexOf("+")!==-1&&(e=e.replace(/\\+/g," ")),Ei(e)),qf=(e,t,n)=>{let r=e.indexOf("#",8);r!==-1&&(e=e.slice(0,r));let o;if(!n&&t&&t.indexOf("%")===-1&&t.indexOf("+")===-1){let a=e.indexOf("?",8);if(a===-1)return;for(e.startsWith(t,a+1)||(a=e.indexOf(`&${t}`,a+1));a!==-1;){let l=e.charCodeAt(a+t.length+1);if(l===61){let c=a+t.length+2,u=e.indexOf("&",c);return Pl(e.slice(c,u===-1?void 0:u))}else if(l==38||isNaN(l))return"";a=e.indexOf(`&${t}`,a+1)}if(o=/[%+]/.test(e),!o)return}let i=Object.create(null);o??=/[%+]/.test(e);let s=e.indexOf("?",8);for(;s!==-1;){let a=e.indexOf("&",s+1),l=e.indexOf("=",s);l>a&&a!==-1&&(l=-1);let c=e.slice(s+1,l===-1?a===-1?void 0:a:l);if(o&&(c=Pl(c)),s=a,c==="")continue;let u;l===-1?u="":(u=e.slice(l+1,a===-1?void 0:a),o&&(u=Pl(u))),n?(i[c]&&Array.isArray(i[c])||(i[c]=[]),i[c].push(u)):i[c]??=u}return t?i[t]:i},Uf=qf,Zf=(e,t)=>qf(e,t,!0),Ey=decodeURIComponent;var Cy=class{raw;#n;#e;routeIndex=0;path;bodyCache={};constructor(e,t="/",n=[[]]){this.raw=e,this.path=t,this.#e=n}param(e){return e?this.#o(e):this.#i()}#o(e){let t=this.#e[0][this.routeIndex]?.[1][e],n=this.#r(t);return n&&Ei(n)}#i(){let e={},t=Object.keys(this.#e[0][this.routeIndex]?.[1]??{});for(let n of t){let r=this.#r(this.#e[0][this.routeIndex][1][n]);r!==void 0&&(e[n]=Ei(r))}return e}#r(e){return this.#e[1]?this.#e[1][e]:e}query(e){return Uf(this.url,e)}queries(e){return Zf(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((n,r)=>{t[r]=n}),t}async parseBody(e){return $f(this,e)}#t=e=>{let{bodyCache:t,raw:n}=this,r=t[e];if(r)return r;for(let o in t)return t[o].then(i=>{o==="json"&&(i=JSON.stringify(i));let s=o==="formData"?void 0:n.headers.get("content-type");return new Response(i,{headers:s?{"Content-Type":s}:void 0})[e]()});return t[e]=n[e]()};json(){return this.#t("text").then(e=>JSON.parse(e))}text(){return this.#t("text")}arrayBuffer(){return this.#t("arrayBuffer")}bytes(){return this.#t("arrayBuffer").then(e=>new Uint8Array(e))}blob(){return this.#t("blob")}formData(){return this.#t("formData")}addValidatedData(e,t){(this.#n??={})[e]=t}valid(e){return this.#n?.[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Bf](){return this.#e}get matchedRoutes(){return this.#e[0].map(([[,e]])=>e)}get routePath(){return this.#e[0].map(([[,e]])=>e)[this.routeIndex].path}};var er=()=>Object.create(null);var GT=er();var lx=er();function Xf(e,t){return se(ie(`${e} is required`),tt(t))}var Hx=Xf("projectId","Id of the project, from list_projects"),Bx=Xf("taskId","Id of the task, from list_tasks or search_tasks");var jy="dotpm-snapshot";var Ry=[1,2];function Ci(e){if(typeof e!="object"||e===null)return!1;let t=e;return t.format===jy&&Ry.includes(t.version)&&Array.isArray(t.projects)}var Ny="http://www.w3.org/2000/svg";function w(e,t){let n=Yi().createElementNS(Ny,e);if(t)for(let[r,o]of Object.entries(t))n.setAttribute(r,String(o));return n}function dn(e,t){e.setAttr("role","link"),e.setAttr("tabindex","0"),e.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),t()}),e.addEventListener("keydown",n=>{n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),n.stopPropagation(),t())})}function tr(e){return(...t)=>{(async()=>{try{await e(...t)}catch(n){console.error("[PM]",n),Yl(m("common.somethingWentWrong"))}})()}}var Jf=new Map;function vt(e){let t=Jf.get(e);if(t===void 0){let n=createSpan();S(n,e),t=n.childElementCount>0,Jf.set(e,t)}return t}function nr(e,t){return e&&vt(e)?t:[e,t].filter(Boolean).join(" ")}var pe=class{el;button;constructor(t){this.button=fo(t),this.el=this.button.extraSettingsEl,this.el.addClass("pm-icon-btn"),this.el.addEventListener("keydown",n=>{n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),this.el.click())})}setIcon(t){return this.button.setIcon(t),this}setTooltip(t){return this.button.setTooltip(t),this}setRevealOnHover(t){return this.el.toggleClass("pm-icon-btn--hover-only",t),this}onClick(t){return this.el.addEventListener("click",t),this}};var Si=class{el;constructor(t,n){this.el=t.createEl("td",{cls:"pm-table-cell pm-table-cell-assignees"});let r=this.el.createDiv("dotpm-people");for(let o of n){let i=r.createSpan({cls:"dotpm-person",text:z(o.name)});o.unresolved&&i.addClass("dotpm-person--unresolved"),o.onClick&&(i.addClass("dotpm-person--link"),dn(i,o.onClick))}}};function _y(e){let t=e.trim().split(/\\s+/).filter(Boolean);return(t.length>=2?t[0][0]+t[1][0]:e.slice(0,2)).toUpperCase()}var rr=class{el;color;constructor(t){this.el=t.createSpan({cls:"pm-avatar"})}setName(t){let n=z(t);return this.el.setText(_y(n)),this.el.setCssProps({"--pm-avatar-color":this.color??pi(n)}),le(this.el,n),this}setColor(t){return t?(this.color=t,this.el.setCssProps({"--pm-avatar-color":t}),this):this}setSize(t){return this.el.toggleClass("pm-avatar--sm",t==="sm"),this}setUnresolved(t){return this.el.toggleClass("pm-avatar--unresolved",t),this}onClick(t){return this.el.addClass("pm-avatar--link"),dn(this.el,t),this}};var pn=class{el;people=[];max=3;size="md";constructor(t){this.el=t.createDiv("pm-avatar-stack")}setNames(t){return this.setPeople(t.map(n=>({name:n})))}setPeople(t){return this.people=t,this.render(),this}setMax(t){return this.max=t,this.render(),this}setSize(t){return this.size=t,this.render(),this}render(){this.el.empty();let t=this.people.slice(0,this.max);for(let r of t){let o=new rr(this.el).setName(r.name).setSize(this.size);o.setColor(r.color),r.unresolved&&o.setUnresolved(!0),r.onClick&&o.onClick(r.onClick)}let n=this.people.length-t.length;if(n>0){let r=this.el.createSpan({cls:"pm-avatar pm-avatar--more"});r.setText(`+${n}`),this.size==="sm"&&r.addClass("pm-avatar--sm")}}};var Di=class{el;constructor(t,n){switch(this.el=t.createEl("td",{cls:"pm-table-cell"}),n.kind){case"text":this.empty(n.text);return;case"checkbox":n.checked?S(this.el.createSpan({cls:"pm-glyph-icon"}),"check"):this.empty("");return;case"url":{if(!n.url){this.empty("");return}let r=this.el.createEl("a",{cls:"external-link",text:n.url,href:n.url});r.setAttr("target","_blank"),r.setAttr("rel","noopener");return}case"people":n.people.length===0?this.empty(""):new pn(this.el).setPeople(n.people).setMax(3);return;case"links":this.renderLinks(n.links)}}empty(t){this.el.createSpan({text:t||"\\u2014",cls:"pm-cf-value"})}renderLinks(t){let n=this.el.createSpan({cls:"pm-cf-value"});t.forEach((r,o)=>{o>0&&n.createSpan({text:", "});let i=n.createSpan({text:r.name});if(!r.onClick&&!r.unresolved)return;i.addClass("pm-cf-link"),r.unresolved&&i.addClass("pm-cf-link--unresolved");let s=r.onClick;s&&dn(i,s)})}};var I=class{el;labelEl;dotEl=null;iconEl=null;constructor(t){this.el=t.createSpan({cls:"pm-chip"}),this.labelEl=this.el.createSpan({cls:"pm-chip-label"})}setLeadingIcon(t){return this.iconEl||(this.iconEl=this.el.createSpan({cls:"pm-chip-icon"}),this.el.prepend(this.iconEl)),S(this.iconEl,t),this}setLabel(t){return this.labelEl.setText(t),this}setColor(t){return this.el.style.setProperty("--pm-chip-color",t),this}setVariant(t){return this.el.toggleClass("pm-chip--solid",t==="solid"),this.el.toggleClass("pm-chip--outline",t==="outline"),this.el.toggleClass("pm-chip--plain",t==="plain"),this}setDot(t=!0){return t&&!this.dotEl?(this.dotEl=this.el.createSpan({cls:"pm-chip-dot"}),this.el.prepend(this.dotEl)):!t&&this.dotEl&&(this.dotEl.remove(),this.dotEl=null),this}setTag(t=!0){return this.el.toggleClass("pm-chip--tag",t),this}setStrong(t=!0){return this.el.toggleClass("pm-chip--strong",t),this}setShape(t){return this.el.toggleClass("pm-chip--pill",t==="pill"),this}setSize(t){return this.el.toggleClass("pm-chip--sm",t==="sm"),this}setTooltip(t){return le(this.el,t),this}setRemovable(t,n){let r=this.el.createEl("button",{cls:"pm-chip-rm"});return S(r,"x"),n&&(r.setAttribute("aria-label",n),le(r,n)),r.onclick=o=>{o.preventDefault(),o.stopPropagation(),t()},this}onClick(t){return this.el.addClass("pm-chip--interactive"),this.el.addEventListener("click",t),this}};function oo(e,t,n,r="md"){let o=new I(e).setLabel(t).setSize(r);return n==="near"?o.setVariant("solid").setColor("var(--color-orange)"):n==="overdue"&&o.setVariant("solid").setColor("var(--color-red)").setStrong(),o}function fn(e){let{container:t,display:n,inputType:r,value:o,onSave:i}=e,s=t.createEl("input",{type:r,cls:"pm-inline-edit",value:o});n.replaceWith(s),s.focus(),r!=="date"&&s.select();let a=!1,l=tr(async()=>{if(a)return;a=!0;let d=s.value.trim();d!==o?await i(d):s.replaceWith(n)}),c=()=>{a||(a=!0,s.replaceWith(n))},u=!1;s.addEventListener("blur",l),s.addEventListener("keydown",d=>{d.key==="Enter"?l():d.key==="Escape"?c():u=!0}),r==="date"&&s.addEventListener("change",()=>{u||l()})}var Pi=class{el;constructor(t,n){let{task:r}=n;this.el=t.createEl("td",{cls:"pm-table-cell"});let o=s=>{fn({container:this.el,display:s,inputType:"date",value:r.due,onSave:n.onSave})};if(!r.due){let s=new I(this.el).setLabel("\\u2014").setColor("var(--text-faint)").onClick(a=>{a.stopPropagation(),o(s.el)});return}let i=oo(this.el,an(r.due),n.urgency);i.onClick(s=>{s.stopPropagation(),o(i.el)})}};var or=class{el;constructor(t,n){this.el=t.createDiv({cls:"tree-item-icon collapse-icon pm-collapse-toggle"}),S(this.el,"right-triangle"),this.el.toggleClass("is-collapsed",n.collapsed);let r=n.subject??m("collapse.subtasks");this.el.setAttr("aria-label",m(n.collapsed?"collapse.expand":"collapse.collapse",{subject:r})),this.el.addEventListener("click",n.onToggle)}};var Mi=class{el;constructor(t,n){this.el=t.createEl("td",{cls:"pm-table-cell-expand"}),n.hasSubtasks&&new or(this.el,{collapsed:n.collapsed,onToggle:n.onToggle})}};function Hy(e){return e?.icon&&vt(e.icon)?e.icon:null}function Qf(e,t,n){e.addItem(r=>{r.setTitle(nr(t.icon,t.label)).onClick(n.onClick),n.checked!==void 0&&r.setChecked(n.checked);let o=t.namedIcon??t.icon;vt(o)&&r.setIcon(o)})}function em(e,t,n,r){let o=Ve(n,t.status),i=new I(e).setLabel(nr(o?.icon,o?.label??t.status)).setColor(o?.color??"var(--text-muted)").setVariant("solid").setDot(!o?.icon).onClick(a=>{let l=dr();for(let c of n)Qf(l,c,{checked:c.id===t.status,onClick:()=>r(c.id)});l.showAtMouseEvent(a)}),s=Hy(o);return s&&i.setLeadingIcon(s),i.el}function tm(e,t,n,r,o){let i=ht(n,t.priority),s=new I(e).setLabel(nr(i?.icon,i?.label??t.priority)).setColor(i?.color??"var(--text-muted)").setVariant("plain"),a=eo(n,t.priority,r);return vt(a)&&s.setLeadingIcon(a),s.onClick(l=>{let c=dr();for(let u of n)Qf(c,{...u,namedIcon:eo(n,u.id,r)},{checked:u.id===t.priority,onClick:()=>o(u.id)});c.showAtMouseEvent(l)}),s.el}function nm(e,t,n,r="pm-subtask-dot"){let o=Ve(n,t),i=e.createSpan({cls:r});return i.style.background=o?.color??"var(--text-muted)",i}var Ii=class{el;constructor(t,n){this.el=t.createEl("td",{cls:"pm-table-cell"}),ht(n.priorities,n.task.priority)&&tm(this.el,n.task,n.priorities,n.priorityIcons,n.onChange)}};var mn=class{el;fill;labelEl=null;value=0;constructor(t){this.el=t.createDiv("pm-progress");let n=this.el.createDiv("pm-progress-track");this.fill=n.createDiv("pm-progress-fill")}setValue(t){return this.value=Math.max(0,Math.min(100,t)),this.fill.style.width=`${this.value}%`,this.labelEl&&this.labelEl.setText(`${Math.round(this.value)}%`),this}setColor(t){return this.el.style.setProperty("--pm-progress-color",t),this}setSize(t){return this.el.toggleClass("pm-progress--sm",t==="sm"),this}setShowLabel(t){return t&&!this.labelEl?this.labelEl=this.el.createSpan({cls:"pm-progress-label",text:`${Math.round(this.value)}%`}):!t&&this.labelEl&&(this.labelEl.remove(),this.labelEl=null),this}};var Fi=class{el;constructor(t,n){this.el=t.createEl("td",{cls:"pm-table-cell pm-table-cell-progress"});let r=new mn(this.el).setValue(n.value).setColor(n.color).setShowLabel(!0);r.el.addEventListener("click",o=>{o.stopPropagation(),fn({container:this.el,display:r.el,inputType:"number",value:String(n.value),onSave:i=>n.onSave(Math.max(0,Math.min(100,Math.round(parseFloat(i)||0))))})})}};function ir(e,t){let n=new I(e).setLabel(t.title).setVariant("outline").setSize("sm").setDot(!0).setColor(t.color),r=t.onClick;return r&&n.setTooltip(m("projectChip.open",{title:t.title})).onClick(o=>{o.stopPropagation(),r()}),n}var Li=class{el;constructor(t,n){this.el=t.createEl("td",{cls:"pm-table-cell"}),ir(this.el,n)}};var Ai=class{el;constructor(t,n){this.el=t.createEl("td",{cls:"pm-table-cell"}),Ve(n.statuses,n.task.status)&&em(this.el,n.task,n.statuses,n.onChange)}};function Oi(e,t,n,r="md"){if(t<=0&&n<=0)return null;let o=n>0?m("time.loggedOfEstimate",{logged:t,estimate:n}):m("time.logged",{hours:t}),i=new I(e).setLabel(o).setSize(r);return n>0&&t>n&&i.setVariant("solid").setColor("var(--color-red)").setStrong(),i}var ji=class{el;constructor(t,n){this.el=t.createEl("td",{cls:"pm-table-cell pm-table-cell-time"}),Oi(this.el,n.logged,n.estimate)}};function Ri(e,t,n){let r=new I(e).setLabel(t).setVariant("outline").setTag();return n&&r.setDot(!0).setColor(pi(t)),r}function Ml(e,t,n){if(!t?.length)return;let r=t.length-1;for(let o=0;o<t.length;o++){if(o!==r&&!t[o])continue;let i=o===r?"pm-tree-guide pm-tree-guide--elbow":"pm-tree-guide",s=e.createSpan({cls:i});o===r&&n&&s.addClass("pm-tree-guide--last"),s.style.setProperty("--level",String(o))}}function rm(e,t){return e.length?[...e.slice(0,-1),!t,!1]:[!1]}var Ni=class{el;constructor(t,n){let{task:r}=n;this.el=t.createEl("td",{cls:"pm-table-cell-title"}),Ml(this.el,n.treeGuides,n.isLastChild);let o=this.el.createDiv("pm-table-title-inner"),i=o.createSpan({text:r.title,cls:"pm-task-title-text"});if(i.addEventListener("click",()=>n.onTitleClick()),i.addEventListener("dblclick",s=>{s.stopPropagation(),fn({container:o,display:i,inputType:"text",value:r.title,onSave:n.onTitleSave})}),new pe(o).setIcon("plus").setTooltip(m("taskMenu.addSubtask")).setRevealOnHover(!0).onClick(s=>{s.stopPropagation(),n.onAddSubtask()}),r.type==="milestone"&&new I(o).setLabel(m("chip.milestone")).setVariant("solid").setSize("sm").setColor("var(--color-purple)").setTooltip(m("taskForm.typeMilestone")),r.type==="subtask"&&new I(o).setLabel(m("chip.subtask")).setVariant("solid").setSize("sm").setColor("var(--color-green)").setTooltip(m("taskForm.typeSubtask")),r.recurrence&&new I(o).setLabel(m("chip.recurring")).setVariant("solid").setSize("sm").setColor("var(--color-blue)").setTooltip(m("chip.recurringTooltip")),r.archived&&new I(o).setLabel(m("common.archived")).setVariant("solid").setSize("sm").setColor("var(--text-muted)").setTooltip(m("common.archived")),r.tags.length){let s=o.createDiv("pm-table-tags");for(let a of r.tags)Ri(s,a,n.showTagColors)}}};var _i=class{el;constructor(t,n){let{task:r}=n,o=t.createDiv("pm-kanban-card");o.draggable=!0,o.dataset.taskId=r.id,this.el=o;let{fields:i}=n;n.priorityColor&&i.includes("priority")&&o.createDiv("pm-kanban-card-priority-bar").setCssStyles({background:n.priorityColor});let s=o.createDiv("pm-kanban-card-body");n.parentTitle&&s.createSpan({text:n.parentTitle,cls:"pm-kanban-card-parent"});let a=s.createDiv("pm-kanban-card-title-row");a.createSpan({text:r.title,cls:"pm-kanban-card-title"}),r.type==="milestone"&&new I(a).setLabel(m("chip.milestone")).setVariant("solid").setSize("sm").setColor("var(--color-purple)").setTooltip(m("taskForm.typeMilestone")),r.type==="subtask"&&new I(a).setLabel(m("chip.subtask")).setVariant("solid").setSize("sm").setColor("var(--color-green)").setTooltip(m("taskForm.typeSubtask")),r.recurrence&&new I(a).setLabel(m("chip.recurring")).setVariant("solid").setSize("sm").setColor("var(--color-blue)").setTooltip(m("chip.recurringTooltip"));let l=s.createDiv("pm-kanban-card-footer");for(let c of i)if(c==="description"&&n.descriptionPreview)s.createDiv({cls:"pm-kanban-card-description",text:n.descriptionPreview});else if(c==="time")Oi(s,n.loggedHours,r.timeEstimate??0,"sm");else if(c==="tags"&&r.tags.length){let u=s.createDiv("pm-kanban-card-tags");for(let d of r.tags.slice(0,3))Ri(u,d,n.showTagColors)}else if(c==="progress"&&r.progress>0)new mn(s).setSize("sm").setValue(r.progress);else if(c==="project")n.renderSource?.(l);else if(c==="assignees")new pn(l).setPeople(n.people).setMax(3).setSize("sm");else if(c==="due"&&r.due)oo(l,ui(r.due),n.overdue?"overdue":"normal","sm");else if(n.customValues?.[c]?.text){let{name:u,text:d}=n.customValues[c],p=s.createDiv("pm-kanban-card-field");p.createSpan({cls:"pm-kanban-card-field-name",text:u}),p.createSpan({cls:"pm-kanban-card-field-value",text:d})}l.childElementCount?s.appendChild(l):l.remove(),o.addEventListener("dragstart",c=>{c.dataTransfer?.setData("text/plain",r.id),o.addClass("pm-kanban-card--dragging"),window.setTimeout(()=>o.addClass("pm-dragging"),0),n.onDragStart()}),o.addEventListener("dragend",()=>{o.removeClass("pm-kanban-card--dragging"),o.removeClass("pm-dragging"),n.onDragEnd()}),o.addEventListener("click",()=>n.onClick()),o.addEventListener("contextmenu",c=>{c.preventDefault(),n.onContextMenu(c)})}};var Hi=class{el;constructor(t,n){let r=t.createDiv("pm-kanban-col"),{column:o}=n,i=o.color??"var(--text-muted)";r.dataset.column=o.id,this.el=r;let s=r.createDiv("pm-kanban-col-header");s.style.setProperty("--col-color",i),s.createDiv("pm-kanban-col-topbar").setCssStyles({background:i});let l=s.createDiv("pm-kanban-col-title-row"),c=l.createSpan({cls:"pm-kanban-col-badge"});o.icon&&vt(o.icon)?(S(c.createSpan({cls:"pm-kanban-col-badge-icon"}),o.icon),c.appendText(o.label)):c.setText(nr(o.icon??"",o.label)),c.style.color=i,l.createDiv("pm-kanban-col-header-right").createSpan({text:String(n.cards.length),cls:"pm-kanban-col-count"});let d=r.createDiv("pm-kanban-cards");d.dataset.column=o.id;for(let p of n.cards)new _i(d,{fields:n.fields,task:p.task,people:p.people,priorityColor:p.priorityColor,descriptionPreview:p.descriptionPreview,parentTitle:p.parentTitle,customValues:p.customValues,renderSource:p.renderSource,loggedHours:p.loggedHours,overdue:p.overdue,showTagColors:p.showTagColors,onClick:()=>n.onCardClick(p.task),onContextMenu:f=>n.onCardContextMenu(p.task,f),onDragStart:()=>n.onCardDragStart(p.task),onDragEnd:()=>n.onCardDragEnd()});d.addEventListener("dragover",p=>{p.preventDefault(),d.addClass("pm-kanban-drop-target");let f=By(d,p.clientY),g=d.querySelector(".pm-kanban-card--dragging");g&&(f?d.insertBefore(g,f):d.appendChild(g))}),d.addEventListener("dragleave",()=>{d.removeClass("pm-kanban-drop-target")}),d.addEventListener("drop",tr(async p=>{p.preventDefault(),d.removeClass("pm-kanban-drop-target");let f=p.dataTransfer?.getData("text/plain")??"";f&&await n.onDrop(f,o.id)}))}};function By(e,t){let n=Array.from(e.querySelectorAll(".pm-kanban-card:not(.pm-kanban-card--dragging)")),r=null,o=Number.NEGATIVE_INFINITY;for(let i of n){let s=i.getBoundingClientRect(),a=t-s.top-s.height/2;a<0&&a>o&&(o=a,r=i)}return r}var $y="button, input, .pm-chip--interactive, .pm-task-title-text, .pm-table-cell-select, .pm-icon-btn",Bi=class{el;constructor(t,n){this.el=t.createEl("tr",{cls:"pm-table-row"}),this.el.dataset.taskId=n.taskId,n.isDone&&this.el.addClass("pm-table-row--done"),n.isArchived&&this.el.addClass("pm-table-row--archived"),n.isSelected&&this.el.addClass("pm-table-row--selected"),this.el.style.setProperty("--depth",String(n.depth)),this.el.addEventListener("click",r=>{r.target.closest($y)||n.onRowClick()})}};function im(e,t){let{ctx:n}=e;switch(t){case"status":return n.statuses.map(a=>({id:a.id,label:a.label,icon:a.icon,color:a.color}));case"priority":return e.priorities.map(a=>({id:a.id,label:a.label,icon:eo(e.priorities,a.id,e.priorityIcons),color:a.color}));case"type":return[{id:"task",label:m("taskForm.typeTask")},{id:"subtask",label:m("taskForm.typeSubtask")},{id:"milestone",label:m("taskForm.typeMilestone")}];case"project":return e.projects.map(a=>({id:a.id,label:a.title,color:a.color}))}let r=new Map,o=n.customFields.find(a=>gf(a.id)===t);for(let a of o?.options??[])r.set(a,{id:a,label:a});let i=t==="assignee"||o?.type==="person";for(let a of e.tasks){let l=Kn(a,t,n);for(let c of Array.isArray(l)?l:typeof l=="string"&&l?[l]:[]){let u=jt(t,c,n);r.has(u)||r.set(u,{id:c,label:i?z(c):c})}}let s=[...r.values()];return o?.options?s:s.sort((a,l)=>a.label.localeCompare(l.label))}var so=class{el;constructor(t,n){this.el=t.createDiv("pm-segmented");let r=new Map;for(let o of n.options){let i=kt(this.el).setButtonText(o.label).onClick(()=>{for(let[s,a]of r)s===o.id?a.setCta():a.removeCta();n.onChange(o.id)});o.id===n.active&&i.setCta(),r.set(o.id,i)}}};var Vi=class{el;constructor(t,n){this.el=t.createDiv("pm-view-switcher");for(let r of n.options){let o=fo(this.el).setIcon(r.icon).setTooltip(r.label);o.extraSettingsEl.addClass("pm-view-btn"),r.id===n.active&&o.extraSettingsEl.addClass("pm-view-btn--active"),o.onClick(()=>{this.el.querySelectorAll(".pm-view-btn").forEach(i=>i.removeClass("pm-view-btn--active")),o.extraSettingsEl.addClass("pm-view-btn--active"),n.onChange(r.id)})}}};var K=44,P=56,Ll=280,Al=8,ao=7,Yy={day:44,week:22,month:9,quarter:5,year:2},zy=50,Ky=400;function cm(e,t){if(!e.weekends&&!(e.holidays&&t.length))return;let n=new Set(e.holidays?t:[]);return r=>!!e.weekends&&r.dayOfWeek>=6||n.has(r.toString())}function Xy(e){return Math.min(Ky,Math.max(zy,Math.round(e)))}var lm={day:30,week:90,month:365,quarter:365,year:1095};function um(e,t,n={}){let r=de(e).map(v=>v.task),o=[];for(let v of r){let k=B(v.start),C=B(v.due);k&&o.push(k),C&&o.push(C)}let i=we();o.push(i);let s=o.reduce((v,k)=>W.PlainDate.compare(k,v)<0?k:v,o[0]),a=o.reduce((v,k)=>W.PlainDate.compare(k,v)>0?k:v,o[0]);s=s.subtract({days:7}),a=a.add({days:14});let l=a.since(s,{largestUnit:"days"}).days;if(l<lm[t]){let v=Math.ceil((lm[t]-l)/2);s=s.subtract({days:v}),a=a.add({days:v})}t!=="day"&&(s=s.with({day:1}));let c=Yy[t]*Xy(n.zoom??100)/100,u=a.since(s,{largestUnit:"days"}).days,d=Math.ceil((n.minWidth??0)/c),p=[],f=0;for(let v=0;v<u||f<d;v++){let k=n.isHidden?.(s.add({days:v}))?1:0;p.push(k),f+=1-k}let g=p.length;a=s.add({days:g});let y=Uint8Array.from(p),h=new Int32Array(g+1);for(let v=0;v<g;v++)h[v+1]=h[v]+(y[v]?0:1);return{startDate:s,endDate:a,dayWidth:c,granularity:t,totalDays:g,totalWidth:h[g]*c,hidden:y,columns:h}}function Jy(e,t){return t<=0?t:t>=e.totalDays?e.columns[e.totalDays]+t-e.totalDays:e.columns[t]}function Nt(e,t){return Jy(e,t)*e.dayWidth}function Gi(e,t){return e.hidden[t]===1}function _(e,t){return Nt(e,t.since(e.startDate,{largestUnit:"days"}).days)}function Ol(e){return e.weekOfYear??0}function dm(e,t){let n=w("g",{class:"pm-gantt-grid"}),r=P+t*K,{startDate:o,totalDays:i,dayWidth:s,granularity:a}=e.cfg;for(let l=0;l<i;l++){let c=o.add({days:l}),u=Nt(e.cfg,l),d=(c.dayOfWeek===6||c.dayOfWeek===7)&&!Gi(e.cfg,l),p=c.dayOfWeek===1,f=c.day===1;d&&a==="day"&&n.appendChild(w("rect",{x:u,y:P,width:s,height:r-P,class:"pm-gantt-weekend"})),(a==="day"&&p||a==="week"&&p||a==="month"&&f||(a==="quarter"||a==="year")&&f&&(c.month-1)%3===0)&&n.appendChild(w("line",{x1:u,y1:P,x2:u,y2:r,class:"pm-gantt-gridline-v"}))}for(let l=0;l<=t;l++){let c=P+l*K;n.appendChild(w("line",{x1:0,y1:c,x2:e.cfg.totalWidth,y2:c,class:"pm-gantt-gridline-h"}))}e.svgEl.appendChild(n)}function pm(e,t){let n=_(e.cfg,we());n<0||n>e.cfg.totalWidth||(e.svgEl.appendChild(w("line",{x1:n,y1:P-8,x2:n,y2:t,class:"pm-gantt-today-line"})),e.headerSvgEl.appendChild(w("polygon",{points:`${n},${P-16} ${n+6},${P-8} ${n},${P} ${n-6},${P-8}`,class:"pm-gantt-today-diamond"})))}function fm(e,t,n,r){if(r==="weekNumber")return m("gantt.weekShort",{week:n});let o=uf(e,e.add({days:t-1}));return r==="dateRange"?o:m("gantt.weekWithRange",{week:n,range:o})}function mm(e){let t=w("g",{class:"pm-gantt-header"});t.appendChild(w("rect",{x:0,y:0,width:e.cfg.totalWidth,height:P,class:"pm-gantt-header-bg"}));let{granularity:n}=e.cfg;n==="day"?Qy(t,e):n==="week"?ev(t,e):n==="month"?tv(t,e):n==="quarter"?nv(t,e):rv(t,e),e.headerSvgEl.appendChild(t)}function Qy(e,t){let{startDate:n,totalDays:r,dayWidth:o}=t.cfg;hm(e,0,24,t);for(let i=0;i<r;i++){if(Gi(t.cfg,i))continue;let s=n.add({days:i}),a=Nt(t.cfg,i);if((s.dayOfWeek===6||s.dayOfWeek===7)&&e.appendChild(w("rect",{x:a,y:24,width:o,height:P-24,class:"pm-gantt-weekend-header"})),o>=20){let c=w("text",{x:a+o/2,y:42,class:"pm-gantt-header-day"});c.textContent=String(s.day),e.appendChild(c)}}}function ev(e,t){let{startDate:n,totalDays:r}=t.cfg;hm(e,0,24,t);let o=n.dayOfWeek===1?0:8-n.dayOfWeek,i=t.weekLabel;if(o>0){let a=Ol(n),l=Nt(t.cfg,o),c=w("text",{x:l/2,y:44,class:"pm-gantt-header-week"});c.textContent=fm(n,o,a,i),e.appendChild(c)}let s=o;for(;s<r;){let a=n.add({days:s}),l=Ol(a),c=Nt(t.cfg,s),u=Math.min(7,r-s),d=Nt(t.cfg,s+u)-c,p=w("text",{x:c+d/2,y:44,class:"pm-gantt-header-week"});p.textContent=fm(a,u,l,i),e.appendChild(p),e.appendChild(w("line",{x1:c,y1:24,x2:c,y2:P,class:"pm-gantt-header-tick"})),s+=7}}function tv(e,t){jl(e,0,24,t);let n=t.cfg.startDate.with({day:1});for(;W.PlainDate.compare(n,t.cfg.endDate)<0;){let r=n.add({months:1}),o=Math.max(0,_(t.cfg,n)),s=Math.min(t.cfg.totalWidth,_(t.cfg,r))-o,a=w("text",{x:o+s/2,y:44,class:"pm-gantt-header-month"});a.textContent=n.toLocaleString(Y(),{month:"short"}),e.appendChild(a),e.appendChild(w("line",{x1:o,y1:24,x2:o,y2:P,class:"pm-gantt-header-tick"})),n=r}}function nv(e,t){jl(e,0,24,t);let{startDate:n}=t.cfg,r=W.PlainDate.from({year:n.year,month:Math.floor((n.month-1)/3)*3+1,day:1});for(;W.PlainDate.compare(r,t.cfg.endDate)<0;){let o=Math.floor((r.month-1)/3)+1,i=r.add({months:3}),s=Math.max(0,_(t.cfg,r)),a=Math.min(t.cfg.totalWidth,_(t.cfg,i)),l=w("text",{x:s+(a-s)/2,y:44,class:"pm-gantt-header-quarter"});l.textContent=m("gantt.quarterYear",{quarter:o,year:String(r.year)}),e.appendChild(l),r=i}}function rv(e,t){jl(e,0,24,t);let{startDate:n}=t.cfg,r=W.PlainDate.from({year:n.year,month:Math.floor((n.month-1)/3)*3+1,day:1});for(;W.PlainDate.compare(r,t.cfg.endDate)<0;){let o=Math.floor((r.month-1)/3)+1,i=r.add({months:3}),s=Math.max(0,_(t.cfg,r)),a=Math.min(t.cfg.totalWidth,_(t.cfg,i)),l=w("text",{x:s+(a-s)/2,y:44,class:"pm-gantt-header-quarter"});l.textContent=m("gantt.quarterShort",{quarter:o}),e.appendChild(l),e.appendChild(w("line",{x1:s,y1:24,x2:s,y2:P,class:"pm-gantt-header-tick"})),r=i}}function hm(e,t,n,r){let o=r.cfg.startDate.with({day:1});for(;W.PlainDate.compare(o,r.cfg.endDate)<0;){let i=o.add({months:1}),s=Math.max(0,_(r.cfg,o)),l=Math.min(r.cfg.totalWidth,_(r.cfg,i))-s;e.appendChild(w("rect",{x:s,y:t,width:l,height:n,class:(o.month-1)%2===0?"pm-gantt-band-even":"pm-gantt-band-odd"}));let c=w("text",{x:s+6,y:t+n-6,class:"pm-gantt-header-month-top"});c.textContent=o.toLocaleString(Y(),{month:"short",year:"2-digit"}),e.appendChild(c),o=i}}function jl(e,t,n,r){let o=W.PlainDate.from({year:r.cfg.startDate.year,month:1,day:1});for(;W.PlainDate.compare(o,r.cfg.endDate)<0;){let i=o.add({years:1}),s=Math.max(0,_(r.cfg,o)),a=Math.min(r.cfg.totalWidth,_(r.cfg,i));e.appendChild(w("rect",{x:s,y:t,width:a-s,height:n,class:o.year%2===0?"pm-gantt-band-even":"pm-gantt-band-odd"}));let l=w("text",{x:s+6,y:t+n-6,class:"pm-gantt-header-year"});l.textContent=String(o.year),e.appendChild(l),o=i}}function gm(e,t){return t.includes("subtasks")?de(e).map(n=>n.task):e}function ym(e){let t=e.replace(/```[\\s\\S]*?```/g," ").replace(/`([^`]*)`/g,"$1").replace(/!?\\[([^\\]]*)\\]\\([^)]*\\)/g,"$1").replace(/^[ \\t]*[#>\\-*+]+[ \\t]+/gm,"").replace(/[*~]/g,"").replace(/\\s+/g," ").trim();return t?t.slice(0,240):void 0}function Wi(e,t,n){let r={};for(let o of t){let i=`cf:${o.id}`,s=e.customFields[o.id];if(!n.includes(i)||s===void 0||s===null||s==="")continue;let a=(Array.isArray(s)?s:[s]).map(et).filter(Boolean),l=o.type==="checkbox"?s===!0?m("common.yes"):"":o.type==="date"?a.map(c=>an(c)||c).join(", "):a.map(c=>c.replace(/^\\[\\[(?:[^|\\]]*\\|)?([^\\]]*)\\]\\]$/,"$1")).join(", ");l&&(r[i]={name:o.name,text:l})}return r}function Rl(e,t,n){return Ve(t,n.status)?.color??getComputedStyle(e.svgEl).getPropertyValue("--interactive-accent").trim()}function vm(e,t,n){e.appendChild(w("rect",{x:0,y:P+n*K,width:t.cfg.totalWidth,height:K,class:"pm-gantt-row-hover"}))}function bm(e,t,n){let r=Wi(e,n.customFields,t);return t.map(i=>{switch(i){case"assignees":return e.assignees.map(z).join(", ");case"progress":return e.progress>0?`${e.progress}%`:"";case"dates":return[e.start,e.due].filter(Boolean).map(ui).join(" - ");case"status":return Ve(n.statuses,e.status)?.label??e.status;case"priority":return ht(n.priorities,e.priority)?.label??e.priority;default:return r[i]?.text??""}}).filter(Boolean).join(", ")}function km(e,t,n,r,o,i,s=""){let a=B(r.start),l=B(r.due),c=a??l;if(!c)return null;let u=(l??c).add({days:1}),d=P+o*K+Al,p=K-Al*2,f=Math.max(0,_(t.cfg,c)),g=Math.min(t.cfg.totalWidth,_(t.cfg,u)),y=Math.max(8,g-f),h=w("g",{class:"pm-gantt-bar-group"});e.appendChild(h);let v=w("rect",{x:f,y:d,width:y,height:p,rx:ao,ry:ao,fill:i,opacity:.4,class:"pm-gantt-bar"});h.appendChild(v),r.progress>0&&h.appendChild(w("rect",{x:f,y:d,width:r.progress/100*y,height:p,rx:ao,ry:ao,fill:i,opacity:.9,class:"pm-gantt-bar-progress"}));let k=f+y+6;if(r.recurrence){let T=w("text",{x:f+y+4,y:d+p/2+5,class:"pm-gantt-bar-icon"});T.textContent=m("chip.recurring"),h.appendChild(T),k+=20}if(s){let T=w("text",{x:k,y:d+p/2,class:"pm-gantt-bar-aside"});T.textContent=s,h.appendChild(T)}if(y>55){let T=w("text",{x:f+8,y:d+p/2+5,class:"pm-gantt-bar-label"}),Q=Math.max(4,Math.floor((y-16)/7.5));T.textContent=r.title.length>Q?r.title.slice(0,Q-1)+"\\u2026":r.title,h.appendChild(T)}let C=Ve(n,r.status),D=w("title",{}),L=[r.title,`${C?.label??r.status} \\xB7 ${r.priority}`,`${m("gantt.tooltipStart",{date:r.start||"\\u2014"})}  ${m("gantt.tooltipDue",{date:r.due||"\\u2014"})}`,m("gantt.tooltipProgress",{percent:r.progress})];return r.assignees.length&&L.push(m("gantt.tooltipAssignees",{names:r.assignees.map(z).join(", ")})),D.textContent=L.join(`\n`),v.appendChild(D),{barGroup:h,rect:v,x:f,y:d,width:y,height:p}}function wm(e,t,n,r,o){let i=B(n.due)??B(n.start);if(!i)return null;let s=_(t.cfg,i)+t.cfg.dayWidth/2,a=P+r*K+K/2,l=12,c=w("polygon",{points:`${s},${a-l} ${s+l},${a} ${s},${a+l} ${s-l},${a}`,fill:o,opacity:.8,class:"pm-gantt-milestone",cursor:"pointer"});e.appendChild(c);let u=w("title",{});return u.textContent=`${m("gantt.milestoneTitle",{title:n.title})}\n${m("gantt.tooltipDate",{date:n.due||n.start||"\\u2014"})}`,c.appendChild(u),c}function Tm(e,t,n){let r=n.filter(({task:s})=>s.type==="milestone"&&(s.due||s.start));if(!r.length)return;let o=w("g",{class:"pm-gantt-milestone-labels"}),i=P+n.length*K;for(let{task:s}of r){let a=B(s.due)??B(s.start);if(!a)continue;let l=_(e.cfg,a)+e.cfg.dayWidth/2,c=Rl(e,t,s);o.appendChild(w("line",{x1:l,y1:P,x2:l,y2:i,stroke:c,"stroke-width":1,"stroke-dasharray":"4 4",opacity:.4}));let u=w("text",{x:l,y:14,"text-anchor":"middle",class:"pm-gantt-milestone-label",fill:c});u.textContent=s.title.length>16?s.title.slice(0,14)+"\\u2026":s.title,e.headerSvgEl.appendChild(u)}e.svgEl.appendChild(o)}function xm(e,t){let n=new Map;t.forEach((s,a)=>n.set(s.task.id,a));let r=w("g",{class:"pm-gantt-arrows"});for(let{task:s}of t){if(!s.dependencies?.length)continue;let a=n.get(s.id);if(a===void 0)continue;let l=P+a*K+K/2,c=B(s.start);if(!c)continue;let u=_(e.cfg,c);for(let d of s.dependencies){let p=n.get(d);if(p===void 0)continue;let f=B(t[p].task.due);if(!f)continue;let g=_(e.cfg,f.add({days:1})),y=P+p*K+K/2,h=(g+u)/2;r.appendChild(w("path",{d:`M ${g} ${y} C ${h} ${y}, ${h} ${l}, ${u} ${l}`,class:"pm-gantt-arrow","marker-end":"url(#pm-arrowhead)"}))}}let o=e.svgEl.querySelector("defs")??e.svgEl.insertBefore(w("defs",{}),e.svgEl.firstChild),i=w("marker",{id:"pm-arrowhead",markerWidth:8,markerHeight:8,refX:6,refY:3,orient:"auto"});i.appendChild(w("path",{d:"M0,0 L0,6 L8,3 z",class:"pm-gantt-arrowhead"})),o.appendChild(i),e.svgEl.appendChild(r)}function lo(e,t){return{name:z(t),color:e.personColors[t]}}function _t(e){return e.projects.length>1}function Ht(e){return e.projects.flatMap(t=>t.tasks)}function Bt(e,t){for(let n of e.projects)if(de(n.tasks).some(r=>r.task.id===t))return n;return null}function $i(e,t){return Bt(e,t)?.config??$e(e)}function $e(e){let t=e.projects[0].config;return _t(e)?{...t,statuses:vi(e.projects.map(n=>n.config.statuses)),priorities:vi(e.projects.map(n=>n.config.priorities))}:t}function Vt(e){return _t(e)?vi(e.projects.map(t=>t.config.customFields)):e.projects[0].config.customFields}function ar(e){return{customFields:Vt(e),multi:_t(e)}}function lr(e){return{filter:e.filter,text:""}}function hn(e){return{statuses:$e(e).statuses,customFields:Vt(e),projectOf:t=>Bt(e,t.id)?.id}}function Em(e){let t=$e(e);return{filter:e.filter,tasks:de(Ht(e)).map(n=>n.task),ctx:hn(e),priorities:t.priorities,priorityIcons:t.priorityIcons,projects:_t(e)?e.projects.map(n=>({id:n.id,title:n.title,color:n.color})):[]}}function qi(e,t,n,r=[],o=[]){for(let i of n){let s=ov(e,t,i,r,o);if(s!==0)return s}return 0}function ov(e,t,n,r,o){let i=n.dir==="asc"?1:-1;switch(n.key){case"title":return i*e.title.localeCompare(t.title,Y());case"status":return i*(ml(e.status,r)-ml(t.status,r));case"priority":return i*(Cm(e.priority,o)-Cm(t.priority,o));case"due":return i*(e.due||"zzz").localeCompare(t.due||"zzz");case"assignees":return i*z(e.assignees[0]??"").localeCompare(z(t.assignees[0]??""),Y());case"progress":return i*(e.progress-t.progress);default:return 0}}function Cm(e,t){let n=t.findIndex(r=>r.id===e);return n>=0?n:999}var iv=["status","priority","type","project"];function sv(e){let t=["status","priority","assignee","tag","type",...e.projects.length>1?["project"]:[]],n=e.ctx.customFields.filter(r=>r.type==="select"||r.type==="multiselect"||r.type==="person").map(r=>`cf:${r.id}`);return[...t,...n]}function av(e,t){return sv(e).includes(t.field)?t.field:di().field}function lv(e,t,n){let r=Kn(e,t,n.ctx);return Array.isArray(r)?r:typeof r=="string"&&r?[r]:[]}function Sm(e,t,n){let r=av(e,t),o=to(r,e.ctx.customFields),i=new Map;for(let p of im(e,r))i.set(jt(r,p.id,e.ctx),{...p,tasks:[],hidden:!1});let s={id:"",label:m("group.none",{field:gi(r,e.ctx.customFields)}),tasks:[],hidden:!1};for(let p of n){let f=lv(p,r,e);f.length||s.tasks.push(p);for(let g of f){let y=jt(r,g,e.ctx),h=i.get(y);h||(h={id:g,label:g,tasks:[],hidden:!1},i.set(y,h)),h.tasks.push(p)}}let a=[...i.values()];o&&(!iv.includes(r)||s.tasks.length)&&a.push(s);let l=t.columns?.[r],c=new Map((l?.order??[]).map((p,f)=>[p,f])),u=a.map((p,f)=>({column:p,index:f})).sort((p,f)=>(c.get(p.column.id)??c.size+p.index)-(c.get(f.column.id)??c.size+f.index)).map(({column:p})=>p),d=new Set(l?.hidden??[]);for(let p of u)p.hidden=d.has(p.id)||!!t.hideEmpty&&p.tasks.length===0;return u}var gn=()=>{},Nl=async()=>{};function _l(e){let t=$e(e),n=lr(e),r=vf(n),o=bf(de(Ht(e)),n,hn(e)),i=new Set(o.map(c=>c.task.id)),s=new Map;for(let c of o){let u=c.parentId===null||r&&!i.has(c.parentId)?null:c.parentId,d=s.get(u)??[];d.push(c),s.set(u,d)}for(let c of s.values())c.sort((u,d)=>qi(u.task,d.task,e.sort,t.statuses,t.priorities));let a=[],l=(c,u)=>{let d=s.get(c);d&&d.forEach((p,f)=>{let g=f===d.length-1;a.push({...p,guides:cv(u,p.depth),isLastChild:g}),l(p.task.id,rm(u,g))})};return l(null,[]),a}function cv(e,t){return e.length>=t?e.slice(0,t):[...Array.from({length:t-e.length}).fill(!1),...e]}function uv(e,t,n){let r=(Array.isArray(n)?n:[n]).map(et).filter(Boolean);return t.type==="person"?{kind:"people",people:r.map(o=>lo(e,o))}:t.type==="checkbox"?{kind:"checkbox",checked:!!n}:t.type==="url"?{kind:"url",url:r.join(", ")}:t.type==="date"?{kind:"text",text:r.map(o=>an(o)||o).join(", ")}:{kind:"text",text:n!==void 0?et(n):""}}function Dm(e,t){let n=$e(t),r=Vt(t),o=cn(t.fields,"table",ar(t)),i=e.createDiv("pm-table-wrapper");i.setAttr("data-borders",t.settings.lineBorders);let s=i.createEl("table",{cls:"pm-table"}),a=s.createEl("thead").createEl("tr");a.createEl("th").setCssStyles({width:"32px"});for(let c of o){let u=a.createEl("th",{text:bl(c,r)}),d=vl(t.fields,c),p=c==="title"?t.fields.table?.widths?.title:void 0;d!==void 0?u.setCssStyles({width:`${d}px`,minWidth:`${d}px`}):u.setCssStyles({width:"auto",minWidth:p===void 0?"":`${p}px`});let f=t.sort.findIndex(g=>g.key===c);if(f>=0){let g=u.createSpan({text:t.sort[f].dir==="asc"?" \\u2191":" \\u2193",cls:"pm-sort-indicator"});t.sort.length>1&&g.createEl("sup",{text:String(f+1)})}}let l=s.createEl("tbody");for(let c of _l(t)){let{task:u,depth:d}=c,p=Bt(t,u.id),f=$i(t,u.id),g=ln(u.status,f.statuses),y=Ve(n.statuses,u.status),{el:h}=new Bi(l,{taskId:u.id,depth:d,isDone:g,isArchived:u.archived===!0,isSelected:!1,onRowClick:gn});new Mi(h,{hasSubtasks:u.subtasks.length>0,collapsed:!1,onToggle:gn});for(let v of o)switch(v){case"title":new Ni(h,{task:u,treeGuides:t.settings.showSubtreeConnections?c.guides:null,isLastChild:c.isLastChild,showTagColors:t.settings.showTagColors,onTitleClick:gn,onTitleSave:Nl,onAddSubtask:gn});break;case"project":new Li(h,{title:p?.title??"",color:p?.color??"",onClick:gn});break;case"status":new Ai(h,{task:u,statuses:n.statuses,onChange:gn});break;case"priority":new Ii(h,{task:u,priorities:n.priorities,priorityIcons:t.settings.priorityIcons,onChange:gn});break;case"assignees":new Si(h,u.assignees.map(k=>lo(t,k)));break;case"due":new Pi(h,{task:u,urgency:fi(u,f.statuses),onSave:Nl});break;case"progress":new Fi(h,{value:u.progress,color:y?.color??"var(--interactive-accent)",onSave:Nl});break;case"time":new ji(h,{logged:mi(u),estimate:u.timeEstimate??0});break;default:{let k=r.find(C=>`cf:${C.id}`===v);new Di(h,k?uv(t,k,u.customFields[k.id]):{kind:"text",text:""})}}}return i}var co=()=>{},dv=async()=>{};function pv(e,t){for(let{task:n}of de(Ht(e)))if(n.subtasks.some(r=>r.id===t))return n.title}function fv(e,t,n){let r=$i(e,t.id),o=ht(r.priorities,t.priority),i=_t(e)?Bt(e,t.id):null;return{task:t,people:t.assignees.map(s=>lo(e,s)),priorityColor:o&&t.priority!=="medium"&&t.priority!=="low"?o.color:void 0,parentTitle:n.includes("subtasks")&&t.type==="subtask"?pv(e,t.id):void 0,descriptionPreview:n.includes("description")?ym(t.description):void 0,customValues:Wi(t,Vt(e),n),renderSource:i?s=>ir(s,{title:i.title,color:i.color,onClick:co}):void 0,loggedHours:mi(t),overdue:fi(t,r.statuses)==="overdue",showTagColors:e.settings.showTagColors}}function Pm(e,t){let n=$e(t);e.addClass("pm-kanban-view");let r=e.createDiv("pm-kanban-board"),o=cn(t.fields,"kanban",ar(t)),i=gm(Ht(t),o),s=lr(t),a=hn(t),l=i.filter(c=>yi(c,s,a)).sort((c,u)=>qi(c,u,t.sort,n.statuses,n.priorities));for(let c of Sm(Em(t),t.group,l).filter(u=>!u.hidden))new Hi(r,{column:c,fields:o,cards:c.tasks.map(u=>fv(t,u,o)),onCardClick:co,onCardContextMenu:co,onCardDragStart:co,onCardDragEnd:co,onDrop:dv});return r}var mv=()=>[{id:"day",label:m("granularity.day")},{id:"week",label:m("granularity.week")},{id:"month",label:m("granularity.month")},{id:"quarter",label:m("granularity.quarter")},{id:"year",label:m("granularity.year")}],hv=()=>{};function gv(e){return gl(Ht(e),lr(e),hn(e))}function yv(e,t,n,r){let o=e.createDiv("pm-gantt-label-row");if(o.setCssStyles({height:`${K}px`,paddingLeft:`${r*18+8}px`}),o.dataset.taskId=n.id,o.createSpan({cls:"pm-gantt-label-spacer"}),nm(o,n.status,$e(t).statuses,"pm-gantt-label-dot"),o.createSpan({text:n.title,cls:"pm-gantt-label-title"}),_t(t)){let i=Bt(t,n.id);i&&ir(o,{title:i.title,color:i.color,onClick:hv})}n.progress>0&&o.createSpan({text:`${n.progress}%`,cls:"pm-gantt-label-progress"})}function vv(e,t,n){let r=gv(t),o=de(r).map(T=>({task:T.task,depth:T.depth})),i=um(r,n,{isHidden:cm(t.nonWorkingDays,t.settings.holidays)}),s=$e(t),a=s.statuses,l=cn(t.fields,"gantt",ar(t)).filter(T=>T!=="title"),c={statuses:a,priorities:s.priorities,customFields:Vt(t)},u=e.createDiv("pm-gantt-wrapper"),d=u.createDiv("pm-gantt-left");d.setCssStyles({width:`${Ll}px`,minWidth:`${Ll}px`});let p=d.createDiv("pm-gantt-left-header");p.setCssStyles({height:`${P}px`}),p.createSpan({text:m("columns.task"),cls:"pm-gantt-left-header-label"});let f=d.createDiv("pm-gantt-left-body"),g=u.createDiv("pm-gantt-right"),y=g.createDiv("pm-gantt-header-sticky");y.setCssStyles({width:`${i.totalWidth}px`,height:`${P}px`});let h=w("svg",{width:i.totalWidth,height:P,class:"pm-gantt-header-svg"});y.appendChild(h);let v=g.createDiv("pm-gantt-svg-container");v.setCssStyles({width:`${i.totalWidth}px`,marginTop:`-${P}px`});let k=P+(o.length+1)*K,C=w("svg",{width:i.totalWidth,height:k,class:"pm-gantt-svg"});v.appendChild(C);let D={svgEl:C,headerSvgEl:h,cfg:i,weekLabel:t.settings.ganttWeekLabel};mm(D),dm(D,o.length),pm(D,k);let L=w("g",{class:"pm-gantt-bars"});C.appendChild(L),o.forEach(({task:T,depth:Q},ee)=>{if(yv(f,t,T,Q),!T.start&&!T.due)return;let $=Rl(D,a,T);vm(L,D,ee),T.type==="milestone"?wm(L,D,T,ee,$):km(L,D,a,T,ee,$,bm(T,l,c))}),xm(D,o),Tm(D,a,o),d.addEventListener("wheel",T=>{g.scrollTop+=T.deltaY,g.scrollLeft+=T.deltaX,T.preventDefault()},{passive:!1}),g.addEventListener("scroll",()=>{f.scrollTop=g.scrollTop}),window.requestAnimationFrame(()=>{g.scrollLeft=Math.max(0,_(i,we())-g.clientWidth/2)})}function Mm(e,t){e.addClass("pm-gantt-view");let n=t.settings.ganttGranularity,r=e.createDiv("pm-gantt-controls"),o=e.createDiv("pm-gantt-body"),i=()=>{o.empty(),vv(o,t,n)};return new so(r,{options:mv(),active:n,onChange:s=>{n=s,i()}}),i(),o}var bv=["table","gantt","kanban"],kv=()=>[{id:"table",icon:"table",label:m("views.table")},{id:"gantt",icon:"git-fork",label:m("views.gantt")},{id:"kanban",icon:"layout-dashboard",label:m("views.kanban")}];function wv(e){return{projects:e.projects.map(t=>({id:t.id,title:t.title,color:t.color,icon:t.icon,tasks:Hf(t.tasks),config:{statuses:t.statuses,priorities:t.priorities,customFields:t.customFields,priorityIcons:e.settings.priorityIcons,defaultView:e.view.mode,autoSchedule:!1,pullForwardOnEarlyFinish:!1,autoArchiveDays:0,showSubtreeConnections:e.settings.showSubtreeConnections,lineBorders:e.settings.lineBorders}})),settings:{...e.settings,ganttGranularity:e.view.ganttGranularity,holidays:e.settings.holidays??[]},nonWorkingDays:Mf(e.view.nonWorkingDays),filter:Cf(e.view.filter),sort:Sf(e.view),group:Df(e.view.group),fields:e.view.fields?Pf(e.view.fields):xf(e.settings.kanbanShowSubtasks===!0,!1),personColors:e.personColors??{}}}var Tv="http://www.w3.org/2000/svg",xv=new Set(["svg","g","path","circle","ellipse","line","polyline","polygon","rect"]),Ev=new Set(["class","viewBox","width","height","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","fill-rule","clip-rule","opacity","transform","d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","points"]);function Im(e){if(e.namespaceURI!==Tv||!xv.has(e.localName))return null;let t=w(e.localName);for(let{name:n,value:r}of Array.from(e.attributes))Ev.has(n)&&t.setAttribute(n,r);for(let n of Array.from(e.children)){let r=Im(n);r&&t.appendChild(r)}return t}function Fm(e){let t=new DOMParser().parseFromString(e,"image/svg+xml").documentElement;return t.localName==="svg"?Im(t):null}function Cv(e){Zl({...zl,setIcon:(t,n)=>{t.empty();let r=e.icons[n],o=r?Fm(r):null;o&&t.appendChild(o)}})}function Sv(){let e=window.matchMedia("(prefers-color-scheme: dark)"),t=()=>document.body.toggleClass("theme-dark",e.matches);t(),e.addEventListener("change",t)}function Dv(e){return bv.some(t=>t===e)}function Lm(e,t,n={}){of(t.locale),lf(t.settings.dateFormat),Cv(t);let r=wv(t);e.empty(),e.addClass("pm-root","pm-snapshot");let o=e.createDiv("pm-snapshot-header"),i=r.projects[0];if(i.icon){let u=o.createSpan({cls:"pm-snapshot-icon"}),d=t.icons[i.icon],p=d?Fm(d):null;p?u.appendChild(p):u.setText(i.icon)}o.createEl("h1",{text:t.title,cls:"pm-snapshot-title"});let s=new Date(t.exportedAt);o.createDiv({cls:"pm-snapshot-meta",text:m("viewer.meta",{tasks:zn("count.tasks",_l(r).length),date:s.toLocaleDateString(Y()),time:s.toLocaleTimeString(Y(),{hour:"2-digit",minute:"2-digit"})})});let a=e.createDiv("pm-snapshot-body"),l=n.mode??t.view.mode,c=()=>{a.empty(),a.removeClass("pm-gantt-view","pm-kanban-view"),l==="table"?Dm(a,r):l==="gantt"?Mm(a,r):Pm(a,r)};new Vi(o,{options:kv(),active:l,onChange:u=>{l=u,n.onModeChange?.(u),c()}}),c()}function Pv(e){let t=e.getElementById("dotpm-snapshot");if(!t)return null;try{let n=JSON.parse(t.textContent??"");return Ci(n)?n:null}catch{return null}}async function Mv(e){let t=Pv(e);if(t)return t;let n=e.getElementById("app")?.dataset.snapshot;if(!n)return null;try{let r=await fetch(n);if(!r.ok)return null;let o=await r.json();return Ci(o)?o:null}catch{return null}}async function Iv(){let e=document.getElementById("app");if(!e)return;let t=await Mv(document);if(!t){e.setText(m("viewer.noSnapshot"));return}Sv(),document.title=t.title;let n=window.location.hash.slice(1);Lm(e,t,{mode:Dv(n)?n:void 0,onModeChange:r=>window.history.replaceState(null,"",`#${r}`)})}typeof document<"u"&&document.getElementById("app")&&Iv();export{il as catalogs,Ci as isSnapshot,Lm as mount};\n';

// src/assets.ts
var hashed = (name2, ext, content) => `static/dotpm/${name2}.${createHash("sha256").update(content).digest("hex").slice(0, 12)}.${ext}`;
var VIEWER_ASSETS = [
  { path: hashed("viewer", "js", viewer_js_default), content: viewer_js_default },
  { path: hashed("viewer", "css", viewer_css_default), content: viewer_css_default }
];
VIEWER_ASSETS[0].path;
VIEWER_ASSETS[1].path;

// node_modules/comma-separated-tokens/index.js
function stringify2(values, options) {
  const settings = {};
  const input = values[values.length - 1] === "" ? [...values, ""] : values;
  return input.join(
    (settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")
  ).trim();
}

// node_modules/devlop/lib/default.js
function ok() {
}

// node_modules/estree-util-is-identifier-name/lib/index.js
var nameRe = /^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u;
var nameReJsx = /^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u;
var emptyOptions = {};
function name(name2, options) {
  const settings = emptyOptions;
  const re2 = settings.jsx ? nameReJsx : nameRe;
  return re2.test(name2);
}

// node_modules/hast-util-whitespace/lib/index.js
var re = /[ \t\n\f\r]/g;
function whitespace(thing) {
  return typeof thing === "object" ? thing.type === "text" ? empty(thing.value) : false : empty(thing);
}
function empty(value) {
  return value.replace(re, "") === "";
}

// node_modules/property-information/lib/util/schema.js
var Schema = class {
  /**
   * @param {SchemaType['property']} property
   *   Property.
   * @param {SchemaType['normal']} normal
   *   Normal.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Schema.
   */
  constructor(property, normal, space) {
    this.normal = normal;
    this.property = property;
    if (space) {
      this.space = space;
    }
  }
};
Schema.prototype.normal = {};
Schema.prototype.property = {};
Schema.prototype.space = void 0;

// node_modules/property-information/lib/util/merge.js
function merge(definitions, space) {
  const property = {};
  const normal = {};
  for (const definition of definitions) {
    Object.assign(property, definition.property);
    Object.assign(normal, definition.normal);
  }
  return new Schema(property, normal, space);
}

// node_modules/property-information/lib/normalize.js
function normalize(value) {
  return value.toLowerCase();
}

// node_modules/property-information/lib/util/info.js
var Info = class {
  /**
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @returns
   *   Info.
   */
  constructor(property, attribute) {
    this.attribute = attribute;
    this.property = property;
  }
};
Info.prototype.attribute = "";
Info.prototype.booleanish = false;
Info.prototype.boolean = false;
Info.prototype.commaOrSpaceSeparated = false;
Info.prototype.commaSeparated = false;
Info.prototype.defined = false;
Info.prototype.mustUseProperty = false;
Info.prototype.number = false;
Info.prototype.overloadedBoolean = false;
Info.prototype.property = "";
Info.prototype.spaceSeparated = false;
Info.prototype.space = void 0;

// node_modules/property-information/lib/util/types.js
var types_exports = {};
__export(types_exports, {
  boolean: () => boolean,
  booleanish: () => booleanish,
  commaOrSpaceSeparated: () => commaOrSpaceSeparated,
  commaSeparated: () => commaSeparated,
  number: () => number,
  overloadedBoolean: () => overloadedBoolean,
  spaceSeparated: () => spaceSeparated
});
var powers = 0;
var boolean = increment();
var booleanish = increment();
var overloadedBoolean = increment();
var number = increment();
var spaceSeparated = increment();
var commaSeparated = increment();
var commaOrSpaceSeparated = increment();
function increment() {
  return 2 ** ++powers;
}

// node_modules/property-information/lib/util/defined-info.js
var checks = (
  /** @type {ReadonlyArray<keyof typeof types>} */
  Object.keys(types_exports)
);
var DefinedInfo = class extends Info {
  /**
   * @constructor
   * @param {string} property
   *   Property.
   * @param {string} attribute
   *   Attribute.
   * @param {number | null | undefined} [mask]
   *   Mask.
   * @param {Space | undefined} [space]
   *   Space.
   * @returns
   *   Info.
   */
  constructor(property, attribute, mask, space) {
    let index2 = -1;
    super(property, attribute);
    mark(this, "space", space);
    if (typeof mask === "number") {
      while (++index2 < checks.length) {
        const check = checks[index2];
        mark(this, checks[index2], (mask & types_exports[check]) === types_exports[check]);
      }
    }
  }
};
DefinedInfo.prototype.defined = true;
function mark(values, key, value) {
  if (value) {
    values[key] = value;
  }
}

// node_modules/property-information/lib/util/create.js
function create(definition) {
  const properties = {};
  const normals = {};
  for (const [property, value] of Object.entries(definition.properties)) {
    const info = new DefinedInfo(
      property,
      definition.transform(definition.attributes || {}, property),
      value,
      definition.space
    );
    if (definition.mustUseProperty && definition.mustUseProperty.includes(property)) {
      info.mustUseProperty = true;
    }
    properties[property] = info;
    normals[normalize(property)] = property;
    normals[normalize(info.attribute)] = property;
  }
  return new Schema(properties, normals, definition.space);
}

// node_modules/property-information/lib/aria.js
var aria = create({
  properties: {
    ariaActiveDescendant: null,
    ariaAtomic: booleanish,
    ariaAutoComplete: null,
    ariaBusy: booleanish,
    ariaChecked: booleanish,
    ariaColCount: number,
    ariaColIndex: number,
    ariaColSpan: number,
    ariaControls: spaceSeparated,
    ariaCurrent: null,
    ariaDescribedBy: spaceSeparated,
    ariaDetails: null,
    ariaDisabled: booleanish,
    ariaDropEffect: spaceSeparated,
    ariaErrorMessage: null,
    ariaExpanded: booleanish,
    ariaFlowTo: spaceSeparated,
    ariaGrabbed: booleanish,
    ariaHasPopup: null,
    ariaHidden: booleanish,
    ariaInvalid: null,
    ariaKeyShortcuts: null,
    ariaLabel: null,
    ariaLabelledBy: spaceSeparated,
    ariaLevel: number,
    ariaLive: null,
    ariaModal: booleanish,
    ariaMultiLine: booleanish,
    ariaMultiSelectable: booleanish,
    ariaOrientation: null,
    ariaOwns: spaceSeparated,
    ariaPlaceholder: null,
    ariaPosInSet: number,
    ariaPressed: booleanish,
    ariaReadOnly: booleanish,
    ariaRelevant: null,
    ariaRequired: booleanish,
    ariaRoleDescription: spaceSeparated,
    ariaRowCount: number,
    ariaRowIndex: number,
    ariaRowSpan: number,
    ariaSelected: booleanish,
    ariaSetSize: number,
    ariaSort: null,
    ariaValueMax: number,
    ariaValueMin: number,
    ariaValueNow: number,
    ariaValueText: null,
    role: null
  },
  transform(_2, property) {
    return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
  }
});

// node_modules/property-information/lib/util/case-sensitive-transform.js
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute;
}

// node_modules/property-information/lib/util/case-insensitive-transform.js
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase());
}

// node_modules/property-information/lib/html.js
var html = create({
  attributes: {
    acceptcharset: "accept-charset",
    classname: "class",
    htmlfor: "for",
    httpequiv: "http-equiv"
  },
  mustUseProperty: ["checked", "multiple", "muted", "selected"],
  properties: {
    // Standard Properties.
    abbr: null,
    accept: commaSeparated,
    acceptCharset: spaceSeparated,
    accessKey: spaceSeparated,
    action: null,
    allow: null,
    allowFullScreen: boolean,
    allowPaymentRequest: boolean,
    allowUserMedia: boolean,
    alpha: boolean,
    alt: null,
    as: null,
    async: boolean,
    autoCapitalize: null,
    autoComplete: spaceSeparated,
    autoFocus: boolean,
    autoPlay: boolean,
    blocking: spaceSeparated,
    capture: null,
    charSet: null,
    checked: boolean,
    cite: null,
    className: spaceSeparated,
    closedBy: null,
    colorSpace: null,
    cols: number,
    colSpan: number,
    command: null,
    commandFor: null,
    content: null,
    contentEditable: booleanish,
    controls: boolean,
    controlsList: spaceSeparated,
    coords: number | commaSeparated,
    crossOrigin: null,
    data: null,
    dateTime: null,
    decoding: null,
    default: boolean,
    defer: boolean,
    dir: null,
    dirName: null,
    disabled: boolean,
    download: overloadedBoolean,
    draggable: booleanish,
    encType: null,
    enterKeyHint: null,
    fetchPriority: null,
    form: null,
    formAction: null,
    formEncType: null,
    formMethod: null,
    formNoValidate: boolean,
    formTarget: null,
    headers: spaceSeparated,
    height: number,
    hidden: overloadedBoolean,
    high: number,
    href: null,
    hrefLang: null,
    htmlFor: spaceSeparated,
    httpEquiv: spaceSeparated,
    id: null,
    imageSizes: null,
    imageSrcSet: null,
    inert: boolean,
    inputMode: null,
    integrity: null,
    is: null,
    isMap: boolean,
    itemId: null,
    itemProp: spaceSeparated,
    itemRef: spaceSeparated,
    itemScope: boolean,
    itemType: spaceSeparated,
    kind: null,
    label: null,
    lang: null,
    language: null,
    list: null,
    loading: null,
    loop: boolean,
    low: number,
    manifest: null,
    max: null,
    maxLength: number,
    media: null,
    method: null,
    min: null,
    minLength: number,
    multiple: boolean,
    muted: boolean,
    name: null,
    nonce: null,
    noModule: boolean,
    noValidate: boolean,
    onAbort: null,
    onAfterPrint: null,
    onAuxClick: null,
    onBeforeMatch: null,
    onBeforePrint: null,
    onBeforeToggle: null,
    onBeforeUnload: null,
    onBlur: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onContextLost: null,
    onContextMenu: null,
    onContextRestored: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFormData: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLanguageChange: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadEnd: null,
    onLoadStart: null,
    onMessage: null,
    onMessageError: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRejectionHandled: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onScrollEnd: null,
    onSecurityPolicyViolation: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onSlotChange: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnhandledRejection: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onWheel: null,
    open: boolean,
    optimum: number,
    pattern: null,
    ping: spaceSeparated,
    placeholder: null,
    playsInline: boolean,
    popover: null,
    popoverTarget: null,
    popoverTargetAction: null,
    poster: null,
    preload: null,
    readOnly: boolean,
    referrerPolicy: null,
    rel: spaceSeparated,
    required: boolean,
    reversed: boolean,
    rows: number,
    rowSpan: number,
    sandbox: spaceSeparated,
    scope: null,
    scoped: boolean,
    seamless: boolean,
    selected: boolean,
    shadowRootClonable: boolean,
    shadowRootCustomElementRegistry: boolean,
    shadowRootDelegatesFocus: boolean,
    shadowRootMode: null,
    shadowRootSerializable: boolean,
    shape: null,
    size: number,
    sizes: null,
    slot: null,
    span: number,
    spellCheck: booleanish,
    src: null,
    srcDoc: null,
    srcLang: null,
    srcSet: null,
    start: number,
    step: null,
    style: null,
    tabIndex: number,
    target: null,
    title: null,
    translate: null,
    type: null,
    typeMustMatch: boolean,
    useMap: null,
    value: booleanish,
    width: number,
    wrap: null,
    writingSuggestions: null,
    // Legacy.
    // See: https://html.spec.whatwg.org/#other-elements,-attributes-and-apis
    align: null,
    // Several. Use CSS `text-align` instead,
    aLink: null,
    // `<body>`. Use CSS `a:active {color}` instead
    archive: spaceSeparated,
    // `<object>`. List of URIs to archives
    axis: null,
    // `<td>` and `<th>`. Use `scope` on `<th>`
    background: null,
    // `<body>`. Use CSS `background-image` instead
    bgColor: null,
    // `<body>` and table elements. Use CSS `background-color` instead
    border: number,
    // `<table>`. Use CSS `border-width` instead,
    borderColor: null,
    // `<table>`. Use CSS `border-color` instead,
    bottomMargin: number,
    // `<body>`
    cellPadding: null,
    // `<table>`
    cellSpacing: null,
    // `<table>`
    char: null,
    // Several table elements. When `align=char`, sets the character to align on
    charOff: null,
    // Several table elements. When `char`, offsets the alignment
    classId: null,
    // `<object>`
    clear: null,
    // `<br>`. Use CSS `clear` instead
    code: null,
    // `<object>`
    codeBase: null,
    // `<object>`
    codeType: null,
    // `<object>`
    color: null,
    // `<font>` and `<hr>`. Use CSS instead
    compact: boolean,
    // Lists. Use CSS to reduce space between items instead
    declare: boolean,
    // `<object>`
    event: null,
    // `<script>`
    face: null,
    // `<font>`. Use CSS instead
    frame: null,
    // `<table>`
    frameBorder: null,
    // `<iframe>`. Use CSS `border` instead
    hSpace: number,
    // `<img>` and `<object>`
    leftMargin: number,
    // `<body>`
    link: null,
    // `<body>`. Use CSS `a:link {color: *}` instead
    longDesc: null,
    // `<frame>`, `<iframe>`, and `<img>`. Use an `<a>`
    lowSrc: null,
    // `<img>`. Use a `<picture>`
    marginHeight: number,
    // `<body>`
    marginWidth: number,
    // `<body>`
    noResize: boolean,
    // `<frame>`
    noHref: boolean,
    // `<area>`. Use no href instead of an explicit `nohref`
    noShade: boolean,
    // `<hr>`. Use background-color and height instead of borders
    noWrap: boolean,
    // `<td>` and `<th>`
    object: null,
    // `<applet>`
    profile: null,
    // `<head>`
    prompt: null,
    // `<isindex>`
    rev: null,
    // `<link>`
    rightMargin: number,
    // `<body>`
    rules: null,
    // `<table>`
    scheme: null,
    // `<meta>`
    scrolling: booleanish,
    // `<frame>`. Use overflow in the child context
    standby: null,
    // `<object>`
    summary: null,
    // `<table>`
    text: null,
    // `<body>`. Use CSS `color` instead
    topMargin: number,
    // `<body>`
    valueType: null,
    // `<param>`
    version: null,
    // `<html>`. Use a doctype.
    vAlign: null,
    // Several. Use CSS `vertical-align` instead
    vLink: null,
    // `<body>`. Use CSS `a:visited {color}` instead
    vSpace: number,
    // `<img>` and `<object>`
    // Non-standard Properties.
    allowTransparency: null,
    autoCorrect: null,
    autoSave: null,
    credentialless: boolean,
    disablePictureInPicture: boolean,
    disableRemotePlayback: boolean,
    exportParts: commaSeparated,
    part: spaceSeparated,
    prefix: null,
    property: null,
    results: number,
    security: null,
    unselectable: null
  },
  space: "html",
  transform: caseInsensitiveTransform
});

// node_modules/property-information/lib/svg.js
var svg = create({
  attributes: {
    accentHeight: "accent-height",
    alignmentBaseline: "alignment-baseline",
    arabicForm: "arabic-form",
    baselineShift: "baseline-shift",
    capHeight: "cap-height",
    className: "class",
    clipPath: "clip-path",
    clipRule: "clip-rule",
    colorInterpolation: "color-interpolation",
    colorInterpolationFilters: "color-interpolation-filters",
    colorProfile: "color-profile",
    colorRendering: "color-rendering",
    crossOrigin: "crossorigin",
    dataType: "datatype",
    dominantBaseline: "dominant-baseline",
    enableBackground: "enable-background",
    fillOpacity: "fill-opacity",
    fillRule: "fill-rule",
    floodColor: "flood-color",
    floodOpacity: "flood-opacity",
    fontFamily: "font-family",
    fontSize: "font-size",
    fontSizeAdjust: "font-size-adjust",
    fontStretch: "font-stretch",
    fontStyle: "font-style",
    fontVariant: "font-variant",
    fontWeight: "font-weight",
    glyphName: "glyph-name",
    glyphOrientationHorizontal: "glyph-orientation-horizontal",
    glyphOrientationVertical: "glyph-orientation-vertical",
    hrefLang: "hreflang",
    horizAdvX: "horiz-adv-x",
    horizOriginX: "horiz-origin-x",
    horizOriginY: "horiz-origin-y",
    imageRendering: "image-rendering",
    letterSpacing: "letter-spacing",
    lightingColor: "lighting-color",
    markerEnd: "marker-end",
    markerMid: "marker-mid",
    markerStart: "marker-start",
    maskType: "mask-type",
    navDown: "nav-down",
    navDownLeft: "nav-down-left",
    navDownRight: "nav-down-right",
    navLeft: "nav-left",
    navNext: "nav-next",
    navPrev: "nav-prev",
    navRight: "nav-right",
    navUp: "nav-up",
    navUpLeft: "nav-up-left",
    navUpRight: "nav-up-right",
    onAbort: "onabort",
    onActivate: "onactivate",
    onAfterPrint: "onafterprint",
    onBeforePrint: "onbeforeprint",
    onBegin: "onbegin",
    onCancel: "oncancel",
    onCanPlay: "oncanplay",
    onCanPlayThrough: "oncanplaythrough",
    onChange: "onchange",
    onClick: "onclick",
    onClose: "onclose",
    onCopy: "oncopy",
    onCueChange: "oncuechange",
    onCut: "oncut",
    onDblClick: "ondblclick",
    onDrag: "ondrag",
    onDragEnd: "ondragend",
    onDragEnter: "ondragenter",
    onDragExit: "ondragexit",
    onDragLeave: "ondragleave",
    onDragOver: "ondragover",
    onDragStart: "ondragstart",
    onDrop: "ondrop",
    onDurationChange: "ondurationchange",
    onEmptied: "onemptied",
    onEnd: "onend",
    onEnded: "onended",
    onError: "onerror",
    onFocus: "onfocus",
    onFocusIn: "onfocusin",
    onFocusOut: "onfocusout",
    onHashChange: "onhashchange",
    onInput: "oninput",
    onInvalid: "oninvalid",
    onKeyDown: "onkeydown",
    onKeyPress: "onkeypress",
    onKeyUp: "onkeyup",
    onLoad: "onload",
    onLoadedData: "onloadeddata",
    onLoadedMetadata: "onloadedmetadata",
    onLoadStart: "onloadstart",
    onMessage: "onmessage",
    onMouseDown: "onmousedown",
    onMouseEnter: "onmouseenter",
    onMouseLeave: "onmouseleave",
    onMouseMove: "onmousemove",
    onMouseOut: "onmouseout",
    onMouseOver: "onmouseover",
    onMouseUp: "onmouseup",
    onMouseWheel: "onmousewheel",
    onOffline: "onoffline",
    onOnline: "ononline",
    onPageHide: "onpagehide",
    onPageShow: "onpageshow",
    onPaste: "onpaste",
    onPause: "onpause",
    onPlay: "onplay",
    onPlaying: "onplaying",
    onPopState: "onpopstate",
    onProgress: "onprogress",
    onRateChange: "onratechange",
    onRepeat: "onrepeat",
    onReset: "onreset",
    onResize: "onresize",
    onScroll: "onscroll",
    onSeeked: "onseeked",
    onSeeking: "onseeking",
    onSelect: "onselect",
    onShow: "onshow",
    onStalled: "onstalled",
    onStorage: "onstorage",
    onSubmit: "onsubmit",
    onSuspend: "onsuspend",
    onTimeUpdate: "ontimeupdate",
    onToggle: "ontoggle",
    onUnload: "onunload",
    onVolumeChange: "onvolumechange",
    onWaiting: "onwaiting",
    onZoom: "onzoom",
    overlinePosition: "overline-position",
    overlineThickness: "overline-thickness",
    paintOrder: "paint-order",
    panose1: "panose-1",
    pointerEvents: "pointer-events",
    referrerPolicy: "referrerpolicy",
    renderingIntent: "rendering-intent",
    shapeRendering: "shape-rendering",
    stopColor: "stop-color",
    stopOpacity: "stop-opacity",
    strikethroughPosition: "strikethrough-position",
    strikethroughThickness: "strikethrough-thickness",
    strokeDashArray: "stroke-dasharray",
    strokeDashOffset: "stroke-dashoffset",
    strokeLineCap: "stroke-linecap",
    strokeLineJoin: "stroke-linejoin",
    strokeMiterLimit: "stroke-miterlimit",
    strokeOpacity: "stroke-opacity",
    strokeWidth: "stroke-width",
    tabIndex: "tabindex",
    textAnchor: "text-anchor",
    textDecoration: "text-decoration",
    textRendering: "text-rendering",
    transformOrigin: "transform-origin",
    typeOf: "typeof",
    underlinePosition: "underline-position",
    underlineThickness: "underline-thickness",
    unicodeBidi: "unicode-bidi",
    unicodeRange: "unicode-range",
    unitsPerEm: "units-per-em",
    vAlphabetic: "v-alphabetic",
    vHanging: "v-hanging",
    vIdeographic: "v-ideographic",
    vMathematical: "v-mathematical",
    vectorEffect: "vector-effect",
    vertAdvY: "vert-adv-y",
    vertOriginX: "vert-origin-x",
    vertOriginY: "vert-origin-y",
    wordSpacing: "word-spacing",
    writingMode: "writing-mode",
    xHeight: "x-height",
    // These were camelcased in Tiny. Now lowercased in SVG 2
    playbackOrder: "playbackorder",
    timelineBegin: "timelinebegin"
  },
  properties: {
    about: commaOrSpaceSeparated,
    accentHeight: number,
    accumulate: null,
    additive: null,
    alignmentBaseline: null,
    alphabetic: number,
    amplitude: number,
    arabicForm: null,
    ascent: number,
    attributeName: null,
    attributeType: null,
    azimuth: number,
    bandwidth: null,
    baselineShift: null,
    baseFrequency: null,
    baseProfile: null,
    bbox: null,
    begin: null,
    bias: number,
    by: null,
    calcMode: null,
    capHeight: number,
    className: spaceSeparated,
    clip: null,
    clipPath: null,
    clipPathUnits: null,
    clipRule: null,
    color: null,
    colorInterpolation: null,
    colorInterpolationFilters: null,
    colorProfile: null,
    colorRendering: null,
    content: null,
    contentScriptType: null,
    contentStyleType: null,
    crossOrigin: null,
    cursor: null,
    cx: null,
    cy: null,
    d: null,
    dataType: null,
    defaultAction: null,
    descent: number,
    diffuseConstant: number,
    direction: null,
    display: null,
    dur: null,
    divisor: number,
    dominantBaseline: null,
    download: boolean,
    dx: null,
    dy: null,
    edgeMode: null,
    editable: null,
    elevation: number,
    enableBackground: null,
    end: null,
    event: null,
    exponent: number,
    externalResourcesRequired: null,
    fill: null,
    fillOpacity: number,
    fillRule: null,
    filter: null,
    filterRes: null,
    filterUnits: null,
    floodColor: null,
    floodOpacity: null,
    focusable: null,
    focusHighlight: null,
    fontFamily: null,
    fontSize: null,
    fontSizeAdjust: null,
    fontStretch: null,
    fontStyle: null,
    fontVariant: null,
    fontWeight: null,
    format: null,
    fr: null,
    from: null,
    fx: null,
    fy: null,
    g1: commaSeparated,
    g2: commaSeparated,
    glyphName: commaSeparated,
    glyphOrientationHorizontal: null,
    glyphOrientationVertical: null,
    glyphRef: null,
    gradientTransform: null,
    gradientUnits: null,
    handler: null,
    hanging: number,
    hatchContentUnits: null,
    hatchUnits: null,
    height: null,
    href: null,
    hrefLang: null,
    horizAdvX: number,
    horizOriginX: number,
    horizOriginY: number,
    id: null,
    ideographic: number,
    imageRendering: null,
    initialVisibility: null,
    in: null,
    in2: null,
    intercept: number,
    k: number,
    k1: number,
    k2: number,
    k3: number,
    k4: number,
    kernelMatrix: commaOrSpaceSeparated,
    kernelUnitLength: null,
    keyPoints: null,
    // SEMI_COLON_SEPARATED
    keySplines: null,
    // SEMI_COLON_SEPARATED
    keyTimes: null,
    // SEMI_COLON_SEPARATED
    kerning: null,
    lang: null,
    lengthAdjust: null,
    letterSpacing: null,
    lightingColor: null,
    limitingConeAngle: number,
    local: null,
    markerEnd: null,
    markerMid: null,
    markerStart: null,
    markerHeight: null,
    markerUnits: null,
    markerWidth: null,
    mask: null,
    maskContentUnits: null,
    maskType: null,
    maskUnits: null,
    mathematical: null,
    max: null,
    media: null,
    mediaCharacterEncoding: null,
    mediaContentEncodings: null,
    mediaSize: number,
    mediaTime: null,
    method: null,
    min: null,
    mode: null,
    name: null,
    navDown: null,
    navDownLeft: null,
    navDownRight: null,
    navLeft: null,
    navNext: null,
    navPrev: null,
    navRight: null,
    navUp: null,
    navUpLeft: null,
    navUpRight: null,
    numOctaves: null,
    observer: null,
    offset: null,
    onAbort: null,
    onActivate: null,
    onAfterPrint: null,
    onBeforePrint: null,
    onBegin: null,
    onCancel: null,
    onCanPlay: null,
    onCanPlayThrough: null,
    onChange: null,
    onClick: null,
    onClose: null,
    onCopy: null,
    onCueChange: null,
    onCut: null,
    onDblClick: null,
    onDrag: null,
    onDragEnd: null,
    onDragEnter: null,
    onDragExit: null,
    onDragLeave: null,
    onDragOver: null,
    onDragStart: null,
    onDrop: null,
    onDurationChange: null,
    onEmptied: null,
    onEnd: null,
    onEnded: null,
    onError: null,
    onFocus: null,
    onFocusIn: null,
    onFocusOut: null,
    onHashChange: null,
    onInput: null,
    onInvalid: null,
    onKeyDown: null,
    onKeyPress: null,
    onKeyUp: null,
    onLoad: null,
    onLoadedData: null,
    onLoadedMetadata: null,
    onLoadStart: null,
    onMessage: null,
    onMouseDown: null,
    onMouseEnter: null,
    onMouseLeave: null,
    onMouseMove: null,
    onMouseOut: null,
    onMouseOver: null,
    onMouseUp: null,
    onMouseWheel: null,
    onOffline: null,
    onOnline: null,
    onPageHide: null,
    onPageShow: null,
    onPaste: null,
    onPause: null,
    onPlay: null,
    onPlaying: null,
    onPopState: null,
    onProgress: null,
    onRateChange: null,
    onRepeat: null,
    onReset: null,
    onResize: null,
    onScroll: null,
    onSeeked: null,
    onSeeking: null,
    onSelect: null,
    onShow: null,
    onStalled: null,
    onStorage: null,
    onSubmit: null,
    onSuspend: null,
    onTimeUpdate: null,
    onToggle: null,
    onUnload: null,
    onVolumeChange: null,
    onWaiting: null,
    onZoom: null,
    opacity: null,
    operator: null,
    order: null,
    orient: null,
    orientation: null,
    origin: null,
    overflow: null,
    overlay: null,
    overlinePosition: number,
    overlineThickness: number,
    paintOrder: null,
    panose1: null,
    path: null,
    pathLength: number,
    patternContentUnits: null,
    patternTransform: null,
    patternUnits: null,
    phase: null,
    ping: spaceSeparated,
    pitch: null,
    playbackOrder: null,
    pointerEvents: null,
    points: null,
    pointsAtX: number,
    pointsAtY: number,
    pointsAtZ: number,
    preserveAlpha: null,
    preserveAspectRatio: null,
    primitiveUnits: null,
    propagate: null,
    property: commaOrSpaceSeparated,
    r: null,
    radius: null,
    referrerPolicy: null,
    refX: null,
    refY: null,
    rel: commaOrSpaceSeparated,
    rev: commaOrSpaceSeparated,
    renderingIntent: null,
    repeatCount: null,
    repeatDur: null,
    requiredExtensions: commaOrSpaceSeparated,
    requiredFeatures: commaOrSpaceSeparated,
    requiredFonts: commaOrSpaceSeparated,
    requiredFormats: commaOrSpaceSeparated,
    resource: null,
    restart: null,
    result: null,
    rotate: null,
    rx: null,
    ry: null,
    scale: null,
    seed: null,
    shapeRendering: null,
    side: null,
    slope: null,
    snapshotTime: null,
    specularConstant: number,
    specularExponent: number,
    spreadMethod: null,
    spacing: null,
    startOffset: null,
    stdDeviation: null,
    stemh: null,
    stemv: null,
    stitchTiles: null,
    stopColor: null,
    stopOpacity: null,
    strikethroughPosition: number,
    strikethroughThickness: number,
    string: null,
    stroke: null,
    strokeDashArray: commaOrSpaceSeparated,
    strokeDashOffset: null,
    strokeLineCap: null,
    strokeLineJoin: null,
    strokeMiterLimit: number,
    strokeOpacity: number,
    strokeWidth: null,
    style: null,
    surfaceScale: number,
    syncBehavior: null,
    syncBehaviorDefault: null,
    syncMaster: null,
    syncTolerance: null,
    syncToleranceDefault: null,
    systemLanguage: commaOrSpaceSeparated,
    tabIndex: number,
    tableValues: null,
    target: null,
    targetX: number,
    targetY: number,
    textAnchor: null,
    textDecoration: null,
    textRendering: null,
    textLength: null,
    timelineBegin: null,
    title: null,
    transformBehavior: null,
    type: null,
    typeOf: commaOrSpaceSeparated,
    to: null,
    transform: null,
    transformOrigin: null,
    u1: null,
    u2: null,
    underlinePosition: number,
    underlineThickness: number,
    unicode: null,
    unicodeBidi: null,
    unicodeRange: null,
    unitsPerEm: number,
    values: null,
    vAlphabetic: number,
    vMathematical: number,
    vectorEffect: null,
    vHanging: number,
    vIdeographic: number,
    version: null,
    vertAdvY: number,
    vertOriginX: number,
    vertOriginY: number,
    viewBox: null,
    viewTarget: null,
    visibility: null,
    width: null,
    widths: null,
    wordSpacing: null,
    writingMode: null,
    x: null,
    x1: null,
    x2: null,
    xChannelSelector: null,
    xHeight: number,
    y: null,
    y1: null,
    y2: null,
    yChannelSelector: null,
    z: null,
    zoomAndPan: null
  },
  space: "svg",
  transform: caseSensitiveTransform
});

// node_modules/property-information/lib/xlink.js
var xlink = create({
  properties: {
    xLinkActuate: null,
    xLinkArcRole: null,
    xLinkHref: null,
    xLinkRole: null,
    xLinkShow: null,
    xLinkTitle: null,
    xLinkType: null
  },
  space: "xlink",
  transform(_2, property) {
    return "xlink:" + property.slice(5).toLowerCase();
  }
});

// node_modules/property-information/lib/xmlns.js
var xmlns = create({
  attributes: { xmlnsxlink: "xmlns:xlink" },
  properties: { xmlnsXLink: null, xmlns: null },
  space: "xmlns",
  transform: caseInsensitiveTransform
});

// node_modules/property-information/lib/xml.js
var xml = create({
  properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
  space: "xml",
  transform(_2, property) {
    return "xml:" + property.slice(3).toLowerCase();
  }
});

// node_modules/property-information/lib/hast-to-react.js
var hastToReact = {
  classId: "classID",
  dataType: "datatype",
  itemId: "itemID",
  strokeDashArray: "strokeDasharray",
  strokeDashOffset: "strokeDashoffset",
  strokeLineCap: "strokeLinecap",
  strokeLineJoin: "strokeLinejoin",
  strokeMiterLimit: "strokeMiterlimit",
  typeOf: "typeof",
  xLinkActuate: "xlinkActuate",
  xLinkArcRole: "xlinkArcrole",
  xLinkHref: "xlinkHref",
  xLinkRole: "xlinkRole",
  xLinkShow: "xlinkShow",
  xLinkTitle: "xlinkTitle",
  xLinkType: "xlinkType",
  xmlnsXLink: "xmlnsXlink"
};

// node_modules/property-information/lib/find.js
var cap = /[A-Z]/g;
var dash = /-[a-z]/g;
var valid = /^data[-\w.:]+$/i;
function find(schema, value) {
  const normal = normalize(value);
  let property = value;
  let Type = Info;
  if (normal in schema.normal) {
    return schema.property[schema.normal[normal]];
  }
  if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
    if (value.charAt(4) === "-") {
      const rest = value.slice(5).replace(dash, camelcase);
      property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
    } else {
      const rest = value.slice(4);
      if (!dash.test(rest)) {
        let dashes = rest.replace(cap, kebab);
        if (dashes.charAt(0) !== "-") {
          dashes = "-" + dashes;
        }
        value = "data" + dashes;
      }
    }
    Type = DefinedInfo;
  }
  return new Type(property, value);
}
function kebab($0) {
  return "-" + $0.toLowerCase();
}
function camelcase($0) {
  return $0.charAt(1).toUpperCase();
}

// node_modules/property-information/index.js
var html2 = merge([aria, html, xlink, xmlns, xml], "html");
var svg2 = merge([aria, svg, xlink, xmlns, xml], "svg");

// node_modules/space-separated-tokens/index.js
function stringify3(values) {
  return values.join(" ").trim();
}

// node_modules/hast-util-to-jsx-runtime/lib/index.js
var import_style_to_js = __toESM(require_cjs3());
var pointStart = point("start");
function point(type) {
  return point3;
  function point3(node) {
    const point4 = node && node.position && node.position[type] || {};
    if (typeof point4.line === "number" && point4.line > 0 && typeof point4.column === "number" && point4.column > 0) {
      return {
        line: point4.line,
        column: point4.column,
        offset: typeof point4.offset === "number" && point4.offset > -1 ? point4.offset : void 0
      };
    }
  }
}

// node_modules/unist-util-stringify-position/lib/index.js
function stringifyPosition(value) {
  if (!value || typeof value !== "object") {
    return "";
  }
  if ("position" in value || "type" in value) {
    return position2(value.position);
  }
  if ("start" in value || "end" in value) {
    return position2(value);
  }
  if ("line" in value || "column" in value) {
    return point2(value);
  }
  return "";
}
function point2(point3) {
  return index(point3 && point3.line) + ":" + index(point3 && point3.column);
}
function position2(pos) {
  return point2(pos && pos.start) + "-" + point2(pos && pos.end);
}
function index(value) {
  return value && typeof value === "number" ? value : 1;
}

// node_modules/vfile-message/lib/index.js
var VFileMessage = class extends Error {
  /**
   * Create a message for `reason`.
   *
   * > 🪦 **Note**: also has obsolete signatures.
   *
   * @overload
   * @param {string} reason
   * @param {Options | null | undefined} [options]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {string} reason
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Node | NodeLike | null | undefined} parent
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {Point | Position | null | undefined} place
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @overload
   * @param {Error | VFileMessage} cause
   * @param {string | null | undefined} [origin]
   * @returns
   *
   * @param {Error | VFileMessage | string} causeOrReason
   *   Reason for message, should use markdown.
   * @param {Node | NodeLike | Options | Point | Position | string | null | undefined} [optionsOrParentOrPlace]
   *   Configuration (optional).
   * @param {string | null | undefined} [origin]
   *   Place in code where the message originates (example:
   *   `'my-package:my-rule'` or `'my-rule'`).
   * @returns
   *   Instance of `VFileMessage`.
   */
  // eslint-disable-next-line complexity
  constructor(causeOrReason, optionsOrParentOrPlace, origin) {
    super();
    if (typeof optionsOrParentOrPlace === "string") {
      origin = optionsOrParentOrPlace;
      optionsOrParentOrPlace = void 0;
    }
    let reason = "";
    let options = {};
    let legacyCause = false;
    if (optionsOrParentOrPlace) {
      if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace };
      } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
        options = { place: optionsOrParentOrPlace };
      } else if ("type" in optionsOrParentOrPlace) {
        options = {
          ancestors: [optionsOrParentOrPlace],
          place: optionsOrParentOrPlace.position
        };
      } else {
        options = { ...optionsOrParentOrPlace };
      }
    }
    if (typeof causeOrReason === "string") {
      reason = causeOrReason;
    } else if (!options.cause && causeOrReason) {
      legacyCause = true;
      reason = causeOrReason.message;
      options.cause = causeOrReason;
    }
    if (!options.ruleId && !options.source && typeof origin === "string") {
      const index2 = origin.indexOf(":");
      if (index2 === -1) {
        options.ruleId = origin;
      } else {
        options.source = origin.slice(0, index2);
        options.ruleId = origin.slice(index2 + 1);
      }
    }
    if (!options.place && options.ancestors && options.ancestors) {
      const parent = options.ancestors[options.ancestors.length - 1];
      if (parent) {
        options.place = parent.position;
      }
    }
    const start2 = options.place && "start" in options.place ? options.place.start : options.place;
    this.ancestors = options.ancestors || void 0;
    this.cause = options.cause || void 0;
    this.column = start2 ? start2.column : void 0;
    this.fatal = void 0;
    this.file = "";
    this.message = reason;
    this.line = start2 ? start2.line : void 0;
    this.name = stringifyPosition(options.place) || "1:1";
    this.place = options.place || void 0;
    this.reason = this.message;
    this.ruleId = options.ruleId || void 0;
    this.source = options.source || void 0;
    this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
    this.actual = void 0;
    this.expected = void 0;
    this.note = void 0;
    this.url = void 0;
  }
};
VFileMessage.prototype.file = "";
VFileMessage.prototype.name = "";
VFileMessage.prototype.reason = "";
VFileMessage.prototype.message = "";
VFileMessage.prototype.stack = "";
VFileMessage.prototype.column = void 0;
VFileMessage.prototype.line = void 0;
VFileMessage.prototype.ancestors = void 0;
VFileMessage.prototype.cause = void 0;
VFileMessage.prototype.fatal = void 0;
VFileMessage.prototype.place = void 0;
VFileMessage.prototype.ruleId = void 0;
VFileMessage.prototype.source = void 0;

// node_modules/hast-util-to-jsx-runtime/lib/index.js
var own = {}.hasOwnProperty;
var emptyMap = /* @__PURE__ */ new Map();
var cap2 = /[A-Z]/g;
var tableElements = /* @__PURE__ */ new Set(["table", "tbody", "thead", "tfoot", "tr"]);
var tableCellElement = /* @__PURE__ */ new Set(["td", "th"]);
var docs = "https://github.com/syntax-tree/hast-util-to-jsx-runtime";
function toJsxRuntime(tree, options) {
  if (!options || options.Fragment === void 0) {
    throw new TypeError("Expected `Fragment` in options");
  }
  const filePath = options.filePath || void 0;
  let create2;
  if (options.development) {
    if (typeof options.jsxDEV !== "function") {
      throw new TypeError(
        "Expected `jsxDEV` in options when `development: true`"
      );
    }
    create2 = developmentCreate(filePath, options.jsxDEV);
  } else {
    if (typeof options.jsx !== "function") {
      throw new TypeError("Expected `jsx` in production options");
    }
    if (typeof options.jsxs !== "function") {
      throw new TypeError("Expected `jsxs` in production options");
    }
    create2 = productionCreate(filePath, options.jsx, options.jsxs);
  }
  const state = {
    Fragment: options.Fragment,
    ancestors: [],
    components: options.components || {},
    create: create2,
    elementAttributeNameCase: options.elementAttributeNameCase || "react",
    evaluater: options.createEvaluater ? options.createEvaluater() : void 0,
    filePath,
    ignoreInvalidStyle: options.ignoreInvalidStyle || false,
    passKeys: options.passKeys !== false,
    passNode: options.passNode || false,
    schema: options.space === "svg" ? svg2 : html2,
    stylePropertyNameCase: options.stylePropertyNameCase || "dom",
    tableCellAlignToStyle: options.tableCellAlignToStyle !== false
  };
  const result = one(state, tree, void 0);
  if (result && typeof result !== "string") {
    return result;
  }
  return state.create(
    tree,
    state.Fragment,
    { children: result || void 0 },
    void 0
  );
}
function one(state, node, key) {
  if (node.type === "element") {
    return element(state, node, key);
  }
  if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
    return mdxExpression(state, node);
  }
  if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
    return mdxJsxElement(state, node, key);
  }
  if (node.type === "mdxjsEsm") {
    return mdxEsm(state, node);
  }
  if (node.type === "root") {
    return root(state, node, key);
  }
  if (node.type === "text") {
    return text(state, node);
  }
}
function element(state, node, key) {
  const parentSchema = state.schema;
  let schema = parentSchema;
  if (node.tagName.toLowerCase() === "svg" && parentSchema.space === "html") {
    schema = svg2;
    state.schema = schema;
  }
  state.ancestors.push(node);
  const type = findComponentFromName(state, node.tagName, false);
  const props = createElementProps(state, node);
  let children = createChildren(state, node);
  if (tableElements.has(node.tagName)) {
    children = children.filter(function(child) {
      return typeof child === "string" ? !whitespace(child) : true;
    });
  }
  addNode(state, props, type, node);
  addChildren(props, children);
  state.ancestors.pop();
  state.schema = parentSchema;
  return state.create(node, type, props, key);
}
function mdxExpression(state, node) {
  if (node.data && node.data.estree && state.evaluater) {
    const program = node.data.estree;
    const expression = program.body[0];
    ok(expression.type === "ExpressionStatement");
    return (
      /** @type {Child | undefined} */
      state.evaluater.evaluateExpression(expression.expression)
    );
  }
  crashEstree(state, node.position);
}
function mdxEsm(state, node) {
  if (node.data && node.data.estree && state.evaluater) {
    return (
      /** @type {Child | undefined} */
      state.evaluater.evaluateProgram(node.data.estree)
    );
  }
  crashEstree(state, node.position);
}
function mdxJsxElement(state, node, key) {
  const parentSchema = state.schema;
  let schema = parentSchema;
  if (node.name === "svg" && parentSchema.space === "html") {
    schema = svg2;
    state.schema = schema;
  }
  state.ancestors.push(node);
  const type = node.name === null ? state.Fragment : findComponentFromName(state, node.name, true);
  const props = createJsxElementProps(state, node);
  const children = createChildren(state, node);
  addNode(state, props, type, node);
  addChildren(props, children);
  state.ancestors.pop();
  state.schema = parentSchema;
  return state.create(node, type, props, key);
}
function root(state, node, key) {
  const props = {};
  addChildren(props, createChildren(state, node));
  return state.create(node, state.Fragment, props, key);
}
function text(_2, node) {
  return node.value;
}
function addNode(state, props, type, node) {
  if (typeof type !== "string" && type !== state.Fragment && state.passNode) {
    props.node = node;
  }
}
function addChildren(props, children) {
  if (children.length > 0) {
    const value = children.length > 1 ? children : children[0];
    if (value) {
      props.children = value;
    }
  }
}
function productionCreate(_2, jsx, jsxs) {
  return create2;
  function create2(_3, type, props, key) {
    const isStaticChildren = Array.isArray(props.children);
    const fn = isStaticChildren ? jsxs : jsx;
    return key ? fn(type, props, key) : fn(type, props);
  }
}
function developmentCreate(filePath, jsxDEV) {
  return create2;
  function create2(node, type, props, key) {
    const isStaticChildren = Array.isArray(props.children);
    const point3 = pointStart(node);
    return jsxDEV(
      type,
      props,
      key,
      isStaticChildren,
      {
        columnNumber: point3 ? point3.column - 1 : void 0,
        fileName: filePath,
        lineNumber: point3 ? point3.line : void 0
      },
      void 0
    );
  }
}
function createElementProps(state, node) {
  const props = {};
  let alignValue;
  let prop;
  for (prop in node.properties) {
    if (prop !== "children" && own.call(node.properties, prop)) {
      const result = createProperty(state, prop, node.properties[prop]);
      if (result) {
        const [key, value] = result;
        if (state.tableCellAlignToStyle && key === "align" && typeof value === "string" && tableCellElement.has(node.tagName)) {
          alignValue = value;
        } else {
          props[key] = value;
        }
      }
    }
  }
  if (alignValue) {
    const style = (
      /** @type {Style} */
      props.style || (props.style = {})
    );
    style[state.stylePropertyNameCase === "css" ? "text-align" : "textAlign"] = alignValue;
  }
  return props;
}
function createJsxElementProps(state, node) {
  const props = {};
  for (const attribute of node.attributes) {
    if (attribute.type === "mdxJsxExpressionAttribute") {
      if (attribute.data && attribute.data.estree && state.evaluater) {
        const program = attribute.data.estree;
        const expression = program.body[0];
        ok(expression.type === "ExpressionStatement");
        const objectExpression = expression.expression;
        ok(objectExpression.type === "ObjectExpression");
        const property = objectExpression.properties[0];
        ok(property.type === "SpreadElement");
        Object.assign(
          props,
          state.evaluater.evaluateExpression(property.argument)
        );
      } else {
        crashEstree(state, node.position);
      }
    } else {
      const name2 = attribute.name;
      let value;
      if (attribute.value && typeof attribute.value === "object") {
        if (attribute.value.data && attribute.value.data.estree && state.evaluater) {
          const program = attribute.value.data.estree;
          const expression = program.body[0];
          ok(expression.type === "ExpressionStatement");
          value = state.evaluater.evaluateExpression(expression.expression);
        } else {
          crashEstree(state, node.position);
        }
      } else {
        value = attribute.value === null ? true : attribute.value;
      }
      props[name2] = /** @type {Props[keyof Props]} */
      value;
    }
  }
  return props;
}
function createChildren(state, node) {
  const children = [];
  let index2 = -1;
  const countsByName = state.passKeys ? /* @__PURE__ */ new Map() : emptyMap;
  while (++index2 < node.children.length) {
    const child = node.children[index2];
    let key;
    if (state.passKeys) {
      const name2 = child.type === "element" ? child.tagName : child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement" ? child.name : void 0;
      if (name2) {
        const count = countsByName.get(name2) || 0;
        key = name2 + "-" + count;
        countsByName.set(name2, count + 1);
      }
    }
    const result = one(state, child, key);
    if (result !== void 0) children.push(result);
  }
  return children;
}
function createProperty(state, prop, value) {
  const info = find(state.schema, prop);
  if (value === null || value === void 0 || typeof value === "number" && Number.isNaN(value)) {
    return;
  }
  if (Array.isArray(value)) {
    value = info.commaSeparated ? stringify2(value) : stringify3(value);
  }
  if (info.property === "style") {
    let styleObject = typeof value === "object" ? value : parseStyle(state, String(value));
    if (state.stylePropertyNameCase === "css") {
      styleObject = transformStylesToCssCasing(styleObject);
    }
    return ["style", styleObject];
  }
  return [
    state.elementAttributeNameCase === "react" && info.space ? hastToReact[info.property] || info.property : info.attribute,
    value
  ];
}
function parseStyle(state, value) {
  try {
    return (0, import_style_to_js.default)(value, { reactCompat: true });
  } catch (error) {
    if (state.ignoreInvalidStyle) {
      return {};
    }
    const cause = (
      /** @type {Error} */
      error
    );
    const message = new VFileMessage("Cannot parse `style` attribute", {
      ancestors: state.ancestors,
      cause,
      ruleId: "style",
      source: "hast-util-to-jsx-runtime"
    });
    message.file = state.filePath || void 0;
    message.url = docs + "#cannot-parse-style-attribute";
    throw message;
  }
}
function findComponentFromName(state, name2, allowExpression) {
  let result;
  if (!allowExpression) {
    result = { type: "Literal", value: name2 };
  } else if (name2.includes(".")) {
    const identifiers = name2.split(".");
    let index2 = -1;
    let node;
    while (++index2 < identifiers.length) {
      const prop = name(identifiers[index2]) ? { type: "Identifier", name: identifiers[index2] } : { type: "Literal", value: identifiers[index2] };
      node = node ? {
        type: "MemberExpression",
        object: node,
        property: prop,
        computed: Boolean(index2 && prop.type === "Literal"),
        optional: false
      } : prop;
    }
    result = node;
  } else {
    result = name(name2) && !/^[a-z]/.test(name2) ? { type: "Identifier", name: name2 } : { type: "Literal", value: name2 };
  }
  if (result.type === "Literal") {
    const name3 = (
      /** @type {string | number} */
      result.value
    );
    return own.call(state.components, name3) ? state.components[name3] : name3;
  }
  if (state.evaluater) {
    return state.evaluater.evaluateExpression(result);
  }
  crashEstree(state);
}
function crashEstree(state, place) {
  const message = new VFileMessage(
    "Cannot handle MDX estrees without `createEvaluater`",
    {
      ancestors: state.ancestors,
      place,
      ruleId: "mdx-estree",
      source: "hast-util-to-jsx-runtime"
    }
  );
  message.file = state.filePath || void 0;
  message.url = docs + "#cannot-handle-mdx-estrees-without-createevaluater";
  throw message;
}
function transformStylesToCssCasing(domCasing) {
  const cssCasing = {};
  let from;
  for (from in domCasing) {
    if (own.call(domCasing, from)) {
      cssCasing[transformStyleToCssCasing(from)] = domCasing[from];
    }
  }
  return cssCasing;
}
function transformStyleToCssCasing(from) {
  let to = from.replace(cap2, toDash);
  if (to.slice(0, 3) === "ms-") to = "-" + to;
  return to;
}
function toDash($0) {
  return "-" + $0.toLowerCase();
}

// node_modules/preact/dist/preact.mjs
var n;
var l;
var u;
var w = [];
function k(l2, u3, t3) {
  var i2, r2, o2, e2 = {};
  for (o2 in u3) "key" == o2 ? i2 = u3[o2] : "ref" == o2 ? r2 = u3[o2] : e2[o2] = u3[o2];
  if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l2 && null != l2.defaultProps) for (o2 in l2.defaultProps) void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2]);
  return x(l2, e2, i2, r2, null);
}
function x(n2, t3, i2, r2, o2) {
  var e2 = { type: n2, props: t3, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u : o2, __i: -1, __u: 0 };
  return null != l.vnode && l.vnode(e2), e2;
}
function S(n2) {
  return n2.children;
}
n = w.slice, l = { __e: function(n2, l2, u3, t3) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t3 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, u = 0, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t3, n2, o2, i2, u3) {
  t3 || (t3 = {});
  var a2, c2, p2 = t3;
  if ("ref" in p2) for (c2 in p2 = {}, t3) "ref" == c2 ? a2 = t3[c2] : p2[c2] = t3[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// node_modules/@quartz-community/utils/dist/jsx.js
function childrenToString(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(childrenToString).join("");
  return String(children ?? "");
}
var builtinComponents = {
  table: (props) => /* @__PURE__ */ u2("div", { class: "table-container", children: /* @__PURE__ */ u2("table", { ...props }) }),
  style: ({ children, ...rest }) => k("style", { ...rest, dangerouslySetInnerHTML: { __html: childrenToString(children) } }),
  script: ({ children, ...rest }) => k("script", { ...rest, dangerouslySetInnerHTML: { __html: childrenToString(children) } })
};
function htmlToJsx(tree, components) {
  return toJsxRuntime(tree, {
    Fragment: S,
    jsx: u2,
    jsxs: u2,
    elementAttributeNameCase: "html",
    components: { ...builtinComponents, ...components }
  });
}

// src/components/ProjectBody.tsx
var ProjectBody_default = (() => {
  const ProjectBody = ({ fileData, tree }) => {
    const classes = fileData.frontmatter?.cssclasses ?? [];
    return /* @__PURE__ */ u2("article", { class: ["popover-hint", ...classes].join(" "), children: /* @__PURE__ */ u2("div", { class: "markdown-preview-view markdown-rendered", children: htmlToJsx(tree) }) });
  };
  return ProjectBody;
});

// src/types.ts
var defaultOptions = {
  configDir: ".obsidian",
  hideGeneratedContent: true,
  showTaskHeader: true
};
function resolveOptions(opts) {
  return { ...defaultOptions, ...opts };
}

// src/plugin.ts
var FRONTMATTER_BLOCK2 = /^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/;
function stripGeneratedContent(src) {
  const block = FRONTMATTER_BLOCK2.exec(src);
  if (!block) return src;
  installYamlCodec();
  const parsed = parseFrontmatter(src);
  if (parsed.kind !== "frontmatter") return src;
  const fm = parsed.frontmatter;
  let body;
  if (fm[FRONTMATTER_KEY] === true) {
    body = stripProjectAutoContent(parsed.body);
  } else if (fm[TASK_FRONTMATTER_KEY] === true) {
    body = parsed.body.replace(/^(?:Project|Parent): \[\[.*\]\][ \t]*$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
  } else {
    return src;
  }
  return `${block[0]}
${body}
`;
}
var isProjectPage = ({ fileData }) => {
  const fm = fileData.frontmatter;
  if (fm?.[FRONTMATTER_KEY] !== true) return false;
  const folders = String(fileData.relativePath ?? "").split("/").slice(0, -1);
  return !folders.some((segment) => segment.endsWith("_tasks"));
};
var Dotpm = (userOpts) => {
  const opts = resolveOptions(userOpts);
  return {
    name: "Dotpm",
    // Above content-page (0), so project notes take this layout; it matches content's
    // until a site configures `layout.byPageType.dotpm`.
    priority: 10,
    match: isProjectPage,
    layout: "dotpm",
    body: ProjectBody_default,
    textTransform(_ctx, src) {
      return opts.hideGeneratedContent ? stripGeneratedContent(src) : src;
    },
    async emit(ctx) {
      const written = [];
      for (const asset of VIEWER_ASSETS) {
        const out = join(ctx.argv.output, asset.path);
        await mkdir(dirname(out), { recursive: true });
        await writeFile(out, asset.content);
        written.push(out);
      }
      return written;
    },
    getQuartzComponents() {
      return [];
    }
  };
};

export { Dotpm, Dotpm as default, stripGeneratedContent };
