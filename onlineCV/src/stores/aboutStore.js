import { defineStore } from 'pinia'

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
      this.loading = true
      this.error = null
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERWER}/api/abouts?populate=profile_picture`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN_READ_ONLY}`,
            },
          },
        ) // Replace with your API URL
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

        const result = await response.json()
        this.data = result.data // Assuming the API response has a "data" array
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
