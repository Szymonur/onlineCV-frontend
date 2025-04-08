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
    <div>
      <div v-if="ArticlesStore.loading"></div>
      <div v-else-if="ArticlesStore.error">{{ ArticlesStore.error }}</div>
      <div v-else class="articles-container">
        <ul>
          <li class="article-card">
            <div>
              <h1>{{ t("articles") }}</h1>
            </div>
            <div class="article-card-right-header mobile-do-not-display">
              <!-- <div>
                <p>{{ t('cited_by') }}</p>
              </div> -->
              <div>
                <p>{{ t("year") }}</p>
              </div>
            </div>
          </li>
          <li v-for="article in ArticlesStore.data" :key="article.citation_id" class="article-card">
            <div>
              <h2>
                <a :href="article.link" target="_blank">{{ article.title }}</a>
              </h2>
              <p>{{ article.authors }}</p>
              <p>{{ article.publication }}</p>
            </div>
            <div class="article-card-right">
              <!-- <div>
                <p>
                  <a
                    class="article-card-right-cited"
                    :href="article.cited_by.link"
                    target="_blank"
                    >{{ article.cited_by.value }}</a
                  >
                </p>
              </div> -->
              <div>
                <!-- Word Cloud for Each Article -->
                <WordCloud v-if="article.keywords" :keywords="article.keywords" />
              </div>
              <div class="mobile-do-not-display">
                <p>{{ article.year }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- <CitationsSideBar /> -->
  </div>
</template>

<style scoped>
.c-articles {
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: 2rem;
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
}
</style>
