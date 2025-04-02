<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { onMounted } from 'vue'
import { useLanguageStore } from '@/stores/languageStore'

// Inicjalizujemy store
const languageStore = useLanguageStore()

// Ładujemy tłumaczenia podczas montowania komponentu
onMounted(() => {
  languageStore.initializeTranslations() // Załaduj tłumaczenia na początku
})
onMounted(() => {
  languageStore.initializeTranslations() // Załaduj tłumaczenia na początku
})
</script>

<template>
  <NavBar />
  <div class="wrapper"></div>
  <transition name="fade" mode="out-in">
    <RouterView />
  </transition>
</template>

<style scoped></style>
