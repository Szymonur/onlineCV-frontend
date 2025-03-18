<script setup>
import { useEmploymentStore } from '@/stores/employmentStore.js'
import { useLanguageStore } from '@/stores/languageStore'
import { watch, onMounted } from 'vue'

const EmploymentStore = useEmploymentStore()
const languageStore = useLanguageStore()

onMounted(() => {
  EmploymentStore.fetchData()
})

watch(
  () => languageStore.locale,
  () => {
    EmploymentStore.fetchData()
  },
)
const t = (key) => languageStore.currentTranslation[key] || key
</script>

<template>
  <div class="c-Employment">
    <div>
      <div v-if="EmploymentStore.loading">{{ t('loading') }}</div>
      <div v-else-if="EmploymentStore.error">{{ EmploymentStore.error }}</div>
      <div v-else class="Employment-container">
        <ul>
          <li class="Employment-card">
            <div>
              <h1>{{ t('employment') }}</h1>
            </div>
            <div class="Employment-card-right Employment-card-right-header">
              <div>
                <p class="Employment-card-right-location">{{ t('location') }}</p>
              </div>
              <div>
                <p class="Employment-card-right-date">{{ t('date') }}</p>
              </div>
            </div>
          </li>
          <li
            v-for="Employment in EmploymentStore.main"
            :key="Employment.id"
            class="Employment-card"
          >
            <div>
              <h2>{{ Employment.role }}, {{ Employment.company }}</h2>
              <p>{{ Employment.description }}</p>
            </div>
            <div class="Employment-card-right">
              <div>
                <p class="Employment-card-right-location">{{ Employment.location }}</p>
              </div>
              <div>
                <p class="Employment-card-right-date">{{ Employment.year }}</p>
              </div>
            </div>
          </li>
          <!-- ADDITIONAL -->

          <li class="Employment-card">
            <div class="Employment-card-title">
              <h1>{{ t('summer_school_courses') }}</h1>
              <h2>( {{ t('as_lecturer') }} )</h2>
            </div>
            <div class="Employment-card-right Employment-card-right-header">
              <div>
                <p class="Employment-card-right-location">{{ t('location') }}</p>
              </div>
              <div>
                <p class="Employment-card-right-date">{{ t('date') }}</p>
              </div>
            </div>
          </li>
          <li
            v-for="Employment in EmploymentStore.additional"
            :key="Employment.id"
            class="Employment-card"
          >
            <div>
              <h2>{{ Employment.role }}, {{ Employment.company }}</h2>
              <p>{{ Employment.description }}</p>
            </div>
            <div class="Employment-card-right">
              <div>
                <p class="Employment-card-right-location">{{ Employment.location }}</p>
              </div>
              <div>
                <p class="Employment-card-right-date">{{ Employment.year }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-Employments {
  /* padding: 0 40px 0 0; */
}
.Employment-container {
  margin: auto;
  padding: 0 40px 0 0;
}
.Employment-card-title {
  display: flex;
  justify-content: flex-start;
  align-items: end;
}
.Employment-card-title h1 {
  padding: 15px 20px 0 0;
}
.Employment-card-title h2 {
  padding: 0 0 4px 0;
}
.Employment-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.Employment-card-right-header div {
  display: flex;
  align-items: end;
  justify-content: center;
}
.Employment-card-right,
.Employment-card-right-header div p {
  text-align: center;
}
.Employment-card-right {
  display: flex;
  gap: 2rem;
}
.Employment-card-right-header {
  gap: 2rem;
}
.Employment-card-right-link {
  color: #007bff;
}
.Employment-card h2 {
  margin: 0;
  font-size: 1.2em;
}

.Employment-card a {
  color: #007bff;
  text-decoration: none;
}
.Employment-card-right-date {
  text-wrap: nowrap;
  width: 77px;
}
.Employment-card-right-location {
  text-wrap: nowrap;
  width: 90px;
}

.Employment-card a:hover {
  text-decoration: underline;
}
h1 {
  padding: 15px 40px 0 0px;
}
</style>
