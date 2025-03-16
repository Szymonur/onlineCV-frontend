<script setup>
import { useArticlesStore } from '@/stores/articlesStore.js'
import { onMounted } from 'vue'

const ArticlesStore = useArticlesStore()

onMounted(() => {
  ArticlesStore.fetchData()
})
</script>

<template>
  <div class="c-articles">
    <div>
      <div v-if="ArticlesStore.loading">Loading...</div>
      <div v-else-if="ArticlesStore.error">{{ ArticlesStore.error }}</div>
      <div v-else class="articles-container">
        <ul>
          <li class="article-card">
            <div>
              <h1>Articles</h1>
            </div>
            <div class="article-card-right article-card-right-header">
              <div>
                <p>Cited by</p>
              </div>
              <div>
                <p>Year</p>
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
              <div>
                <p>
                  <a :href="article.cited_by.link" target="_blank">{{ article.cited_by.value }}</a>
                </p>
              </div>
              <div>
                <p>{{ article.year }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.c-publications {
  display: flex;
  padding: 0 40px 0 0;
}
.articles-container {
  margin: auto;
  font-family: Arial, sans-serif;
}

.article-card {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
}
.article-card-right-header div {
  display: flex;
  align-items: end;
}
.article-card-right {
  display: flex;
  gap: 2rem;
}
.article-card h2 {
  margin: 0;
  font-size: 1.2em;
}

.article-card a {
  color: #007bff;
  text-decoration: none;
}

.article-card a:hover {
  text-decoration: underline;
}
h1 {
  padding: 15px 40px 0 0px;
}

</style>
