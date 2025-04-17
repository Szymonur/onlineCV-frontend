import { onMounted, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { _ as _export_sfc, d as useEducationStore, a as useLanguageStore } from "../main.mjs";
import "hookable";
import "vue-router";
import "pinia";
import "@vueuse/head";
import "@fortawesome/vue-fontawesome";
import "@fortawesome/free-solid-svg-icons";
const _sfc_main = {
  __name: "EducationView",
  __ssrInlineRender: true,
  setup(__props) {
    const EducationStore = useEducationStore();
    const languageStore = useLanguageStore();
    onMounted(() => {
      EducationStore.fetchData();
    });
    watch(
      () => languageStore.locale,
      () => {
        EducationStore.fetchData();
      }
    );
    const t = (key) => languageStore.currentTranslation[key] || key;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-education" }, _attrs))} data-v-8ede888f><div data-v-8ede888f>`);
      if (unref(EducationStore).loading) {
        _push(`<div data-v-8ede888f></div>`);
      } else if (unref(EducationStore).error) {
        _push(`<div data-v-8ede888f>${ssrInterpolate(unref(EducationStore).error)}</div>`);
      } else {
        _push(`<div class="education-container" data-v-8ede888f><ul data-v-8ede888f><li class="education-card" data-v-8ede888f><div data-v-8ede888f><h1 data-v-8ede888f>${ssrInterpolate(t("education"))}</h1></div><div class="education-card-right education-card-right-header" data-v-8ede888f><div data-v-8ede888f><p class="education-card-right-location" data-v-8ede888f>${ssrInterpolate(t("location"))}</p></div><div data-v-8ede888f><p class="education-card-right-date" data-v-8ede888f>${ssrInterpolate(t("date"))}</p></div></div></li><!--[-->`);
        ssrRenderList(unref(EducationStore).main, (education) => {
          _push(`<li class="education-card" data-v-8ede888f><div data-v-8ede888f><h2 data-v-8ede888f>${ssrInterpolate(education.university)}, ${ssrInterpolate(education.degree)}</h2><p data-v-8ede888f>${ssrInterpolate(education.description)}</p></div><div class="education-card-right" data-v-8ede888f><div data-v-8ede888f><p class="education-card-right-location" data-v-8ede888f>${ssrInterpolate(education.location)}</p></div><div data-v-8ede888f><p class="education-card-right-date" data-v-8ede888f>${ssrInterpolate(education.year)}</p></div></div></li>`);
        });
        _push(`<!--]--><li class="education-card" data-v-8ede888f><div class="education-card-title" data-v-8ede888f><h1 data-v-8ede888f>${ssrInterpolate(t("summer_school_courses"))}</h1><p data-v-8ede888f>( ${ssrInterpolate(t("as_participant"))} )</p></div><div class="education-card-right education-card-right-header" data-v-8ede888f><div data-v-8ede888f><p class="education-card-right-location" data-v-8ede888f>${ssrInterpolate(t("location"))}</p></div><div data-v-8ede888f><p class="education-card-right-date" data-v-8ede888f>${ssrInterpolate(t("date"))}</p></div></div></li><!--[-->`);
        ssrRenderList(unref(EducationStore).additional, (education) => {
          _push(`<li class="education-card" data-v-8ede888f><div data-v-8ede888f><h2 data-v-8ede888f>${ssrInterpolate(education.university)}, ${ssrInterpolate(education.degree)}</h2><p data-v-8ede888f>${ssrInterpolate(education.description)}</p></div><div class="education-card-right" data-v-8ede888f><div data-v-8ede888f><p class="education-card-right-location" data-v-8ede888f>${ssrInterpolate(education.location)}</p></div><div data-v-8ede888f><p class="education-card-right-date" data-v-8ede888f>${ssrInterpolate(education.year)}</p></div></div></li>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/EducationView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const EducationView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8ede888f"]]);
export {
  EducationView as default
};
