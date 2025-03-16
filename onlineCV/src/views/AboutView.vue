<script setup>
import { onMounted } from 'vue'
import { useDataStore } from '@/stores/aboutStore'

const dataStore = useDataStore()

onMounted(() => {
  dataStore.fetchData()
})

// Format date helper
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="data-container">
    <h1>Dane API</h1>

    <!-- Loading State -->
    <div v-if="dataStore.loading">Ładowanie danych...</div>

    <!-- Error State -->
    <div v-else-if="dataStore.error" class="error">Błąd: {{ dataStore.error }}</div>

    <!-- No Data -->
    <div v-else-if="!dataStore.hasData">Brak dostępnych danych.</div>

    <!-- Display Data -->
    <div v-else>
      <div v-for="item in dataStore.data" :key="item.id" class="data-card">
        <h2>{{ item.title }}</h2>
        <p><strong>Utworzono:</strong> {{ formatDate(item.createdAt) }}</p>

        <div class="description">
          <h3>Opis:</h3>
          <div v-for="(paragraph, index) in item.description" :key="index">
            <p>{{ paragraph.children[0].text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  font-size: 2em;
  color: #333;
}

.data-card {
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

.error {
  color: red;
}
</style>
