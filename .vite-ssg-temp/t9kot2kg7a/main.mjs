import { createHooks } from "hookable";
import { toValue, isRef, defineComponent, ref, onMounted, createSSRApp, useSSRContext, computed, onUnmounted, mergeProps, unref, withCtx, createTextVNode, toDisplayString, watch } from "vue";
import { createRouter, createMemoryHistory, RouterLink, RouterView, createWebHistory } from "vue-router";
import { defineStore, createPinia } from "pinia";
import { useHead, createHead as createHead$2 } from "@vueuse/head";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
const DupeableTags = /* @__PURE__ */ new Set(["link", "style", "script", "noscript"]);
const TagsWithInnerContent = /* @__PURE__ */ new Set(["title", "titleTemplate", "script", "style", "noscript"]);
const ValidHeadTags = /* @__PURE__ */ new Set([
  "title",
  "base",
  "htmlAttrs",
  "bodyAttrs",
  "meta",
  "link",
  "style",
  "script",
  "noscript"
]);
const UniqueTags = /* @__PURE__ */ new Set(["base", "title", "titleTemplate", "bodyAttrs", "htmlAttrs", "templateParams"]);
const TagConfigKeys = /* @__PURE__ */ new Set(["key", "tagPosition", "tagPriority", "tagDuplicateStrategy", "innerHTML", "textContent", "processTemplateParams"]);
const UsesMergeStrategy = /* @__PURE__ */ new Set(["templateParams", "htmlAttrs", "bodyAttrs"]);
const MetaTagsArrayable = /* @__PURE__ */ new Set([
  "theme-color",
  "google-site-verification",
  "og",
  "article",
  "book",
  "profile",
  "twitter",
  "author"
]);
const allowedMetaProperties = ["name", "property", "http-equiv"];
function isMetaArrayDupeKey(v) {
  const k = v.split(":")[1];
  return MetaTagsArrayable.has(k);
}
function dedupeKey(tag) {
  const { props, tag: name } = tag;
  if (UniqueTags.has(name))
    return name;
  if (name === "link" && props.rel === "canonical")
    return "canonical";
  if (props.charset)
    return "charset";
  if (tag.tag === "meta") {
    for (const n of allowedMetaProperties) {
      if (props[n] !== void 0) {
        return `${name}:${props[n]}`;
      }
    }
  }
  if (tag.key) {
    return `${name}:key:${tag.key}`;
  }
  if (props.id) {
    return `${name}:id:${props.id}`;
  }
  if (TagsWithInnerContent.has(name)) {
    const v = tag.textContent || tag.innerHTML;
    if (v) {
      return `${name}:content:${v}`;
    }
  }
}
function walkResolver(val, resolve, key) {
  const type = typeof val;
  if (type === "function") {
    if (!key || key !== "titleTemplate" && !(key[0] === "o" && key[1] === "n")) {
      val = val();
    }
  }
  let v;
  if (resolve) {
    v = resolve(key, val);
  }
  if (Array.isArray(v)) {
    return v.map((r) => walkResolver(r, resolve));
  }
  if ((v == null ? void 0 : v.constructor) === Object) {
    const next = {};
    for (const key2 of Object.keys(v)) {
      next[key2] = walkResolver(v[key2], resolve, key2);
    }
    return next;
  }
  return v;
}
function normalizeStyleClassProps(key, value) {
  const store = key === "style" ? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Set();
  function processValue(rawValue) {
    const value2 = rawValue.trim();
    if (!value2)
      return;
    if (key === "style") {
      const [k, ...v] = value2.split(":").map((s) => s.trim());
      if (k && v.length)
        store.set(k, v.join(":"));
    } else {
      value2.split(" ").filter(Boolean).forEach((c) => store.add(c));
    }
  }
  if (typeof value === "string") {
    key === "style" ? value.split(";").forEach(processValue) : processValue(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => processValue(item));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      if (v && v !== "false") {
        key === "style" ? store.set(k.trim(), v) : processValue(k);
      }
    });
  }
  return store;
}
function normalizeProps(tag, input) {
  tag.props = tag.props || {};
  if (!input) {
    return tag;
  }
  Object.entries(input).forEach(([key, value]) => {
    if (value === null) {
      tag.props[key] = null;
      return;
    }
    if (key === "class" || key === "style") {
      tag.props[key] = normalizeStyleClassProps(key, value);
      return;
    }
    if (TagConfigKeys.has(key)) {
      if (["textContent", "innerHTML"].includes(key) && typeof value === "object") {
        let type = input.type;
        if (!input.type) {
          type = "application/json";
        }
        if (!(type == null ? void 0 : type.endsWith("json")) && type !== "speculationrules") {
          return;
        }
        input.type = type;
        tag.props.type = type;
        tag[key] = JSON.stringify(value);
      } else {
        tag[key] = value;
      }
      return;
    }
    const strValue = String(value);
    const isDataKey = key.startsWith("data-");
    if (strValue === "true" || strValue === "") {
      tag.props[key] = isDataKey ? strValue : true;
    } else if (!value && isDataKey && strValue === "false") {
      tag.props[key] = "false";
    } else if (value !== void 0) {
      tag.props[key] = value;
    }
  });
  return tag;
}
function normalizeTag(tagName, _input) {
  const input = typeof _input === "object" && typeof _input !== "function" ? _input : { [tagName === "script" || tagName === "noscript" || tagName === "style" ? "innerHTML" : "textContent"]: _input };
  const tag = normalizeProps({ tag: tagName, props: {} }, input);
  if (tag.key && DupeableTags.has(tag.tag)) {
    tag.props["data-hid"] = tag._h = tag.key;
  }
  if (tag.tag === "script" && typeof tag.innerHTML === "object") {
    tag.innerHTML = JSON.stringify(tag.innerHTML);
    tag.props.type = tag.props.type || "application/json";
  }
  return Array.isArray(tag.props.content) ? tag.props.content.map((v) => ({ ...tag, props: { ...tag.props, content: v } })) : tag;
}
function normalizeEntryToTags(input, propResolvers) {
  if (!input) {
    return [];
  }
  if (typeof input === "function") {
    input = input();
  }
  const resolvers = (key, val) => {
    for (let i = 0; i < propResolvers.length; i++) {
      val = propResolvers[i](key, val);
    }
    return val;
  };
  input = resolvers(void 0, input);
  const tags = [];
  input = walkResolver(input, resolvers);
  Object.entries(input || {}).forEach(([key, value]) => {
    if (value === void 0)
      return;
    for (const v of Array.isArray(value) ? value : [value])
      tags.push(normalizeTag(key, v));
  });
  return tags.flat();
}
const sortTags = (a, b) => a._w === b._w ? a._p - b._p : a._w - b._w;
const TAG_WEIGHTS = {
  base: -10,
  title: 10
};
const TAG_ALIASES = {
  critical: -8,
  high: -1,
  low: 2
};
const WEIGHT_MAP = {
  meta: {
    "content-security-policy": -30,
    "charset": -20,
    "viewport": -15
  },
  link: {
    "preconnect": 20,
    "stylesheet": 60,
    "preload": 70,
    "modulepreload": 70,
    "prefetch": 90,
    "dns-prefetch": 90,
    "prerender": 90
  },
  script: {
    async: 30,
    defer: 80,
    sync: 50
  },
  style: {
    imported: 40,
    sync: 60
  }
};
const ImportStyleRe = /@import/;
const isTruthy = (val) => val === "" || val === true;
function tagWeight(head, tag) {
  var _a;
  if (typeof tag.tagPriority === "number")
    return tag.tagPriority;
  let weight = 100;
  const offset = TAG_ALIASES[tag.tagPriority] || 0;
  const weightMap = head.resolvedOptions.disableCapoSorting ? {
    link: {},
    script: {},
    style: {}
  } : WEIGHT_MAP;
  if (tag.tag in TAG_WEIGHTS) {
    weight = TAG_WEIGHTS[tag.tag];
  } else if (tag.tag === "meta") {
    const metaType = tag.props["http-equiv"] === "content-security-policy" ? "content-security-policy" : tag.props.charset ? "charset" : tag.props.name === "viewport" ? "viewport" : null;
    if (metaType)
      weight = WEIGHT_MAP.meta[metaType];
  } else if (tag.tag === "link" && tag.props.rel) {
    weight = weightMap.link[tag.props.rel];
  } else if (tag.tag === "script") {
    if (isTruthy(tag.props.async)) {
      weight = weightMap.script.async;
    } else if (tag.props.src && !isTruthy(tag.props.defer) && !isTruthy(tag.props.async) && tag.props.type !== "module" && !((_a = tag.props.type) == null ? void 0 : _a.endsWith("json"))) {
      weight = weightMap.script.sync;
    } else if (isTruthy(tag.props.defer) && tag.props.src && !isTruthy(tag.props.async)) {
      weight = weightMap.script.defer;
    }
  } else if (tag.tag === "style") {
    weight = tag.innerHTML && ImportStyleRe.test(tag.innerHTML) ? weightMap.style.imported : weightMap.style.sync;
  }
  return (weight || 100) + offset;
}
function registerPlugin(head, p) {
  const plugin = typeof p === "function" ? p(head) : p;
  const key = plugin.key || String(head.plugins.size + 1);
  const exists = head.plugins.get(key);
  if (!exists) {
    head.plugins.set(key, plugin);
    head.hooks.addHooks(plugin.hooks || {});
  }
}
// @__NO_SIDE_EFFECTS__
function createUnhead(resolvedOptions = {}) {
  var _a;
  const hooks = createHooks();
  hooks.addHooks(resolvedOptions.hooks || {});
  const ssr = !resolvedOptions.document;
  const entries = /* @__PURE__ */ new Map();
  const plugins = /* @__PURE__ */ new Map();
  const normalizeQueue = [];
  const head = {
    _entryCount: 1,
    // 0 is reserved for internal use
    plugins,
    dirty: false,
    resolvedOptions,
    hooks,
    ssr,
    entries,
    headEntries() {
      return [...entries.values()];
    },
    use: (p) => registerPlugin(head, p),
    push(input, _options) {
      const options = { ..._options || {} };
      delete options.head;
      const _i = options._index ?? head._entryCount++;
      const inst = { _i, input, options };
      const _ = {
        _poll(rm = false) {
          head.dirty = true;
          !rm && normalizeQueue.push(_i);
          hooks.callHook("entries:updated", head);
        },
        dispose() {
          if (entries.delete(_i)) {
            _._poll(true);
          }
        },
        // a patch is the same as creating a new entry, just a nice DX
        patch(input2) {
          if (!options.mode || options.mode === "server" && ssr || options.mode === "client" && !ssr) {
            inst.input = input2;
            entries.set(_i, inst);
            _._poll();
          }
        }
      };
      _.patch(input);
      return _;
    },
    async resolveTags() {
      var _a2;
      const ctx = {
        tagMap: /* @__PURE__ */ new Map(),
        tags: [],
        entries: [...head.entries.values()]
      };
      await hooks.callHook("entries:resolve", ctx);
      while (normalizeQueue.length) {
        const i = normalizeQueue.shift();
        const e = entries.get(i);
        if (e) {
          const normalizeCtx = {
            tags: normalizeEntryToTags(e.input, resolvedOptions.propResolvers || []).map((t) => Object.assign(t, e.options)),
            entry: e
          };
          await hooks.callHook("entries:normalize", normalizeCtx);
          e._tags = normalizeCtx.tags.map((t, i2) => {
            t._w = tagWeight(head, t);
            t._p = (e._i << 10) + i2;
            t._d = dedupeKey(t);
            return t;
          });
        }
      }
      let hasFlatMeta = false;
      ctx.entries.flatMap((e) => (e._tags || []).map((t) => ({ ...t, props: { ...t.props } }))).sort(sortTags).reduce((acc, next) => {
        const k = String(next._d || next._p);
        if (!acc.has(k))
          return acc.set(k, next);
        const prev = acc.get(k);
        const strategy = (next == null ? void 0 : next.tagDuplicateStrategy) || (UsesMergeStrategy.has(next.tag) ? "merge" : null) || (next.key && next.key === prev.key ? "merge" : null);
        if (strategy === "merge") {
          const newProps = { ...prev.props };
          Object.entries(next.props).forEach(([p, v]) => (
            // @ts-expect-error untyped
            newProps[p] = p === "style" ? new Map([...prev.props.style || /* @__PURE__ */ new Map(), ...v]) : p === "class" ? /* @__PURE__ */ new Set([...prev.props.class || /* @__PURE__ */ new Set(), ...v]) : v
          ));
          acc.set(k, { ...next, props: newProps });
        } else if (next._p >> 10 === prev._p >> 10 && isMetaArrayDupeKey(next._d)) {
          acc.set(k, Object.assign([...Array.isArray(prev) ? prev : [prev], next], next));
          hasFlatMeta = true;
        } else if (next._w === prev._w ? next._p > prev._p : (next == null ? void 0 : next._w) < (prev == null ? void 0 : prev._w)) {
          acc.set(k, next);
        }
        return acc;
      }, ctx.tagMap);
      const title = ctx.tagMap.get("title");
      const titleTemplate = ctx.tagMap.get("titleTemplate");
      head._title = title == null ? void 0 : title.textContent;
      if (titleTemplate) {
        const titleTemplateFn = titleTemplate == null ? void 0 : titleTemplate.textContent;
        head._titleTemplate = titleTemplateFn;
        if (titleTemplateFn) {
          let newTitle = typeof titleTemplateFn === "function" ? titleTemplateFn(title == null ? void 0 : title.textContent) : titleTemplateFn;
          if (typeof newTitle === "string" && !head.plugins.has("template-params")) {
            newTitle = newTitle.replace("%s", (title == null ? void 0 : title.textContent) || "");
          }
          if (title) {
            newTitle === null ? ctx.tagMap.delete("title") : ctx.tagMap.set("title", { ...title, textContent: newTitle });
          } else {
            titleTemplate.tag = "title";
            titleTemplate.textContent = newTitle;
          }
        }
      }
      ctx.tags = Array.from(ctx.tagMap.values());
      if (hasFlatMeta) {
        ctx.tags = ctx.tags.flat().sort(sortTags);
      }
      await hooks.callHook("tags:beforeResolve", ctx);
      await hooks.callHook("tags:resolve", ctx);
      await hooks.callHook("tags:afterResolve", ctx);
      const finalTags = [];
      for (const t of ctx.tags) {
        const { innerHTML, tag, props } = t;
        if (!ValidHeadTags.has(tag)) {
          continue;
        }
        if (Object.keys(props).length === 0 && !t.innerHTML && !t.textContent) {
          continue;
        }
        if (tag === "meta" && !props.content && !props["http-equiv"] && !props.charset) {
          continue;
        }
        if (tag === "script" && innerHTML) {
          if ((_a2 = props.type) == null ? void 0 : _a2.endsWith("json")) {
            const v = typeof innerHTML === "string" ? innerHTML : JSON.stringify(innerHTML);
            t.innerHTML = v.replace(/</g, "\\u003C");
          } else if (typeof innerHTML === "string") {
            t.innerHTML = innerHTML.replace(new RegExp(`</${tag}`, "g"), `<\\/${tag}`);
          }
          t._d = dedupeKey(t);
        }
        finalTags.push(t);
      }
      return finalTags;
    }
  };
  ((resolvedOptions == null ? void 0 : resolvedOptions.plugins) || []).forEach((p) => registerPlugin(head, p));
  head.hooks.callHook("init", head);
  (_a = resolvedOptions.init) == null ? void 0 : _a.forEach((e) => e && head.push(e));
  return head;
}
const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};
const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}
// @__NO_SIDE_EFFECTS__
function createHead$1(options = {}) {
  const unhead = /* @__PURE__ */ createUnhead({
    ...options,
    // @ts-expect-error untyped
    document: false,
    propResolvers: [
      ...options.propResolvers || [],
      (k, v) => {
        if (k && k.startsWith("on") && typeof v === "function") {
          return `this.dataset.${k}fired = true`;
        }
        return v;
      }
    ],
    init: [
      options.disableDefaults ? void 0 : {
        htmlAttrs: {
          lang: "en"
        },
        meta: [
          {
            charset: "utf-8"
          },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          }
        ]
      },
      ...options.init || []
    ]
  });
  unhead._ssrPayload = {};
  unhead.use({
    key: "server",
    hooks: {
      "tags:resolve": function(ctx) {
        const title = ctx.tagMap.get("title");
        const titleTemplate = ctx.tagMap.get("titleTemplate");
        let payload = {
          title: (title == null ? void 0 : title.mode) === "server" ? unhead._title : void 0,
          titleTemplate: (titleTemplate == null ? void 0 : titleTemplate.mode) === "server" ? unhead._titleTemplate : void 0
        };
        if (Object.keys(unhead._ssrPayload || {}).length > 0) {
          payload = {
            ...unhead._ssrPayload,
            ...payload
          };
        }
        if (Object.values(payload).some(Boolean)) {
          ctx.tags.push({
            tag: "script",
            innerHTML: JSON.stringify(payload),
            props: { id: "unhead:payload", type: "application/json" }
          });
        }
      }
    }
  });
  return unhead;
}
function createHead(options = {}) {
  const head = /* @__PURE__ */ createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}
