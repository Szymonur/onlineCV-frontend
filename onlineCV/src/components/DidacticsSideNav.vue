<script setup>
const props = defineProps({
  links: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>

<template>
  <nav>
    <a v-for="link in props.links" :key="link.id" :id="link.id" href="#">
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
}

nav a::after {
  content: '';
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

nav a:not(:hover)::after {
  width: 0;
}
</style>
