<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as d3 from 'd3'
import cloud from 'd3-cloud'

const props = defineProps({
  keywords: Array,
})

const svgRef = ref(null)
const width = 200
const height = ref(window.innerWidth <= 768 ? 90 : 130) // Dynamiczna wysokość

const drawWordCloud = () => {
  if (!props.keywords || props.keywords.length === 0) return

  const fontSizeScale = d3
    .scaleLinear()
    .domain([1, Math.max(...props.keywords.map((d) => d.value))])
    .range([10, 20])

  const layout = cloud()
    .size([width, height.value])
    .words(props.keywords.map((d) => ({ text: d.text, size: fontSizeScale(d.value) })))
    .padding(2)
    .rotate(() => (Math.random() > 0.4 ? 0 : 90))
    .fontSize((d) => d.size)
    .on('end', renderCloud)

  layout.start()

  function renderCloud(words) {
    const svg = d3.select(svgRef.value)
    svg.selectAll('*').remove()

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height.value / 2})`)

    g.selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
      .style('font-size', (d) => `${d.size}px`)
      .attr('text-anchor', 'middle')
      .attr('transform', (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
      .text((d) => d.text)
  }
}

// Aktualizacja wysokości przy zmianie rozmiaru okna
const updateHeight = () => {
  height.value = window.innerWidth <= 768 ? 90 : 130
  drawWordCloud()
}

onMounted(() => {
  drawWordCloud()
  window.addEventListener('resize', updateHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight)
})

watch(() => props.keywords, drawWordCloud, { deep: true })
</script>

<template>
  <svg ref="svgRef" :width="width" :height="height"></svg>
</template>

<style scoped>
svg {
  display: block;
  margin: auto;
  border-radius: 5px;
}
</style>
