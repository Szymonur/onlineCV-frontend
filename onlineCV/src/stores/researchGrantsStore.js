import { defineStore } from 'pinia'

export const useResearchGrantStore = defineStore('researchGrant', {
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
        const response = await fetch(`${import.meta.env.VITE_SERWER}/api/research-grants`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN_READ_ONLY}`,
          },
        })
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

        const result = await response.json()
        this.data = result.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
