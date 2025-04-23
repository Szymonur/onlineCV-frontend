import { defineStore } from "pinia";
import { useLanguageStore } from "./languageStore";

export const useResearchGrantsStore = defineStore("researchGrant", {
  state: () => ({
    data: [],
    loading: false,
    error: null,
  }),

  getters: {
    hasData: (state) => state.data.length > 0,
  },

  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERWER}/api/research-grants?locale=${languageStore.locale}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN_READ_ONLY}`,
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();

        this.data = result.data.sort((a, b) => {
          const parseDate = (entry) => {
            const match = entry.date.match(/^(\d{4})(?:-(\d{4}))?$/);
            if (!match) return { start: 0, end: 0 };
            const start = parseInt(match[1]);
            const end = match[2] ? parseInt(match[2]) : start;
            return { start, end };
          };

          const aDate = parseDate(a);
          const bDate = parseDate(b);

          if (bDate.end !== aDate.end) return bDate.end - aDate.end;
          return aDate.start - bDate.start;
        });
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
