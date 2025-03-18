<script setup>
import { RouterLink } from 'vue-router'
import { useLanguageStore } from '@/stores/languageStore'

const languageStore = useLanguageStore()
const t = (key) => languageStore.currentTranslation[key] || key
</script>

<template>
  <nav>
    <RouterLink to="/publications/articles">{{ t('articles') }}</RouterLink>
    <RouterLink to="/publications/research_grants">{{ t('research_grants') }} </RouterLink>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: column !important;
  min-width: 220px;
  font-size: 1.25rem;
  color: #000;
  border-right: 2px solid black;
  padding: 0.75rem 2rem;
}

nav a {
  padding: 0.75rem 0;
  position: relative;
  text-decoration: none;
  color: black;
  width: min-content;
  text-wrap: nowrap;
  display: inline-block; /* Umożliwia kontrolowanie szerokości na podstawie tekstu */
}

nav a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0; /* Początkowa szerokość podkreślenia */
  height: 2px;
  background-color: currentColor;
  transition: width 0.3s ease-in-out;
}

nav a:hover::after {
  width: 100%; /* Podkreślenie pojawi się na szerokości tekstu */
}

:deep(.router-link-active) {
  color: #4e7e00; /* Zielony kolor dla aktywnego linku */
}

:deep(.router-link-active)::after {
  background-color: #4e7e00; /* Zielone podkreślenie dla aktywnego linku */
  width: 100%; /* Podkreślenie na szerokość tekstu */
}

nav a:not(:hover)::after {
  width: 0; /* Podkreślenie znika po zjechaniu myszką */
}
</style>
