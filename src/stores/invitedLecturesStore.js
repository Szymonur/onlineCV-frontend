import { defineStore } from 'pinia'
import { useLanguageStore } from './languageStore'

export const useInvitedLectureStore = defineStore('invitedLecture', {
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
      const languageStore = useLanguageStore()
      this.loading = true
      this.error = null
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERWER}/api/invited-lectures?locale=${languageStore.locale}`,
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
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
})
