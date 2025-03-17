<script setup>
import { useResearchGrantStore } from '@/stores/researchGrantsStore.js'
import { useLanguageStore } from '@/stores/languageStore'
import { watch, onMounted } from 'vue'

const ResearchGrantStore = useResearchGrantStore()
const languageStore = useLanguageStore()

onMounted(() => {
  ResearchGrantStore.fetchData()
})
watch(
  () => languageStore.locale,
  () => {
    ResearchGrantStore.fetchData()
  },
)
const t = (key) => languageStore.currentTranslation[key] || key
</script>

<template>
  <div class="c-research-projects">
    <div>
      <div v-if="ResearchGrantStore.loading">{{ t('loading') }}</div>
      <div v-else-if="ResearchGrantStore.error">{{ ResearchGrantStore.error }}</div>
      <div v-else class="projects-container">
        <ul>
          <li class="project-card">
            <h1>{{ t('research_grants') }}</h1>
          </li>
          <li v-for="grant in ResearchGrantStore.data" :key="grant.id" class="project-card">
            <h2>"{{ grant.title }}"</h2>
            <div class="project-card-date">{{ grant.date }}</div>
            <div v-if="grant.description" class="project-card-description">
              {{ grant.description }}
            </div>
            <div v-else>{{ t('noDescription') }}</div>
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
}
.projects-container {
  margin: auto;
  font-family: Arial, sans-serif;
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
</style>
