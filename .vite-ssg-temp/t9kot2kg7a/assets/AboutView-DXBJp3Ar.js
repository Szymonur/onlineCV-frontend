import { onMounted, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc, u as useAboutStore, a as useLanguageStore } from "../main.mjs";
import { useHead } from "@vueuse/head";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "hookable";
import "vue-router";
import "pinia";
const _imports_0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABOUlEQVQ4jZWTMUjDQBSGv8QiCEWqiCAI6uAiCEkm69LObh2bpYqrBXdXHQXBWTRLHd3cxNihsUvSQQrioIUMIiKtdBIEhyT1cjam/afj/fd/j3vcU5BUc/PbQAUoSpYNWKbhXIhFRQguA1eAJkMltYCSaTgvAKoQ9gCtrDdYX9jl/bObBNAAL8wEgLBzLqWzqFyYQQnffB45Yue56V/m5ESWr+++DNrJEAxsoGqhzcPrGbePx5T1Ruy236vT7ByKoIrK32nHdHq3xqW3yc3THjNTqxiL+6JdVJOCst76LvedI1Zmt2L1kQERRNZYgPmsMRRgjxreWDrg+eNaLNsZwOKfQVYL7cHZ79Vx/RPRthSAmpv3SP/Cslqm4ejRDEpA4t8dom6YCYYYLoZOsCipnQE9WiZFdsdd5x8hkmC+WkW8FAAAAABJRU5ErkJggg==";
const _imports_1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAANlBMVEXz8/MTHh4BAgImKir///////8EFxdHcEz////////g4eG7vLxPUFB9f3+XmJhmZ2fP0NCrrKz4eZRPAAAACnRSTlP3////Jf//AHkY0pPABAAABTpJREFUeJztm4uyoyAMhoFsbasi+P4vu4By0QZEwDqzW07nXDxT+PwJIYmUPJ/vF3nc0sjr/XyS55+bhjcIf57kfeP4iuBNXneO/3i8yK0CKAluHl8R/AB+AD+AH8C/DZDR+3UA/cCFEJwP/R0AZBiZal2nv4/D1wF6wRiltOs6qn8wIb8LMIAZ3DX1R1SEKwAGRtdhqfkyv8cILgCQsIzJqDJBTplBoBCZhfYAZFzGt6Ynx0UQ+BbAbMZjwvVMuJkNNn8JAMz9i7BjzsxSQMdqDiC1ALsZJ8CAR6ywOYBeApSJ7cV5irrD5gDcAODz/RUAYVZg3PNdDUCEsfj0BnQpgPECLL/bawAiTuf/AaB3A3gF+iFo6Nq8WIGZhQ1bGxcrMOjAyLbvAdAPgCVAuEEBOwUmMssGIP2+STlsmuxj4DsFJF8anFJAssNGRz5LFB73A4KeUUBv6fSodQxGZJPFXXFih8ABloh2E1ivV4KryqwZ3/eJD0VEdIdAr80TV4lNSODF76iP+RUC7LwLEdhsL1iof4yuApVc+fFhDBoA8xCwD/WWgGQXf/VmYsZTAHo67Y2yadObnETn9KFs3PQxGQC+7cqkKnR38RDAZjh7AAPBA1PYaLAEpVsoEyZ1eJyWdEQiCuDzDZMDhB2avGj7DnMnAGiYlATgLA6g5tUSbENAbiSggRUMlO4xMwFslokCqBSE2VkIFe+NBOo96w2TidGoHzwCoEmANQvd577zUhhg4zT0cpjGdXzUBA8AJEAK4DE5M9jIy61wat47tuLgidkBQA9JBez/P9w8t1UBWDuI3v8hQFqBh3ALdet55o0fVS57iju8NEBagbin6Ll2l53Z1BiIRJ5Sp0DvAD7WWD/zkep9W8QT0wyAAwUIWJkxP28Cm1T/GQAHCjxGuxBPZAKnAA4U8ADoTtcAIFcBdhVApgKJdV4JcKCANcIEYiXAgQLSLcP8ksg5gAMFZrcjFyc4dQoI6waKTaBOgX6NTeOl6GqAtAI2MKSxvbYeIKmApPhe2BIgpUB6I2gEkFCgB7sG8XC3DUBcARcU11jgMUBMATJb/c/UhQsAcAX62ecEtNgJZwGsCghdFFmLJSrQBmaT09r7z1MgzM5Nhm63INqNxXtAJoAbalMcWa+xLh7stgLYlEl2DdLRZhsAa+uwvXt1gQ9tKnyZCqiJ16/OJ8Qt7j4DwK4CWzB0mUiV+z0BsPoBv937sk2V/8sGgD2AdItgbDMJZxVwMUBXHoeeAfhQwKWDrezwtAKuKoEkpBcAfCqwFh3NSqjdBzIAEAVcUUA54waTcF4BHYyjpaFLADAFQjusn4QSBR6TlSB6MqQZAKqAPSZiioEXA+AKuKS0Ji3OA8AVcFXkXVH4AoCIAn4SlBnUxQWFCgTOoHItFirgCsLVZlCqgI8MKr1BsQK+WF/nkssV8PWZquCkXAE1CW4tVvijgwcWNLXz+6D5qjrhsPr8/VM4Bxg8PSxdCkkAO8sxgOCZTbFHTD+2W3uH6KYn/HPkwjg9BeCCr3gEHGSPlBa5gxRAIHDU4Xsz0E65YFuIv6Wfgr7ZiJ6X0AS085bYnU+Y8WOW/TAJ2B1hEHwaJNK/hMASGYiDo9w5ACrmY2w7/HJegqGmRjgL0nZ9pPoMAg4AQLEGAKitD2NwsIJCA4ClFGRepirQMVcmwg8BDGI93aFPt5zK2fAzJPqokNyfJVoOpMU616f5zQkPETs/mw9Q3IhuZ9/TEqCk/QB+AD+AH8D9ADcTkPs/+Hz7R79v//D73R///wsGpEdMfec+FAAAAABJRU5ErkJggg==";
const _sfc_main = {
  __name: "AboutView",
  __ssrInlineRender: true,
  setup(__props) {
    const dataStore = useAboutStore();
    const serverUrl = "http://localhost:1337";
    const languageStore = useLanguageStore();
    onMounted(() => {
      dataStore.fetchData();
    });
    watch(
      () => languageStore.locale,
      () => {
        dataStore.fetchData();
      }
    );
    useHead({
      title: "O mnie - Jakub Isański",
      meta: [
        { name: "description", content: "Dowiedz się więcej o Jakubie Isańskim i jego działalności naukowej." },
        { property: "og:title", content: "O mnie - Jakub Isański" },
        // OpenGraph Title
        { property: "og:description", content: "Dowiedz się o moich badaniach i publikacjach." },
        // OpenGraph Description
        { property: "og:url", content: "https://twojastrona.pl/about" }
        // URL podstrony w OpenGraph
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-about" }, _attrs))} data-v-ca5b40e2><div class="c-about-container" data-v-ca5b40e2>`);
      if (unref(dataStore).loading) {
        _push(`<div data-v-ca5b40e2></div>`);
      } else if (unref(dataStore).error) {
        _push(`<div class="error" data-v-ca5b40e2>Błąd: ${ssrInterpolate(unref(dataStore).error)}</div>`);
      } else if (!unref(dataStore).hasData) {
        _push(`<div data-v-ca5b40e2>Brak dostępnych danych.</div>`);
      } else {
        _push(`<div class="c-about-content" data-v-ca5b40e2><div class="c-about-top" data-v-ca5b40e2><div class="c-about-img" data-v-ca5b40e2><img${ssrRenderAttr("src", unref(serverUrl) + unref(dataStore).data[0].profile_picture.url)} alt="" data-v-ca5b40e2></div><div class="c-about-top-data" data-v-ca5b40e2><h1 data-v-ca5b40e2>${ssrInterpolate(unref(dataStore).data[0].name)}</h1><h2 data-v-ca5b40e2>${ssrInterpolate(unref(dataStore).data[0].title)}</h2><h2 data-v-ca5b40e2>${ssrInterpolate(unref(dataStore).data[0].department)}</h2><div class="c-about-top-contact" data-v-ca5b40e2>`);
        if (unref(dataStore).data[0].email) {
          _push(`<a${ssrRenderAttr("href", "mailto:" + unref(dataStore).data[0].email)} class="flex items-center gap-2" data-v-ca5b40e2>`);
          _push(ssrRenderComponent(unref(FontAwesomeIcon), {
            icon: unref(faEnvelope),
            class: "icon"
          }, null, _parent));
          _push(` ${ssrInterpolate(unref(dataStore).data[0].email)}</a>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(dataStore).data[0].orcid) {
          _push(`<a${ssrRenderAttr("href", "https://orcid.org/" + unref(dataStore).data[0].orcid)} target="_blank" class="flex items-center gap-2" data-v-ca5b40e2><img${ssrRenderAttr("src", _imports_0)} alt="" data-v-ca5b40e2> ORCID ${ssrInterpolate(unref(dataStore).data[0].orcid)}</a>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(dataStore).data[0].researchgate) {
          _push(`<a${ssrRenderAttr("href", unref(dataStore).data[0].researchgate)} target="_blank" class="flex items-center gap-2" data-v-ca5b40e2><img${ssrRenderAttr("src", _imports_1)} alt="" data-v-ca5b40e2> ResearchGate </a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="c-about-description" data-v-ca5b40e2>${ssrInterpolate(unref(dataStore).data[0].description)}</div></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/views/AboutView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AboutView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ca5b40e2"]]);
export {
  AboutView as default
};
