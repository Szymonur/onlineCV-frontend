import { unref, withCtx, createTextVNode, toDisplayString, useSSRContext, resolveComponent, mergeProps } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { RouterLink } from "vue-router";
import { _ as _export_sfc, a as useLanguageStore } from "../main.mjs";
import "hookable";
import "pinia";
import "@vueuse/head";
import "@fortawesome/vue-fontawesome";
import "@fortawesome/free-solid-svg-icons";
const _sfc_main$1 = {
  __name: "PublicationsSideNav",
  __ssrInlineRender: true,
  setup(__props) {
    const languageStore = useLanguageStore();
    const t = (key) => languageStore.currentTranslation[key] || key;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(_attrs)} data-v-635add56>`);
      _push(ssrRenderComponent(unref(RouterLink), { to: "/publications/articles" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(t("articles"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(t("articles")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/PublicationsSideNav.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const PublicationsSideNav = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-635add56"]]);
const _sfc_main = {
  __name: "PublicationsView",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterView = resolveComponent("RouterView");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-publications" }, _attrs))}>`);
      _push(ssrRenderComponent(PublicationsSideNav, null, null, _parent));
      _push(ssrRenderComponent(_component_RouterView, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/PublicationsView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
