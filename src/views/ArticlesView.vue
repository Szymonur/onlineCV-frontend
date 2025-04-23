<script setup>
import { useArticlesStore } from "@/stores/articlesStore.js";
import { useLanguageStore } from "@/stores/languageStore";
import WordCloud from "@/components/WordCloud.vue";

// import CitationsSideBar from '@/components/CitationsSideBar.vue'

import { onMounted } from "vue";

const ArticlesStore = useArticlesStore();
const languageStore = useLanguageStore();

onMounted(() => {
  ArticlesStore.fetchData();
});
const t = (key) => languageStore.currentTranslation[key] || key;
</script>

<template>
  <div class="c-articles">
    <div v-if="ArticlesStore.loading"></div>
    <div v-else-if="ArticlesStore.error">{{ ArticlesStore.error }}</div>
    <div v-else class="articles-container">
      <!-- Header: First row -->
      <div class="article-grid header">
        <h1>{{ t("articles") }}</h1>
        <div></div>
        <div class="citation-header bottom-align mobile-do-not-display" style="grid-column: span 3">
          {{ t("cited_by") }}
        </div>
        <div class="bottom-align mobile-do-not-display">{{ t("year") }}</div>
      </div>

      <!-- Sub-header: Citation types -->
      <div class="article-grid sub-header">
        <div></div>
        <div></div>
        <div class="text-center mobile-do-not-display">WoS</div>
        <div class="text-center mobile-do-not-display">Scopus</div>
        <div class="text-center mobile-do-not-display">GS</div>
      </div>

      <!-- Articles list -->
      <div v-for="article in ArticlesStore.data" :key="article.title" class="article-grid row">
        <div>
          <h2>
            <a :href="article.link" target="_blank">{{ article.title }}</a>
          </h2>
          <p>{{ article.authors }}</p>
          <p>{{ article.description }}</p>
        </div>

        <div>
          <WordCloud v-if="article.keywords" :keywords="article.keywords" />
        </div>

        <div class="text-center mobile-do-not-display">{{ article.citations.webOfScience }}</div>
        <div class="text-center mobile-do-not-display">{{ article.citations.scopus }}</div>
        <div class="text-center mobile-do-not-display">{{ article.citations.googleScholar }}</div>

        <div class="mobile-do-not-display text-center">
          <p>{{ article.year }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-articles {
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 2rem;
  width: 100%;
}
.articles-container {
  width: 100%;
  padding: 40px 0 40px 40px;
}
.text-center {
  text-align: center;
}
.article-citations {
  display: flex;
  gap: 1rem;
}
.bottom-align {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
}
.article-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  gap: 1rem;
  display: flex;
  justify-content: space-between;
}
.article-card-right-header {
  display: flex;
  align-items: flex-end;
  gap: 2rem;
}
.article-card-right-header div {
  display: flex;
  align-items: end;
}
.article-card-right {
  display: flex;
  align-items: center;
  gap: 2rem;
  height: min-content;
}
.article-card h2 {
  margin: 0;
  font-size: 1.2em;
}

.article-card a {
  color: var(--link);
  text-decoration: none;
}
.article-card-right-cited {
  font-size: 19px;
}
.article-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 0.2fr 0.2fr 0.2fr 0.5fr;
  gap: 1rem;
  padding: 1rem 0;
  align-items: center;
  /* border-bottom: 1px solid #ddd; */
}

.article-grid.header {
  font-weight: bold;
}

.article-grid.sub-header {
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  padding: 0 5px;
}

.citation-header {
  text-align: center;
}

.article-grid h2 {
  margin: 0;
  font-size: 1.2em;
}

.article-grid a {
  color: var(--link);
  text-decoration: none;
}

h1 {
  padding: 15px 40px 0 0px;
}
@media (max-width: 768px) {
  .article-card {
    flex-direction: column;
  }
  .article-card h1 {
    padding: 0;
  }

  .article-card a {
    font-size: 1rem;
  }
  .article-card p {
    font-size: 0.75rem;
  }
  .mobile-do-not-display {
    display: none;
  }
  .article-card-right {
    justify-content: center;
    align-items: center;
  }
  .article-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .article-grid.sub-header {
    display: none;
  }

  .mobile-do-not-display {
    display: none;
  }

  .article-citations {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
