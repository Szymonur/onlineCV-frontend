import { defineStore } from 'pinia'

export const useCitationsStore = defineStore('citationsStore.', {
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
        const response = await fetch('/googleScholar.json')
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

        const result = await response.json()
        this.data = {
          co_authors: result.co_authors,
          table: result.cited_by.table,
          graph: result.cited_by.graph,
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
