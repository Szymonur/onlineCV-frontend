import { defineStore } from 'pinia'

export const useArticlesStore = defineStore('articlesStore', {
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
        const response = await fetch('../public/googleScholar.json')
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

        const result = await response.json()
        this.data = result.articles
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
