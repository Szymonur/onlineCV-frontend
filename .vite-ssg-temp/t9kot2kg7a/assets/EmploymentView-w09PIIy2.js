import { onMounted, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _export_sfc, e as useEmploymentStore, a as useLanguageStore } from "../main.mjs";
import "hookable";
import "vue-router";
import "pinia";
import "@vueuse/head";
import "@fortawesome/vue-fontawesome";
import "@fortawesome/free-solid-svg-icons";
const _sfc_main = {
  __name: "EmploymentView",
  __ssrInlineRender: true,
  setup(__props) {
    const EmploymentStore = useEmploymentStore();
    const languageStore = useLanguageStore();
    onMounted(() => {
      EmploymentStore.fetchData();
    });
    watch(
      () => languageStore.locale,
      () => {
        EmploymentStore.fetchData();
      }
    );
    const t = (key) => languageStore.currentTranslation[key] || key;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-Employment" }, _attrs))} data-v-f6bc7747><div data-v-f6bc7747>`);
      if (unref(EmploymentStore).loading) {
        _push(`<div data-v-f6bc7747></div>`);
      } else if (unref(EmploymentStore).error) {
        _push(`<div data-v-f6bc7747>${ssrInterpolate(unref(EmploymentStore).error)}</div>`);
      } else {
        _push(`<div class="Employment-container" data-v-f6bc7747><ul data-v-f6bc7747><li class="Employment-card" data-v-f6bc7747><div data-v-f6bc7747><h1 data-v-f6bc7747>${ssrInterpolate(t("employment"))}</h1></div><div class="Employment-card-right Employment-card-right-header" data-v-f6bc7747><div data-v-f6bc7747><p class="Employment-card-right-location" data-v-f6bc7747>${ssrInterpolate(t("location"))}</p></div><div data-v-f6bc7747><p class="Employment-card-right-date" data-v-f6bc7747>${ssrInterpolate(t("date"))}</p></div></div></li><!--[-->`);
        ssrRenderList(unref(EmploymentStore).main, (Employment) => {
          _push(`<li class="Employment-card" data-v-f6bc7747><div data-v-f6bc7747><h2 data-v-f6bc7747>${ssrInterpolate(Employment.role)}, ${ssrInterpolate(Employment.company)}</h2><p data-v-f6bc7747>${ssrInterpolate(Employment.description)}</p></div><div class="Employment-card-right" data-v-f6bc7747><div data-v-f6bc7747><p class="Employment-card-right-location" data-v-f6bc7747>${ssrInterpolate(Employment.location)}</p></div><div data-v-f6bc7747><p class="Employment-card-right-date" data-v-f6bc7747>${ssrInterpolate(Employment.year)}</p></div></div></li>`);
        });
        _push(`<!--]--><li class="Employment-card" data-v-f6bc7747><div class="Employment-card-title" data-v-f6bc7747><h1 data-v-f6bc7747>${ssrInterpolate(t("summer_school_courses"))}</h1><p data-v-f6bc7747>( ${ssrInterpolate(t("as_lecturer"))} )</p></div><div class="Employment-card-right Employment-card-right-header" data-v-f6bc7747><div data-v-f6bc7747><p class="Employment-card-right-location" data-v-f6bc7747>${ssrInterpolate(t("location"))}</p></div><div data-v-f6bc7747><p class="Employment-card-right-date" data-v-f6bc7747>${ssrInterpolate(t("date"))}</p></div></div></li><!--[-->`);
        ssrRenderList(unref(EmploymentStore).additional, (Employment) => {
          _push(`<li class="Employment-card" data-v-f6bc7747><div data-v-f6bc7747><h2 data-v-f6bc7747>${ssrInterpolate(Employment.role)}, ${ssrInterpolate(Employment.company)}</h2><p data-v-f6bc7747>${ssrInterpolate(Employment.description)}</p></div><div class="Employment-card-right" data-v-f6bc7747><div data-v-f6bc7747><p class="Employment-card-right-location" data-v-f6bc7747>${ssrInterpolate(Employment.location)}</p></div><div data-v-f6bc7747><p class="Employment-card-right-date" data-v-f6bc7747>${ssrInterpolate(Employment.year)}</p></div></div></li>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/EmploymentView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EmploymentView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f6bc7747"]]);
export {
  EmploymentView as default
};
