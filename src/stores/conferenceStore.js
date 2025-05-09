import { defineStore } from "pinia";
import { useLanguageStore } from "./languageStore";

export const useConferenceStore = defineStore("conference", {
  state: () => ({
    data: [],
    bannerData: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasData: (state) => state.data.length > 0,
    hasBanner: (state) => !!state.bannerData,
  },

  actions: {
    async fetchData(isLanguageChanged) {
      if (this.hasData && !isLanguageChanged) return;
      const languageStore = useLanguageStore();
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${import.meta.env.VITE_SERWER}/api/conferences?locale=${languageStore.locale}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN_READ_ONLY}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();

        // Sortowanie po dacie (od najnowszej do najstarszej)
        this.data = result.data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
      } catch (err) {
        this.error = erdr.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchBannerData() {
      if (this.hasData) return;
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${import.meta.env.VITE_SERWER}/api/conference-baner?populate=image`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN_READ_ONLY}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        this.bannerData = result.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
