import { defineStore } from "pinia";

export const useLanguageStore = defineStore("language", {
  state: () => ({
    locale: typeof window !== "undefined" ? localStorage.getItem("locale") || "en" : "en",
    translations: {},
  }),

  actions: {
    setLanguage(lang) {
      this.locale = lang;
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", lang);
      }
      this.loadTranslations(lang);
    },

    loadTranslations(lang) {
      import(`@/assets/lang/${lang}.json`)
        .then((module) => {
          this.translations = module.default;
        })
        .catch((err) => {
          console.error(`Error loading language: ${lang}`, err);
        });
    },

    initializeTranslations() {
      this.loadTranslations(this.locale);
    },
  },

  getters: {
    currentTranslation: (state) => state.translations,
  },
});
