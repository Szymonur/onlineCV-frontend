<script setup>
import { onMounted } from 'vue'
import { useConferenceStore } from '@/stores/conferenceStore'

const conferenceStore = useConferenceStore()

onMounted(() => {
  conferenceStore.fetchConferences()
})
</script>

<template>
  <div class="conference-container">
    <h1>Konferencje</h1>

    <!-- Loading State -->
    <div v-if="conferenceStore.loading">Ładowanie danych...</div>

    <!-- Error State -->
    <div v-else-if="conferenceStore.error" class="error">Błąd: {{ conferenceStore.error }}</div>

    <!-- No Data -->
    <div v-else-if="!conferenceStore.hasConferences">Brak dostępnych konferencji.</div>

    <!-- Display Conference -->
    <div v-else>
      <div
        v-for="conference in conferenceStore.conferences"
        :key="conference.id"
        class="conference-card"
      >
        <h2>{{ conference.name }}</h2>
        <p><strong>Location:</strong> {{ conference.location }}</p>
        <p><strong>Date:</strong> {{ formatDate(conference.date) }}</p>

        <div class="description">
          <h3>Opis:</h3>
          <div v-for="(paragraph, index) in conference.description" :key="index">
            <p>{{ paragraph.children[0].text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const formatDate = (date) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }
  return new Date(date).toLocaleDateString('pl-PL', options)
}
</script>

<style scoped>
.conference-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  font-size: 2em;
  color: #333;
}

.conference-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

h2 {
  font-size: 1.8em;
  margin-bottom: 10px;
}

strong {
  font-weight: bold;
}

.description {
  margin-top: 20px;
}

.footer {
  margin-top: 30px;
  font-size: 0.9em;
  color: #666;
}

.error {
  color: red;
}

button {
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
