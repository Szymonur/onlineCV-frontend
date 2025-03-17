<script setup>
import { useDataStore } from '@/stores/aboutStore'
import { useLanguageStore } from '@/stores/languageStore'
import { watch, onMounted } from 'vue'

const dataStore = useDataStore()
const serverUrl = import.meta.env.VITE_SERWER
const languageStore = useLanguageStore()

onMounted(() => {
  dataStore.fetchData()
})
watch(
  () => languageStore.locale,
  () => {
    dataStore.fetchData()
  },
)
</script>

<template>
  <div class="c-about">
    <div class="c-about-container">
      <div v-if="dataStore.loading">Ładowanie danych...</div>
      <div v-else-if="dataStore.error" class="error">Błąd: {{ dataStore.error }}</div>
      <div v-else-if="!dataStore.hasData">Brak dostępnych danych.</div>
      <div v-else class="c-about-content">
        <div class="c-about-top">
          <div class="c-about-img">
            <img :src="serverUrl + dataStore.data[0].profile_picture.url" alt="" />
          </div>
          <div class="c-about-top-data">
            <h1>{{ dataStore.data[0].name }}</h1>
            <h2>{{ dataStore.data[0].title }}</h2>
            <h2>{{ dataStore.data[0].department }}</h2>
          </div>
        </div>
        <div class="c-about-description">{{ dataStore.data[0].description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-about {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.c-about-container {
  max-width: 1024px;
  padding: 40px 10px;
}
.c-about-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.c-about-description {
  font-size: 18px;
}
.c-about-img img {
  border-radius: 50%;
}
.c-about-top-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
h1 {
  font-size: 5rem;
  font-weight: bold;
  padding: 0;
}
.c-about-top {
  display: flex;
  gap: 3rem;
  align-items: center;
}
.error {
  color: red;
}
</style>
