<script setup>
import { RouterLink } from 'vue-router'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useLanguageStore } from '@/stores/languageStore'

const languageStore = useLanguageStore()

const t = (key) => languageStore.currentTranslation[key] || key
</script>

<template>
  <nav>
    <div>
      <RouterLink to="/about">{{ t('about') }}</RouterLink>
      <RouterLink to="/publications">{{ t('publicatons') }}</RouterLink>
      <RouterLink to="/conferences">{{ t('conferences') }}</RouterLink>
      <RouterLink to="/education">{{ t('education') }}</RouterLink>
      <RouterLink to="/employment">{{ t('employment') }}</RouterLink>
      <RouterLink to="/invited_lectures">{{ t('invited_lectures') }}</RouterLink>

    </div>
    <LanguageSwitcher />
  </nav>
</template>

<style scoped>
nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  gap: 2rem;
  font-size: 1.25rem;
  color: #000;
  border-bottom: 2px solid black;
  padding: 0.75rem 2rem 0.75rem 40px;
}
nav div {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
}
nav div a {
  position: relative;
  text-decoration: none;
  color: black;
}

nav div a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: currentColor;
  transition: width 0.3s ease-in-out;
}

nav div a:hover::after {
  width: 100%;
}

.do_not_display {
  display: none;
}

:deep(.router-link-active) {
  color: #4e7e00; /* Blue color for active link */
}
</style>
