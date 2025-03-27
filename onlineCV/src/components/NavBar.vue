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

.menu-links {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.menu-links a {
  text-decoration: none;
  color: black;
  position: relative;
  width: min-content;
}

.menu-links a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: currentColor;
  transition: width 0.3s ease-in-out;
}

.menu-links a:hover::after {
  width: 100%;
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
