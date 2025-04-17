import { onMounted, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { _ as _export_sfc, c as useConferenceStore, a as useLanguageStore } from "../main.mjs";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import "hookable";
import "vue-router";
import "pinia";
import "@vueuse/head";
const _sfc_main = {
  __name: "ConferencesView",
  __ssrInlineRender: true,
  setup(__props) {
    const ConferenceStore = useConferenceStore();
    const languageStore = useLanguageStore();
    const serverUrl = "http://localhost:1337";
    onMounted(() => {
      ConferenceStore.fetchData();
      ConferenceStore.fetchBannerData();
    });
    watch(
      () => languageStore.locale,
      () => {
        ConferenceStore.fetchData();
      }
    );
    const t = (key) => languageStore.currentTranslation[key] || key;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-conferences" }, _attrs))} data-v-3d6d86a6><div data-v-3d6d86a6>`);
      if (unref(ConferenceStore).loading) {
        _push(`<div data-v-3d6d86a6></div>`);
      } else if (unref(ConferenceStore).error) {
        _push(`<div data-v-3d6d86a6>${ssrInterpolate(unref(ConferenceStore).error)}</div>`);
      } else {
        _push(`<div data-v-3d6d86a6>`);
        if (unref(ConferenceStore).bannerData && unref(ConferenceStore).bannerData.image) {
          _push(`<div class="conferences-baner" data-v-3d6d86a6><img${ssrRenderAttr("src", unref(serverUrl) + unref(ConferenceStore).bannerData.image.url)} alt="Conference Banner" data-v-3d6d86a6><div class="mobile-do-not-display scroll-button" data-v-3d6d86a6>`);
          _push(ssrRenderComponent(unref(FontAwesomeIcon), { icon: unref(faArrowDown) }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div id="content-section" class="conferences-container" data-v-3d6d86a6><ul data-v-3d6d86a6><li class="conference-card" data-v-3d6d86a6><div data-v-3d6d86a6><h1 data-v-3d6d86a6>${ssrInterpolate(t("conferences"))}</h1></div><div class="conference-card-right conference-card-right-header" data-v-3d6d86a6><div data-v-3d6d86a6><p class="mobile-do-not-display conference-card-right-date" data-v-3d6d86a6>${ssrInterpolate(t("date"))}</p></div></div></li><!--[-->`);
        ssrRenderList(unref(ConferenceStore).data, (conference) => {
          _push(`<li class="conference-card" data-v-3d6d86a6><div data-v-3d6d86a6><h2 data-v-3d6d86a6>${ssrInterpolate(conference.name)}</h2><p data-v-3d6d86a6>${ssrInterpolate(conference.topic)}</p></div><div class="conference-card-right" data-v-3d6d86a6>`);
          if (conference.link) {
            _push(`<div data-v-3d6d86a6><p data-v-3d6d86a6><a class="conference-card-right-link"${ssrRenderAttr("href", conference.link)} target="_blank" data-v-3d6d86a6>${ssrInterpolate(t("read_more"))}</a></p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div data-v-3d6d86a6><p class="conference-card-right-date" data-v-3d6d86a6>${ssrInterpolate(conference.date)}</p></div></div></li>`);
        });
        _push(`<!--]--></ul></div></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ConferencesView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ConferencesView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3d6d86a6"]]);
export {
  ConferencesView as default
};
