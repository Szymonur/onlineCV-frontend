<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import { useDidacticsStore } from "@/stores/didacticsStore.js";
import { useLanguageStore } from "@/stores/languageStore";
import DidacticsSideNav from "@/components/DidacticsSideNav.vue";

const DidacticsStore = useDidacticsStore();
const languageStore = useLanguageStore();
const activeSection = ref(null);

// Ręczne przewijanie zamiast domyślnego skakania
const scrollToSection = async (slug) => {
  await nextTick(); // Poczekaj na aktualizację DOM

  const section = document.getElementById(slug);
  if (section) {
    activeSection.value = slug;
    history.pushState(null, "", `#${slug}`); // Aktualizacja URL bez skoku
    section.scrollIntoView({ behavior: "smooth", block: "start" }); // Płynne przewijanie
  }
};

// Funkcja do ustawiania aktywnej sekcji na podstawie hash w URL
const setActiveSection = async () => {
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    scrollToSection(hash); // Przewiń do sekcji zamiast skakać
  }
};

// Obsługa kliknięcia w linki nawigacyjne
const handleNavClick = (event, slug) => {
  event.preventDefault(); // Zablokowanie domyślnego skoku przeglądarki
  scrollToSection(slug); // Płynne przewijanie
};

// Pobranie danych i ustawienie aktywnej sekcji po załadowaniu
onMounted(() => {
  DidacticsStore.fetchData();
  setActiveSection();
  window.addEventListener("hashchange", setActiveSection);
});

// Intersection Observer do wykrywania aktywnej sekcji podczas przewijania
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
          history.replaceState(null, "", `#${entry.target.id}`);
        }
      }
    },
    { threshold: 0.6 } // Sekcja jest aktywna, jeśli przynajmniej 60% jest widoczne
  );

  document.querySelectorAll(".didactics-section").forEach((section) => {
    observer.observe(section);
  });
});

// Aktualizacja danych przy zmianie języka
watch(
  () => languageStore.locale,
  () => {
    DidacticsStore.fetchData();
  }
);

const t = (key) => languageStore.currentTranslation[key] || key;
</script>

<template>
  <div class="c-didactics">
    <div>
      <div v-if="DidacticsStore.loading">{{ t("loading") }}</div>
      <div v-else-if="DidacticsStore.error">{{ DidacticsStore.error }}</div>
      <div v-else class="didactics-container">
        <DidacticsSideNav :links="DidacticsStore.groupedData" />
        <div class="didactics-content">
          <template v-for="(group, slug) in DidacticsStore.groupedData" :key="slug">
            <div
              :id="slug"
              class="didactics-section"
              :class="{ active: activeSection === slug }"
              @click="scrollToSection(slug)">
              <h1>{{ group.name }}</h1>
              <ul>
                <li v-for="item in group.items" :key="item.id">
                  <p>{{ item.name }}</p>
                  <a :href="item.link" @click.prevent="handleNavClick($event, slug)">Sylabus</a>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Płynne przewijanie */
html {
  scroll-behavior: smooth;
}

.didactics-container {
  display: flex;
}

.didactics-content {
  flex-grow: 1;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

/* Sekcja domyślna */
.didactics-section {
  padding: 20px 40px 40px 40px;
  border-bottom: 3px solid #ddd;
  border-left: 6px solid transparent;
  opacity: 1;
  transform: translateY(0);
  transition:
    background-color 0.4s ease-in-out,
    box-shadow 0.4s ease-in-out,
    opacity 0.5s ease-out;
}

/* Aktywna sekcja */
.didactics-section.active {
  border-bottom: 3px solid transparent;
  border-left: 6px solid var(--nav);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Widoczność wszystkich sekcji */
.didactics-section:not(.active) {
  opacity: 1;
  transform: translateY(0);
}

.didactics-section h1 {
  margin-bottom: 10px;
  font-size: 2rem;
  color: var(--nav);
}

.didactics-section ul {
  list-style: none;
  padding: 0;
}

.didactics-section li {
  padding: 10px 0;
  font-size: 1.2rem;
  border-bottom: 2px dashed #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

li a {
  color: var(--link);
}
@media (max-width: 768px) {
  .didactics-container {
    flex-direction: column;
  }
  .didactics-section h1 {
    font-size: 1.5rem;
  }
  .didactics-section p {
    font-size: 1rem;
  }
  .didactics-section a {
    font-size: 1rem;
  }
}
</style>
