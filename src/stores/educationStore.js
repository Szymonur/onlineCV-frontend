import { defineStore } from "pinia";
import { useLanguageStore } from "./languageStore";

export const useEducationStore = defineStore("education", {
  state: () => ({
    main: [],
    additional: [],
    loading: false,
    error: null,
  }),

  getters: {
    hasData: (state) => state.main.length > 0 || state.additional.length > 0,
  },

  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${import.meta.env.VITE_SERWER}/api/educations?locale=${languageStore.locale}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN_READ_ONLY}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        const sortedData = result.data.sort((a, b) => b.year - a.year);

        this.main = sortedData.filter((item) => !item.if_additional);
        this.additional = sortedData.filter((item) => item.if_additional);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
