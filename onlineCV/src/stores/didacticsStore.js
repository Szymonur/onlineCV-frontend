import { defineStore } from 'pinia'
import { useLanguageStore } from './languageStore'

export const useDidacticsStore = defineStore('didacticsStore', {
  state: () => ({
    data: [],
    groupedData: {},
    loading: false,
    error: null,
  }),

  getters: {
    hasData: (state) => state.data.length > 0,
  },

  actions: {
    async fetchData() {
      const languageStore = useLanguageStore()
      this.loading = true
      this.error = null
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERWER}/api/didactics?locale=${languageStore.locale}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN_READ_ONLY}`,
            },
          },
        )
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

        const result = await response.json()
        this.data = result.data
        this.groupedData = this.groupByType(this.data) // Group data by type and add slugs
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    /**
     * Groups the fetched data by "type" and generates a slug for each group.
     * @param {Array} data - The fetched data array.
     * @returns {Object} - Grouped data with slugs.
     */
    groupByType(data) {
      const grouped = {}

      data.forEach((item) => {
        const typeKey = this.createSlug(item.type) // Generate slug
        if (!grouped[typeKey]) {
          grouped[typeKey] = {
            slug: typeKey,
            name: item.type, // Preserve the original type name
            items: [],
          }
        }
        grouped[typeKey].items.push(item)
      })

      return grouped
    },

    /**
     * Creates a slug from a given string by removing white spaces, case differences, and special characters.
     * @param {string} text - The input string.
     * @returns {string} - A slugified version of the input.
     */
    createSlug(text) {
      const polishMap = {
        ą: 'a',
        ć: 'c',
        ę: 'e',
        ł: 'l',
        ń: 'n',
        ó: 'o',
        ś: 's',
        ź: 'z',
        ż: 'z',
      }

      return text
        .toLowerCase()
        .replace(/[ąćęłńóśźż]/g, (match) => polishMap[match]) // Zamiana polskich znaków
        .normalize('NFD') // Usunięcie ewentualnych pozostałych znaków diakrytycznych
        .replace(/[\u0300-\u036f]/g, '') // Usunięcie reszty znaków diakrytycznych
        .replace(/[^a-z0-9]/g, '-') // Zamiana wszystkiego, co nie jest literą/cyfrą, na "-"
        .replace(/-+/g, '-') // Usunięcie podwójnych myślników
        .replace(/^-|-$/g, '') // Usunięcie myślnika z początku i końca
    },
  },
})
