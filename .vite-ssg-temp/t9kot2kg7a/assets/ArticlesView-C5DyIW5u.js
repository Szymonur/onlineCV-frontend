import { ref, onMounted, onUnmounted, watch, mergeProps, useSSRContext, unref } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc, b as useArticlesStore, a as useLanguageStore } from "../main.mjs";
import * as d3 from "d3";
import cloud from "d3-cloud";
import "hookable";
import "vue-router";
import "pinia";
import "@vueuse/head";
import "@fortawesome/vue-fontawesome";
import "@fortawesome/free-solid-svg-icons";
const width = 200;
const _sfc_main$1 = {
  __name: "WordCloud",
  __ssrInlineRender: true,
  props: {
    keywords: Array
  },
  setup(__props) {
    const props = __props;
    const svgRef = ref(null);
    const height = ref(window.innerWidth <= 768 ? 90 : 130);
    const drawWordCloud = () => {
      if (!props.keywords || props.keywords.length === 0) return;
      const fontSizeScale = d3.scaleLinear().domain([1, Math.max(...props.keywords.map((d) => d.value))]).range([10, 20]);
      const layout = cloud().size([width, height.value]).words(props.keywords.map((d) => ({ text: d.text, size: fontSizeScale(d.value) }))).padding(2).rotate(() => Math.random() > 0.4 ? 0 : 90).fontSize((d) => d.size).on("end", renderCloud);
      layout.start();
      function renderCloud(words) {
        const svg = d3.select(svgRef.value);
        svg.selectAll("*").remove();
        const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height.value / 2})`);
        g.selectAll("text").data(words).enter().append("text").style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)]).style("font-size", (d) => `${d.size}px`).attr("text-anchor", "middle").attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`).text((d) => d.text);
      }
    };
    const updateHeight = () => {
      height.value = window.innerWidth <= 768 ? 90 : 130;
      drawWordCloud();
    };
    onMounted(() => {
      drawWordCloud();
      window.addEventListener("resize", updateHeight);
    });
    onUnmounted(() => {
      window.removeEventListener("resize", updateHeight);
    });
    watch(() => props.keywords, drawWordCloud, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        ref_key: "svgRef",
        ref: svgRef,
        width,
        height: height.value
      }, _attrs))} data-v-d0572150></svg>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/WordCloud.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const WordCloud = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d0572150"]]);
const _sfc_main = {
  __name: "ArticlesView",
  __ssrInlineRender: true,
  setup(__props) {
    const ArticlesStore = useArticlesStore();
    const languageStore = useLanguageStore();
    onMounted(() => {
      ArticlesStore.fetchData();
    });
    const t = (key) => languageStore.currentTranslation[key] || key;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-articles" }, _attrs))} data-v-8b20a025><div data-v-8b20a025>`);
      if (unref(ArticlesStore).loading) {
        _push(`<div data-v-8b20a025></div>`);
      } else if (unref(ArticlesStore).error) {
        _push(`<div data-v-8b20a025>${ssrInterpolate(unref(ArticlesStore).error)}</div>`);
      } else {
        _push(`<div class="articles-container" data-v-8b20a025><ul data-v-8b20a025><li class="article-card" data-v-8b20a025><div data-v-8b20a025><h1 data-v-8b20a025>${ssrInterpolate(t("articles"))}</h1></div><div class="article-card-right-header mobile-do-not-display" data-v-8b20a025><div data-v-8b20a025><p data-v-8b20a025>${ssrInterpolate(t("year"))}</p></div></div></li><!--[-->`);
        ssrRenderList(unref(ArticlesStore).data, (article) => {
          _push(`<li class="article-card" data-v-8b20a025><div data-v-8b20a025><h2 data-v-8b20a025><a${ssrRenderAttr("href", article.link)} target="_blank" data-v-8b20a025>${ssrInterpolate(article.title)}</a></h2><p data-v-8b20a025>${ssrInterpolate(article.authors)}</p><p data-v-8b20a025>${ssrInterpolate(article.publication)}</p></div><div class="article-card-right" data-v-8b20a025><div data-v-8b20a025>`);
          if (article.keywords) {
            _push(ssrRenderComponent(WordCloud, {
              keywords: article.keywords
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="mobile-do-not-display" data-v-8b20a025><p data-v-8b20a025>${ssrInterpolate(article.year)}</p></div></div></li>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/ArticlesView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ArticlesView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8b20a025"]]);
export {
  ArticlesView as default
};
