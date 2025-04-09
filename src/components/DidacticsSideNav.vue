<script setup>
import { ref, onMounted, watch } from "vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useRoute } from "vue-router";

const props = defineProps({
  links: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const languageStore = useLanguageStore();
const t = (key) => languageStore.currentTranslation[key] || key;

const activeSlug = ref(null);
const route = useRoute();

// Aktualizuj aktywny element na podstawie route.hash
watch(
  () => route.hash,
  (newHash) => {
    activeSlug.value = newHash?.replace("#", "") || null;
  },
  { immediate: true }
);

// Kliknięcie w link tylko ustawia aktywny slug (opcjonalnie)
const setActive = (slug) => {
  activeSlug.value = slug;
};
</script>

<template>
  <nav>
    <a
      v-for="link in props.links"
      :key="link.slug"
      :id="link.slug"
      :href="'#' + link.slug"
      :class="{ active: activeSlug === link.slug }"
      @click="setActive(link.slug)">
      {{ link.name }}
    </a>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  flex-direction: column;
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
  display: inline-block;
  transition: color 0.3s;
}

/* Styl aktywnego linku */
nav a.active {
  color: var(--nav);
  /* font-weight: bold; */
}

/* Podkreślenie na hover */
nav a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: currentColor;
  transition: width 0.3s ease-in-out;
}

nav a:hover::after {
  width: 100%;
}

/* Usunięcie podkreślenia, gdy link nie jest hoverowany */
nav a:not(:hover)::after {
  width: 0;
}

@media (max-width: 768px) {
  nav {
    display: flex;
    flex-direction: column !important;
    font-size: 1rem;
    color: #000;
    border-right: 0px solid black;
    border-bottom: 2px solid black;
    padding: 0.25rem 2rem;
    width: 100vw;
  }
}
</style>
