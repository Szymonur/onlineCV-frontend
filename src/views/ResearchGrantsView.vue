<script setup>
import { useResearchGrantsStore } from "@/stores/researchGrantsStore.js";
import { useLanguageStore } from "@/stores/languageStore";
import { watch, onMounted } from "vue";

const ResearchGrantStore = useResearchGrantsStore();
const languageStore = useLanguageStore();

onMounted(() => {
  ResearchGrantStore.fetchData();
});
watch(
  () => languageStore.locale,
  () => {
    ResearchGrantStore.fetchData();
  }
);
const t = (key) => languageStore.currentTranslation[key] || key;
</script>

<template>
  <div class="c-research-projects">
    <div>
      <div v-if="ResearchGrantStore.loading"></div>
      <div v-else-if="ResearchGrantStore.error">{{ ResearchGrantStore.error }}</div>
      <div v-else class="projects-container">
        <ul>
          <li class="project-card">
            <h1>{{ t("research_grants") }}</h1>
          </li>
          <li v-for="grant in ResearchGrantStore.data" :key="grant.id" class="project-card">
            <h2>"{{ grant.title }}"</h2>
            <div class="project-card-date">{{ grant.date }}</div>
            <div v-if="grant.description" class="project-card-description">
              {{ grant.description }}
            </div>
            <div v-else>{{ t("noDescription") }}</div>
            <div>{{ grant.role }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.c-research-projects {
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 2rem;
  padding-right: 40px;
}

.projects-container {
  margin: auto;
}
.project-card {
  display: flex;
  flex-direction: column;
}
.project-card-description {
  font-weight: 300;
}

.project-card-date {
  font-weight: 500;
  margin-bottom: 10px;
}

.project-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  gap: 1rem;
  display: flex;
  justify-content: space-between;
}

.project-card h2 {
  margin: 0;
  font-size: 1.2em;
  font-style: italic;
}

.project-card p {
  margin: 5px 0;
}

ul {
  list-style: none;
}

h1 {
  padding: 15px 40px 0 0px;
  text-align: start;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .c-research-projects {
    flex-direction: column;
    align-items: flex-start;
  }

  .projects-container {
    width: 100%;
  }

  .project-card {
    width: 100%;
  }

  .project-card h1 {
    padding: 0;
    font-size: 1.2rem;
  }

  .project-card h2 {
    font-size: 1rem;
  }

  .project-card-description {
    font-size: 0.75rem;
  }

  .project-card-date {
    font-size: 0.75rem;
  }

  .project-card p {
    font-size: 0.75rem;
  }

  /* Hiding elements for mobile view */
  .mobile-do-not-display {
    display: none;
  }
}
</style>
