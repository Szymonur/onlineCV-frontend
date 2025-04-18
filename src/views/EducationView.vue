<script setup>
import { useEducationStore } from "@/stores/educationStore.js";
import { useLanguageStore } from "@/stores/languageStore";
import { watch, onMounted } from "vue";

const EducationStore = useEducationStore();
const languageStore = useLanguageStore();

onMounted(() => {
  EducationStore.fetchData();
});
watch(
  () => languageStore.locale,
  () => {
    EducationStore.fetchData();
  }
);
const t = (key) => languageStore.currentTranslation[key] || key;
</script>

<template>
  <div class="c-education">
    <div>
      <div v-if="EducationStore.loading"></div>
      <div v-else-if="EducationStore.error">{{ EducationStore.error }}</div>
      <div v-else class="education-container">
        <ul>
          <li class="education-card">
            <div>
              <h1>{{ t("education") }}</h1>
            </div>
            <div class="education-card-right education-card-right-header">
              <div>
                <p class="education-card-right-location">{{ t("location") }}</p>
              </div>
              <div>
                <p class="education-card-right-date">{{ t("date") }}</p>
              </div>
            </div>
          </li>
          <li v-for="education in EducationStore.main" :key="education.id" class="education-card">
            <div>
              <h2>{{ education.university }}, {{ education.degree }}</h2>
              <p>{{ education.description }}</p>
            </div>
            <div class="education-card-right">
              <div>
                <p class="education-card-right-location">{{ education.location }}</p>
              </div>
              <div>
                <p class="education-card-right-date">{{ education.year }}</p>
              </div>
            </div>
          </li>
          <!-- ADDITIONAL -->

          <li class="education-card">
            <div class="education-card-title">
              <h1>{{ t("summer_school_courses") }}</h1>
              <p>( {{ t("as_participant") }} )</p>
            </div>
            <div class="education-card-right education-card-right-header">
              <div>
                <p class="education-card-right-location">{{ t("location") }}</p>
              </div>
              <div>
                <p class="education-card-right-date">{{ t("date") }}</p>
              </div>
            </div>
          </li>
          <li v-for="education in EducationStore.additional" :key="education.id" class="education-card">
            <div>
              <h2>{{ education.university }}, {{ education.degree }}</h2>
              <p>{{ education.description }}</p>
            </div>
            <div class="education-card-right">
              <div>
                <p class="education-card-right-location">{{ education.location }}</p>
              </div>
              <div>
                <p class="education-card-right-date">{{ education.year }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-educations {
  /* padding: 0 40px 0 0; */
}
.education-container {
  margin: auto;
  padding: 0 40px 0 0;
}
.education-card-title {
  display: flex;
  justify-content: flex-start;
  align-items: end;
}
.education-card-title h1 {
  padding: 15px 20px 0 0;
}
.education-card-title h2 {
  padding: 0 0 4px 0;
}
.education-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.education-card-right-header div {
  display: flex;
  align-items: end;
  justify-content: center;
}
.education-card-right,
.education-card-right-header div p {
  text-align: center;
}
.education-card-right {
  display: flex;
  gap: 2rem;
}
.education-card-right-header {
  gap: 2rem;
}
.education-card-right-link {
  color: var(--link);
}
.education-card h2 {
  margin: 0;
  font-size: 1.2em;
  color: var(--nav);
}

.education-card a {
  color: var(--link);
  text-decoration: none;
}
.education-card-right-date {
  text-wrap: nowrap;
  width: 77px;
}
.education-card-right-location {
  text-wrap: nowrap;
  width: 90px;
}

h1 {
  padding: 15px 40px 0 0px;
}

@media (max-width: 768px) {
  .education-card {
    flex-direction: column;
  }
  h1 {
    font-size: 1.5rem;
  }
  .education-card h2 {
    font-size: 1.25rem;
    text-align: left;
  }
  .education-card-title {
    flex-direction: column;
    align-items: start;
  }
  .education-card-right-header {
    display: none;
  }
  .education-card-right-location {
    text-align: left;
  }
  .education-container {
    margin: auto;
    padding: 0 1.25rem 0 0;
  }
}
</style>
