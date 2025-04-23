import { defineStore } from "pinia";

export const useArticlesStore = defineStore("articles", {
  state: () => ({
    data: [],
    loading: false,
    error: null,
  }),

  getters: {
    hasData: (state) => state.data.length > 0,
  },

  actions: {
    async fetchData() {
      if (this.hasData) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERWER}/api/articles?populate=citations&populate=keywords`,
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
          const aC = a.attributes.citations || {};
          const bC = b.attributes.citations || {};

          const aGS = aC.googleScholar || 0;
          const bGS = bC.googleScholar || 0;

          const aWoS = aC.webOfScience || 0;
          const bWoS = bC.webOfScience || 0;

          const aScopus = aC.scopus || 0;
          const bScopus = bC.scopus || 0;

          // sortuj po googleScholar
          if (aGS !== bGS) return bGS - aGS;
          // jeśli równe, to po webOfScience
          if (aWoS !== bWoS) return bWoS - aWoS;
          // jeśli dalej równe, to po scopus
          return bScopus - aScopus;
        });
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
