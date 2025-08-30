<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import type { Session } from '@/types/ai-dashboard'

Chart.register(...registerables)

const props = defineProps<{
  sessions: Session[]
}>()

const chartRef = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

onMounted(() => {
  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Sessions',
          data: props.sessions.map(s => ({ x: s.duration, y: s.cost })),
          backgroundColor: 'rgb(var(--v-theme-primary))',
          borderColor: 'rgb(var(--v-theme-primary))',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Duration (s)',
              color: 'rgb(var(--v-theme-textPrimary))'
            },
            grid: {
              color: 'rgba(var(--v-theme-borderColor), 0.3)'
            },
            ticks: {
              color: 'rgb(var(--v-theme-textSecondary))'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cost (USD)',
              color: 'rgb(var(--v-theme-textPrimary))'
            },
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
      <v-card-title class="text-h6 mb-3">Session Duration vs Cost</v-card-title>
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