const ClientOnly = defineComponent({
  setup(props, { slots }) {
    const mounted = ref(false);
    onMounted(() => mounted.value = true);
    return () => {
      if (!mounted.value)
        return slots.placeholder && slots.placeholder({});
      return slots.default && slots.default({});
    };
  }
});
function ViteSSG(App, routerOptions, fn, options) {
  const {
    transformState,
    registerComponents = true,
    useHead: useHead2 = true,
    rootContainer = "#app"
  } = {};
  async function createApp$1(_client = false, routePath) {
    const app = createSSRApp(App);
    let head;
    if (useHead2) {
      app.use(head = createHead());
    }
    const router = createRouter({
      history: createMemoryHistory(routerOptions.base),
      ...routerOptions
    });
    const { routes: routes2 } = routerOptions;
    if (registerComponents)
      app.component("ClientOnly", ClientOnly);
    const appRenderCallbacks = [];
    const onSSRAppRendered = (cb) => appRenderCallbacks.push(cb);
    const triggerOnSSRAppRendered = () => {
      return Promise.all(appRenderCallbacks.map((cb) => cb()));
    };
    const context = {
      app,
      head,
      isClient: false,
      router,
      routes: routes2,
      onSSRAppRendered,
      triggerOnSSRAppRendered,
      initialState: {},
      transformState,
      routePath
    };
    await (fn == null ? void 0 : fn(context));
    app.use(router);
    let entryRoutePath;
    let isFirstRoute = true;
    router.beforeEach((to, from, next) => {
      if (isFirstRoute || entryRoutePath && entryRoutePath === to.path) {
        isFirstRoute = false;
        entryRoutePath = to.path;
        to.meta.state = context.initialState;
      }
      next();
    });
    {
      const route = context.routePath ?? "/";
      router.push(route);
      await router.isReady();
      context.initialState = router.currentRoute.value.meta.state || {};
    }
    const initialState = context.initialState;
    return {
      ...context,
      initialState
    };
  }
  return createApp$1;
}
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const useLanguageStore = defineStore("language", {
  state: () => ({
    locale: localStorage.getItem("locale") || "en",
    translations: {}
  }),
  actions: {
    setLanguage(lang) {
      this.locale = lang;
      localStorage.setItem("locale", lang);
      this.loadTranslations(lang);
    },
    loadTranslations(lang) {
      __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "../assets/lang/en.json": () => import("./assets/en-CxhKQXwH.js"), "../assets/lang/pl.json": () => import("./assets/pl-CLd4Iudr.js") }), `../assets/lang/${lang}.json`, 4).then((module) => {
        this.translations = module.default;
      }).catch((err) => {
        console.error(`Error loading language: ${lang}`, err);
      });
    },
    initializeTranslations() {
      this.loadTranslations(this.locale);
    }
  },
  getters: {
    currentTranslation: (state) => state.translations
  }
});
const useResearchGrantsStore = defineStore("researchGrant", {
  state: () => ({
    data: [],
    loading: false,
    error: null
  }),
  getters: {
    hasData: (state) => state.data.length > 0
  },
  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `${"http://localhost:1337"}/api/research-grants?locale=${languageStore.locale}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${"5fabb51032dc77a56c429e5d74796d22b105cfb73b94516397ad24e646621f4445c5864d84281d85f45ba94eabc02927a1a017e4be69961fa37ddefaca3e745f32d555feb6adeabf4262048a0f94e7cacac0cca7c9296f3b2a6f15ecd0c00c76ad253e86b8309a4a45a2ba85f96eba88e5538b9c73eaaed5109ee49b3ea0557d"}`
            }
          }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        this.data = result.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$3 = {
  __name: "LanguageSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const languageStore = useLanguageStore();
    useResearchGrantsStore();
    const isOpen = ref(false);
    const dropdownRef = ref(null);
    const languages = [
      { code: "en", label: "🇬🇧 English" },
      { code: "pl", label: "🇵🇱 Polski" }
    ];
    const currentLanguage = computed(() => languages.find((lang) => lang.code === languageStore.locale) || languages[0]);
    const closeDropdown = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
      }
    };
    onMounted(() => {
      document.addEventListener("click", closeDropdown);
    });
    onUnmounted(() => {
      document.removeEventListener("click", closeDropdown);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "language-switcher",
        ref_key: "dropdownRef",
        ref: dropdownRef
      }, _attrs))} data-v-3768bd51><button class="current-language" data-v-3768bd51>${ssrInterpolate(currentLanguage.value.label)} `);
      _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: unref(faChevronDown) }, null, _parent));
      _push(`</button>`);
      if (isOpen.value) {
        _push(`<ul class="dropdown" data-v-3768bd51><!--[-->`);
        ssrRenderList(languages, (lang) => {
          _push(`<li data-v-3768bd51>${ssrInterpolate(lang.label)}</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/LanguageSwitcher.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const LanguageSwitcher = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3768bd51"]]);
const _sfc_main$2 = {
  __name: "NavBar",
  __ssrInlineRender: true,
  setup(__props) {
    const languageStore = useLanguageStore();
    const t = (key) => languageStore.currentTranslation[key] || key;
    const isMenuOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(_attrs)} data-v-a7085474><div class="menu-toggle" data-v-a7085474><span class="${ssrRenderClass({ open: isMenuOpen.value })}" data-v-a7085474></span><span class="${ssrRenderClass({ open: isMenuOpen.value })}" data-v-a7085474></span><span class="${ssrRenderClass({ open: isMenuOpen.value })}" data-v-a7085474></span></div><div class="${ssrRenderClass([{ open: isMenuOpen.value }, "menu-links"])}" data-v-a7085474>`);
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/about",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("about"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("about")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/publications",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("publicatons"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("publicatons")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/research_grants",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("research_grants"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("research_grants")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/conferences",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("conferences"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("conferences")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/education",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("education"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("education")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/employment",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("employment"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("employment")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/invited_lectures",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("invited_lectures"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("invited_lectures")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/didactics",
        onClick: ($event) => isMenuOpen.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("didactics"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("didactics")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(LanguageSwitcher, null, null, _parent));
      _push(`</nav>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/NavBar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const NavBar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-a7085474"]]);
const useDidacticsStore = defineStore("didacticsStore", {
  state: () => ({
    data: [],
    groupedData: {},
    loading: false,
    error: null
  }),
  getters: {
    hasData: (state) => state.data.length > 0
  },
  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${"http://localhost:1337"}/api/didactics?locale=${languageStore.locale}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${"5fabb51032dc77a56c429e5d74796d22b105cfb73b94516397ad24e646621f4445c5864d84281d85f45ba94eabc02927a1a017e4be69961fa37ddefaca3e745f32d555feb6adeabf4262048a0f94e7cacac0cca7c9296f3b2a6f15ecd0c00c76ad253e86b8309a4a45a2ba85f96eba88e5538b9c73eaaed5109ee49b3ea0557d"}`
          }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        this.data = result.data;
        this.groupedData = this.groupByType(this.data);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Groups the fetched data by "type" and generates a slug for each group.
     * @param {Array} data - The fetched data array.
     * @returns {Object} - Grouped data with slugs.
     */
    groupByType(data) {
      const grouped = {};
      data.forEach((item) => {
        const typeKey = this.createSlug(item.type);
        if (!grouped[typeKey]) {
          grouped[typeKey] = {
            slug: typeKey,
            name: item.type,
            // Preserve the original type name
            items: []
          };
        }
        grouped[typeKey].items.push(item);
      });
      return grouped;
    },
    /**
     * Creates a slug from a given string by removing white spaces, case differences, and special characters.
     * @param {string} text - The input string.
     * @returns {string} - A slugified version of the input.
     */
    createSlug(text) {
      const polishMap = {
        ą: "a",
        ć: "c",
        ę: "e",
        ł: "l",
        ń: "n",
        ó: "o",
        ś: "s",
        ź: "z",
        ż: "z"
      };
      return text.toLowerCase().replace(/[ąćęłńóśźż]/g, (match) => polishMap[match]).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    }
  }
});
const useAboutStore = defineStore("dataStore", {
  state: () => ({
    data: [],
    loading: false,
    error: null
  }),
  getters: {
    hasData: (state) => state.data.length > 0
  },
  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `${"http://localhost:1337"}/api/abouts?populate=profile_picture&locale=${languageStore.locale}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${"5fabb51032dc77a56c429e5d74796d22b105cfb73b94516397ad24e646621f4445c5864d84281d85f45ba94eabc02927a1a017e4be69961fa37ddefaca3e745f32d555feb6adeabf4262048a0f94e7cacac0cca7c9296f3b2a6f15ecd0c00c76ad253e86b8309a4a45a2ba85f96eba88e5538b9c73eaaed5109ee49b3ea0557d"}`
            }
          }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        this.data = result.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
const useCitationsStore = defineStore("citationsStore.", {
  state: () => ({
    data: [],
    loading: false,
    error: null
  }),
  getters: {
    hasData: (state) => state.data.length > 0
  },
  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/googleScholar.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        this.data = {
          co_authors: result.co_authors,
          table: result.cited_by.table,
          graph: result.cited_by.graph
        };
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
const useEmploymentStore = defineStore("employment", {
  state: () => ({
    main: [],
    additional: [],
    loading: false,
    error: null
  }),
  getters: {
    hasData: (state) => state.main.length > 0 || state.additional.length > 0
  },
  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${"http://localhost:1337"}/api/employments?locale=${languageStore.locale}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${"5fabb51032dc77a56c429e5d74796d22b105cfb73b94516397ad24e646621f4445c5864d84281d85f45ba94eabc02927a1a017e4be69961fa37ddefaca3e745f32d555feb6adeabf4262048a0f94e7cacac0cca7c9296f3b2a6f15ecd0c00c76ad253e86b8309a4a45a2ba85f96eba88e5538b9c73eaaed5109ee49b3ea0557d"}`
          }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        const sortedData = result.data.sort((a, b) => {
          const getYearValue = (year) => {
            const match = year.match(/\d{4}/g);
            return match ? parseInt(match[match.length - 1], 10) : 0;
          };
          return getYearValue(b.year) - getYearValue(a.year);
        });
        this.main = sortedData.filter((item) => !item.is_additional);
        this.additional = sortedData.filter((item) => item.is_additional);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
const useArticlesStore = defineStore("articlesStore", {
  state: () => ({
    data: [],
    loading: false,
    error: null
  }),
  getters: {
    hasData: (state) => state.data.length > 0
  },
  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("/googleScholar.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        this.data = result.articles;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
const useConferenceStore = defineStore("conference", {
  state: () => ({
    data: [],
    bannerData: null,
    loading: false,
    error: null
  }),
  getters: {
    hasData: (state) => state.data.length > 0,
    hasBanner: (state) => !!state.bannerData
  },
  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${"http://localhost:1337"}/api/conferences?locale=${languageStore.locale}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${"5fabb51032dc77a56c429e5d74796d22b105cfb73b94516397ad24e646621f4445c5864d84281d85f45ba94eabc02927a1a017e4be69961fa37ddefaca3e745f32d555feb6adeabf4262048a0f94e7cacac0cca7c9296f3b2a6f15ecd0c00c76ad253e86b8309a4a45a2ba85f96eba88e5538b9c73eaaed5109ee49b3ea0557d"}`
          }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        this.data = result.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchBannerData() {
      if (this.hasData) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${"http://localhost:1337"}/api/conference-baner?populate=image`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${"5fabb51032dc77a56c429e5d74796d22b105cfb73b94516397ad24e646621f4445c5864d84281d85f45ba94eabc02927a1a017e4be69961fa37ddefaca3e745f32d555feb6adeabf4262048a0f94e7cacac0cca7c9296f3b2a6f15ecd0c00c76ad253e86b8309a4a45a2ba85f96eba88e5538b9c73eaaed5109ee49b3ea0557d"}`
          }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        this.bannerData = result.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
const useEducationStore = defineStore("education", {
  state: () => ({
    main: [],
    additional: [],
    loading: false,
    error: null
  }),
  getters: {
    hasData: (state) => state.main.length > 0 || state.additional.length > 0
  },
  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${"http://localhost:1337"}/api/educations?locale=${languageStore.locale}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${"5fabb51032dc77a56c429e5d74796d22b105cfb73b94516397ad24e646621f4445c5864d84281d85f45ba94eabc02927a1a017e4be69961fa37ddefaca3e745f32d555feb6adeabf4262048a0f94e7cacac0cca7c9296f3b2a6f15ecd0c00c76ad253e86b8309a4a45a2ba85f96eba88e5538b9c73eaaed5109ee49b3ea0557d"}`
          }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        const sortedData = result.data.sort((a, b) => b.year - a.year);
        this.main = sortedData.filter((item) => !item.if_additional);
        this.additional = sortedData.filter((item) => item.if_additional);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
const useInvitedLecturesStore = defineStore("invitedLecture", {
  state: () => ({
    data: [],
    loading: false,
    error: null
  }),
  getters: {
    hasData: (state) => state.data.length > 0
  },
  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `${"http://localhost:1337"}/api/invited-lectures?locale=${languageStore.locale}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${"5fabb51032dc77a56c429e5d74796d22b105cfb73b94516397ad24e646621f4445c5864d84281d85f45ba94eabc02927a1a017e4be69961fa37ddefaca3e745f32d555feb6adeabf4262048a0f94e7cacac0cca7c9296f3b2a6f15ecd0c00c76ad253e86b8309a4a45a2ba85f96eba88e5538b9c73eaaed5109ee49b3ea0557d"}`
            }
          }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        this.data = result.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
});
const useAppStore = defineStore("appStore", {
  state: () => ({
    initialized: false
  }),
  actions: {
    // Załadowanie tylko podstawowych danych, np. aboutView
    async initializeBasicData() {
      const aboutStore = useAboutStore();
      const languageStore = useLanguageStore();
      languageStore.initializeTranslations();
      await aboutStore.fetchData();
      this.initialized = true;
      this.initializeAllData();
    },
    // Załadowanie pełnych danych w tle
    async initializeAllData() {
      const stores = [
        useCitationsStore(),
        useEmploymentStore(),
        useArticlesStore(),
        useConferenceStore(),
        useEducationStore(),
        useInvitedLecturesStore(),
        useResearchGrantsStore(),
        useDidacticsStore()
      ];
      await Promise.all([...stores.map((store) => store.fetchData()), useConferenceStore().fetchBannerData()]);
    },
    async reloadDataAfterLanguageChange() {
      const stores = [
        useAboutStore(),
        useCitationsStore(),
        useEmploymentStore(),
        useArticlesStore(),
        useConferenceStore(),
        useEducationStore(),
        useInvitedLecturesStore(),
        useResearchGrantsStore(),
        useDidacticsStore()
      ];
      await Promise.all(stores.map((store) => store.fetchData(true)));
    }
  }
});
const authorName = "Szymon Urban";
const authorLink = "https://www.linkedin.com/in/urban-szymon/";
const _sfc_main$1 = {
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-7bb62378><p data-v-7bb62378> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} <a${ssrRenderAttr("href", authorLink)} target="_blank" rel="noopener" class="author-link" data-v-7bb62378>${ssrInterpolate(authorName)}</a>. All rights reserved. </p></footer>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Footer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-7bb62378"]]);
const _sfc_main = {
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Jakub Isański | UAM Professor ",
      meta: []
    });
    const languageStore = useLanguageStore();
    const appStore = useAppStore();
    onMounted(() => {
      languageStore.initializeTranslations();
      appStore.initializeBasicData();
    });
    watch(
      () => languageStore.locale,
      () => {
        appStore.reloadDataAfterLanguageChange();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(NavBar, null, null, _parent));
      _push(`<div class="wrapper">`);
      _push(ssrRenderComponent(unref(RouterView), null, null, _parent));
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const routes = [
  {
    path: "/",
    name: "home",
    redirect: "/about"
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./assets/AboutView-DXBJp3Ar.js")
  },
  {
    path: "/publications",
    name: "publications",
    redirect: "/publications/articles",
    component: () => import("./assets/PublicationsView-BDuD2YGN.js"),
    children: [
      {
        path: "articles",
        name: "articles",
        component: () => import("./assets/ArticlesView-C5DyIW5u.js")
      }
    ]
  },
  {
    path: "/conferences",
    name: "conferences",
    component: () => import("./assets/ConferencesView-B1DDecDM.js")
  },
  {
    path: "/education",
    name: "education",
    component: () => import("./assets/EducationView-QpxrYw5F.js")
  },
  {
    path: "/employment",
    name: "employment",
    component: () => import("./assets/EmploymentView-w09PIIy2.js")
  },
  {
    path: "/invited_lectures",
    name: "invited_lectures",
    component: () => import("./assets/InvitedLecturesView-CoOU3LvY.js")
  },
  {
    path: "/didactics",
    name: "didactics",
    component: () => import("./assets/DidacticsView-C-5n_Jch.js")
  },
  {
    path: "/research_grants",
    name: "research_grants",
    component: () => import("./assets/ResearchGrantsView-CUQk15RZ.js")
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/about"
  }
];
createRouter({
  history: createWebHistory("/"),
  routes
});
const createApp = ViteSSG(_sfc_main, { routes }, ({ app, router, isClient }) => {
  app.use(createPinia());
  app.use(createHead$2());
  {
    generateSitemap({
      hostname: "https://jakubisanski.pl",
      routes
    });
  }
});
export {
  _export_sfc as _,
  useLanguageStore as a,
  useArticlesStore as b,
  useConferenceStore as c,
  createApp,
  useEducationStore as d,
  useEmploymentStore as e,
  useInvitedLecturesStore as f,
  useDidacticsStore as g,
  useResearchGrantsStore as h,
  useAboutStore as u
};
