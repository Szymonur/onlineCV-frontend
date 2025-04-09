<template>
  <footer class="footer">
    <p>
      © {{ new Date().getFullYear() }}
      <a :href="authorLink" target="_blank" rel="noopener" class="author-link"> {{ authorName }} </a>. All rights
      reserved.
    </p>
  </footer>
</template>

<script setup>
const authorName = "Szymon Urban";
const authorLink = "https://www.linkedin.com/in/urban-szymon/"; // Podmień na swój link
</script>

<style scoped>
.footer {
  margin-top: 40px;
  max-height: 70px;
  width: 100%;
  text-align: center;
  padding: 1rem;
  font-size: 0.75rem;
  color: #888888a8;
  border-top: 1px solid #eee;
  background-color: transparent;
}

.author-link {
  color: inherit;
  text-decoration: underline dotted;
  transition: color 0.3s ease;
}

.author-link:hover {
  color: var(--link);
}
</style>
