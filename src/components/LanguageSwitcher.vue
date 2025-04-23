<template>
  <div class="language-switcher" ref="dropdownRef">
    <button class="current-language" @click="toggleDropdown">
      {{ currentLanguage.label }} <font-awesome-icon :icon="faChevronDown" />
    </button>
    <ul v-if="isOpen" class="dropdown">
      <li v-for="lang in languages" :key="lang.code" @click="changeLanguage(lang.code)">
        {{ lang.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useResearchGrantsStore } from "@/stores/researchGrantsStore";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const languageStore = useLanguageStore();
const researchGrantStore = useResearchGrantsStore();
const isOpen = ref(false);
const dropdownRef = ref(null);

const languages = [
  { code: "en", label: "🇬🇧 English" },
  { code: "pl", label: "🇵🇱 Polski" },
];

const currentLanguage = computed(() => languages.find((lang) => lang.code === languageStore.locale) || languages[0]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const changeLanguage = (lang) => {
  languageStore.setLanguage(lang);
  researchGrantStore.fetchData();
  isOpen.value = false;
};

// Zamknięcie dropdowna po kliknięciu poza nim
const closeDropdown = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.current-language {
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  background-color: #f0f0f0;
  border-radius: 5px;
  font-weight: bold;
}
.current-language :deep(svg) {
  font-size: 1rem;
  vertical-align: middle;
}
.current-language:hover {
  background-color: #ddd;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  margin: 5px 0;
  min-width: 120px;
  z-index: 1000;
}

.dropdown li {
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown li:hover {
  background: #ddd;
}
</style>
