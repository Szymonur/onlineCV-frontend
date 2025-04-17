import { onMounted, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { h as useResearchGrantsStore, a as useLanguageStore } from "../main.mjs";
import "hookable";
import "vue-router";
import "pinia";
import "@vueuse/head";
import "@fortawesome/vue-fontawesome";
import "@fortawesome/free-solid-svg-icons";
const _sfc_main = {
  __name: "ResearchGrantsView",
  __ssrInlineRender: true,
  setup(__props) {
    const ResearchGrantStore = useResearchGrantsStore();
    const languageStore = useLanguageStore();
    onMounted(() => {
      ResearchGrantStore.fetchData();
    });
    watch(
      () => languageStore.locale,
      () => {
        ResearchGrantStore.fetchData();
      }
    );
    const t = (key) => languageStore.currentTranslation[key] || key;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-research-projects" }, _attrs))}><div>`);
      if (unref(ResearchGrantStore).loading) {
        _push(`<div></div>`);
      } else if (unref(ResearchGrantStore).error) {
        _push(`<div>${ssrInterpolate(unref(ResearchGrantStore).error)}</div>`);
      } else {
        _push(`<div class="projects-container"><ul><li class="project-card"><h1>${ssrInterpolate(t("research_grants"))}</h1></li><!--[-->`);
        ssrRenderList(unref(ResearchGrantStore).data, (grant) => {
          _push(`<li class="project-card"><h2>&quot;${ssrInterpolate(grant.title)}&quot;</h2><div class="project-card-date">${ssrInterpolate(grant.date)}</div>`);
          if (grant.description) {
            _push(`<div class="project-card-description">${ssrInterpolate(grant.description)}</div>`);
          } else {
            _push(`<div>${ssrInterpolate(t("noDescription"))}</div>`);
          }
          _push(`<div>${ssrInterpolate(grant.role)}</div></li>`);
        });
        _push(`<!--]--></ul></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ResearchGrantsView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
