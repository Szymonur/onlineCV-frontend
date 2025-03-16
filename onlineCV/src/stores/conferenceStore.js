// src/stores/conferenceStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useConferenceStore = defineStore('conference', () => {
  const conferences = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchConferences = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch('http://localhost:1337/api/conferences', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN_READ_ONLY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      conferences.value = result.data; // Ensure you're accessing the correct key based on the API response structure
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Computed property to check if there is data
  const hasConferences = computed(() => conferences.value.length > 0);

  return {
    conferences,
    loading,
    error,
    fetchConferences,
    hasConferences,
  };
});
