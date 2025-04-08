import { defineStore } from "pinia";
import { useDidacticsStore } from "./didacticsStore";
import { useLanguageStore } from "./languageStore";
import { useAboutStore } from "./aboutStore";
import { useCitationsStore } from "./citationsStore";
import { useEmploymentStore } from "./employmentStore";
import { useArticlesStore } from "./articlesStore";
import { useConferenceStore } from "./conferenceStore";
import { useEducationStore } from "./educationStore";
import { useInvitedLecturesStore } from "./invitedLecturesStore";
import { useResearchGrantsStore } from "./researchGrantsStore";

export const useAppStore = defineStore("appStore", {
  state: () => ({
    initialized: false,
  }),

  actions: {
    // Załadowanie tylko podstawowych danych, np. aboutView
    async initializeBasicData() {
      const aboutStore = useAboutStore();
      const languageStore = useLanguageStore();

      // Inicjalizacja języka
      languageStore.initializeTranslations();

      // Załaduj tylko podstawowe dane (np. aboutView)
      await aboutStore.fetchData(); // Możesz użyć fetchBasicData, jeśli chcesz załadować tylko podstawowe dane.
      this.initialized = true;

      // Następnie, w tle, załaduj pozostałe dane
      this.initializeAllData();
    },

    // Załadowanie pełnych danych w tle
    async initializeAllData() {
      const stores = [
        useCitationsStore(),
        useEmploymentStore(),
        useArticlesStore(),
        useConferenceStore(),
        fetchBannerData(),
        useEducationStore(),
        useInvitedLecturesStore(),
        useResearchGrantsStore(),
        useDidacticsStore(),
      ];

      // Zrób to asynchronicznie, aby nie blokować pierwszego widoku
      await Promise.all(stores.map((store) => store.fetchData()));
      await Promise.all(useConferenceStore.fetchBannerData());
    },
    async reloadDataAfterLanguageChange() {
      const stores = [
        useAboutStore(),
        useCitationsStore(),
        useEmploymentStore(),
        useArticlesStore(),
        useConferenceStore(),
        useEducationStore(),
        useInvitedLecturesStore(),
        useResearchGrantsStore(),
        useDidacticsStore(),
      ];

      // Zrób to asynchronicznie, aby nie blokować pierwszego widoku
      await Promise.all(stores.map((store) => store.fetchData(true)));
    },
  },
});
