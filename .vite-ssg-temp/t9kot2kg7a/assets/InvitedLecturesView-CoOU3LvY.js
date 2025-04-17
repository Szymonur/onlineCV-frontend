import { onMounted, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _export_sfc, f as useInvitedLecturesStore, a as useLanguageStore } from "../main.mjs";
import "hookable";
import "vue-router";
import "pinia";
import "@vueuse/head";
import "@fortawesome/vue-fontawesome";
import "@fortawesome/free-solid-svg-icons";
const _sfc_main = {
  __name: "InvitedLecturesView",
  __ssrInlineRender: true,
  setup(__props) {
    const InvitedLectureStore = useInvitedLecturesStore();
    const languageStore = useLanguageStore();
    onMounted(() => {
      InvitedLectureStore.fetchData();
    });
    watch(
      () => languageStore.locale,
      () => {
        InvitedLectureStore.fetchData();
      }
    );
    const t = (key) => languageStore.currentTranslation[key] || key;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-invitedLectures" }, _attrs))} data-v-b9099b16><div data-v-b9099b16>`);
      if (unref(InvitedLectureStore).loading) {
        _push(`<div data-v-b9099b16></div>`);
      } else if (unref(InvitedLectureStore).error) {
        _push(`<div data-v-b9099b16>${ssrInterpolate(unref(InvitedLectureStore).error)}</div>`);
      } else {
        _push(`<div class="invitedLectures-container" data-v-b9099b16><ul data-v-b9099b16><li class="invitedLecture-card" data-v-b9099b16><div data-v-b9099b16><h1 data-v-b9099b16>${ssrInterpolate(t("invited_lectures"))}</h1></div><div class="invitedLecture-card-right invitedLecture-card-right-header" data-v-b9099b16><div data-v-b9099b16><p class="invitedLecture-card-right-date" data-v-b9099b16>${ssrInterpolate(t("date"))}</p></div></div></li><!--[-->`);
        ssrRenderList(unref(InvitedLectureStore).data, (invitedLecture) => {
          _push(`<li class="invitedLecture-card" data-v-b9099b16><div data-v-b9099b16><h2 data-v-b9099b16><a${ssrRenderAttr("href", invitedLecture.link)} target="_blank" data-v-b9099b16>${ssrInterpolate(invitedLecture.topic)}</a></h2><h2 data-v-b9099b16>${ssrInterpolate(invitedLecture.university)}</h2><p data-v-b9099b16>${ssrInterpolate(invitedLecture.description)}</p></div><div class="invitedLecture-card-right" data-v-b9099b16>`);
          if (invitedLecture.link && !invitedLecture.topic) {
            _push(`<div data-v-b9099b16><p data-v-b9099b16><a class="invitedLecture-card-right-link" data-v-b9099b16>${ssrInterpolate(_ctx.Link)} ${ssrInterpolate(t("read_more"))}</a></p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div data-v-b9099b16><p class="invitedLecture-card-right-date" data-v-b9099b16>${ssrInterpolate(invitedLecture.date)}</p></div></div></li>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/InvitedLecturesView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const InvitedLecturesView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b9099b16"]]);
export {
  InvitedLecturesView as default
};
