import { defineStore } from 'pinia';

export const useDataStore = defineStore('dataStore', {
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
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch('http://localhost:1337/api/abouts'); // Replace with your API URL
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        this.data = result.data; // Assuming the API response has a "data" array
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
