<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

const props = defineProps({
  data: { type: Array, required: true },
  color: { type: String, default: '#42b983' },
  label: { type: String, default: '數據' }
});

const canvas = ref(null);
let chart = null;

onMounted(() => {
  Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
  renderChart();
});

watch(() => props.data, renderChart);

function renderChart() {
  if (chart) chart.destroy();
  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: props.data.map((_, i) => i + 1),
      datasets: [{
        label: props.label,
        data: props.data,
        borderColor: props.color,
        backgroundColor: 'rgba(66,185,131,0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { beginAtZero: true } }
    }
  });
}
</script> 