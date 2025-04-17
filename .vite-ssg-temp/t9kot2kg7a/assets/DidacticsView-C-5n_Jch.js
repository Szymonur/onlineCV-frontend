import { ref, watch, useSSRContext, onMounted, mergeProps, unref, nextTick } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc, a as useLanguageStore, g as useDidacticsStore } from "../main.mjs";
import { useRoute } from "vue-router";
import "hookable";
import "pinia";
import "@vueuse/head";
import "@fortawesome/vue-fontawesome";
import "@fortawesome/free-solid-svg-icons";
const _sfc_main$1 = {
  __name: "DidacticsSideNav",
  __ssrInlineRender: true,
  props: {
    links: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    useLanguageStore();
    const activeSlug = ref(null);
    const route = useRoute();
    watch(
      () => route.hash,
      (newHash) => {
        activeSlug.value = (newHash == null ? void 0 : newHash.replace("#", "")) || null;
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(_attrs)} data-v-0a8b7822><!--[-->`);
      ssrRenderList(props.links, (link) => {
        _push(`<a${ssrRenderAttr("id", link.slug)}${ssrRenderAttr("href", "#" + link.slug)} class="${ssrRenderClass({ active: activeSlug.value === link.slug })}" data-v-0a8b7822>${ssrInterpolate(link.name)}</a>`);
      });
      _push(`<!--]--></nav>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/DidacticsSideNav.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const DidacticsSideNav = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0a8b7822"]]);
const _sfc_main = {
  __name: "DidacticsView",
  __ssrInlineRender: true,
  setup(__props) {
    const DidacticsStore = useDidacticsStore();
    const languageStore = useLanguageStore();
    const activeSection = ref(null);
    const scrollToSection = async (slug) => {
      await nextTick();
      const section = document.getElementById(slug);
      if (section) {
        activeSection.value = slug;
        history.pushState(null, "", `#${slug}`);
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    const setActiveSection = async () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        scrollToSection(hash);
      }
    };
    onMounted(() => {
      DidacticsStore.fetchData();
      setActiveSection();
      window.addEventListener("hashchange", setActiveSection);
    });
    onMounted(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              activeSection.value = entry.target.id;
              history.replaceState(null, "", `#${entry.target.id}`);
            }
          }
        },
        { threshold: 0.6 }
        // Sekcja jest aktywna, jeśli przynajmniej 60% jest widoczne
      );
      document.querySelectorAll(".didactics-section").forEach((section) => {
        observer.observe(section);
      });
    });
    watch(
      () => languageStore.locale,
      () => {
        DidacticsStore.fetchData();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-didactics" }, _attrs))} data-v-1cd15b60><div data-v-1cd15b60>`);
      if (unref(DidacticsStore).loading) {
        _push(`<div data-v-1cd15b60></div>`);
      } else if (unref(DidacticsStore).error) {
        _push(`<div data-v-1cd15b60>${ssrInterpolate(unref(DidacticsStore).error)}</div>`);
      } else {
        _push(`<div class="didactics-container" data-v-1cd15b60>`);
        _push(ssrRenderComponent(DidacticsSideNav, {
          links: unref(DidacticsStore).groupedData
        }, null, _parent));
        _push(`<div class="didactics-content" data-v-1cd15b60><!--[-->`);
        ssrRenderList(unref(DidacticsStore).groupedData, (group, slug) => {
          _push(`<div${ssrRenderAttr("id", slug)} class="${ssrRenderClass([{ active: activeSection.value === slug }, "didactics-section"])}" data-v-1cd15b60><h1 data-v-1cd15b60>${ssrInterpolate(group.name)}</h1><ul data-v-1cd15b60><!--[-->`);
          ssrRenderList(group.items, (item) => {
            _push(`<li data-v-1cd15b60><p data-v-1cd15b60>${ssrInterpolate(item.name)}</p><a${ssrRenderAttr("href", item.link)} data-v-1cd15b60>Sylabus</a></li>`);
          });
          _push(`<!--]--></ul></div>`);
        });
        _push(`<!--]--></div></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/DidacticsView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DidacticsView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1cd15b60"]]);
export {
  DidacticsView as default
};
