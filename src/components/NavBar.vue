<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useLanguageStore } from '@/stores/languageStore'

const languageStore = useLanguageStore()
const t = (key) => languageStore.currentTranslation[key] || key
const isMenuOpen = ref(false)
</script>

<template>
  <nav>
    <div class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
      <span :class="{ open: isMenuOpen }"></span>
    </div>

    <div class="menu-links" :class="{ open: isMenuOpen }">
      <RouterLink to="/about" @click="isMenuOpen = false">{{ t('about') }}</RouterLink>
      <RouterLink to="/publications" @click="isMenuOpen = false">{{ t('publicatons') }}</RouterLink>
      <RouterLink to="/conferences" @click="isMenuOpen = false">{{ t('conferences') }}</RouterLink>
      <RouterLink to="/education" @click="isMenuOpen = false">{{ t('education') }}</RouterLink>
      <RouterLink to="/employment" @click="isMenuOpen = false">{{ t('employment') }}</RouterLink>
      <RouterLink to="/invited_lectures" @click="isMenuOpen = false">{{
        t('invited_lectures')
      }}</RouterLink>
      <RouterLink to="/didactics" @click="isMenuOpen = false">{{ t('didactics') }}</RouterLink>
    </div>

    <LanguageSwitcher />
  </nav>
</template>

<style scoped>
nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  border-bottom: 2px solid black;
  position: relative;
  gap: 1.5rem;
}
.menu-links{
  display: flex;
  gap: 1.5rem;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background: black;
  transition: 0.3s;
}

nav a {
  padding: 0.75rem 0;
  position: relative;
  text-decoration: none;
  color: black;
  width: min-content;
  text-wrap: nowrap;
  display: inline-block;
  font-size: 1.2rem;
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
  color: var(--nav); /* Zielony kolor dla aktywnego linku */
}

:deep(.router-link-active)::after {
  background-color: var(--nav); /* Zielone podkreślenie dla aktywnego linku */
  width: 100%; /* Podkreślenie na szerokość tekstu */
}

nav a:not(:hover)::after {
  width: 0; /* Podkreślenie znika po zjechaniu myszką */
}
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  nav {
    flex-direction: row-reverse;
  }
  .menu-links {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    display: none;
  }
  .menu-links a {
    text-wrap: nowrap;
  }
  .menu-links.open {
    display: flex;
    align-items: end;
    z-index: 999;
  }
}
</style>
