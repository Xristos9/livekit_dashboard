<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import type { ModelCost } from '@/types/ai-dashboard'

Chart.register(...registerables)

const props = defineProps<{
  modelCosts: ModelCost[]
}>()

const chartRef = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

onMounted(() => {
  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: 'bar',
      data: {
        labels: props.modelCosts.map(m => m.model),
        datasets: [{
          label: 'Total Cost',
          data: props.modelCosts.map(m => m.cost),
          backgroundColor: 'rgb(var(--v-theme-info))',
          borderColor: 'rgb(var(--v-theme-info))',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(var(--v-theme-borderColor), 0.3)'
            },
            ticks: {
              color: 'rgb(var(--v-theme-textSecondary))'
            }
          },
          y: {
            grid: {
              color: 'rgba(var(--v-theme-borderColor), 0.3)'
            },
            ticks: {
              color: 'rgb(var(--v-theme-textSecondary))'
            }
          }
        }
      }
    })
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Model Cost Distribution</v-card-title>
      <div class="chart-container">
        <canvas ref="chartRef"></canvas>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped lang="scss">
.chart-container {
  position: relative;
  height: 320px;
  width: 100%;
}
</style>