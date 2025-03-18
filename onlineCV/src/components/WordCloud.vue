<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import cloud from 'd3-cloud'

const props = defineProps({
  keywords: Array, // { text: "word", value: number }
})

const svgRef = ref(null)
const width = 200 // Stała szerokość
const height = 130 // Stała wysokość

const drawWordCloud = () => {
  if (!props.keywords || props.keywords.length === 0) return

  // Skalowanie wielkości czcionki tak, by zmieściły się wszystkie słowa
  const fontSizeScale = d3
    .scaleLinear()
    .domain([1, Math.max(...props.keywords.map((d) => d.value))])
    .range([10, 20]) // Min/max wielkość czcionki

  const layout = cloud()
    .size([width, height])
    .words(props.keywords.map((d) => ({ text: d.text, size: fontSizeScale(d.value) })))
    .padding(2) // Mniejsze odstępy
    .rotate(() => (Math.random() > 0.4 ? 0 : 90)) // Mniej obrotów dla lepszej czytelności
    .fontSize((d) => d.size)
    .on('end', renderCloud)

  layout.start()

  function renderCloud(words) {
    const svg = d3.select(svgRef.value)
    svg.selectAll('*').remove() // Usuwamy poprzednie dane przed rysowaniem nowej chmury

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`)

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

onMounted(drawWordCloud)
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
