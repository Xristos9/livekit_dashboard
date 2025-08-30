<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import type { TokenLog } from '@/types/ai-dashboard'

Chart.register(...registerables)

const props = defineProps<{
  tokenLogs: TokenLog[]
}>()

const chartRef = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

onMounted(() => {
  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: 'bar',
      data: {
        labels: props.tokenLogs.map(t => t.session),
        datasets: [
          {
            label: 'Prompt',
            data: props.tokenLogs.map(t => t.prompt),
            backgroundColor: 'rgb(var(--v-theme-primary))'
          },
          {
            label: 'Completion',
            data: props.tokenLogs.map(t => t.completion),
            backgroundColor: 'rgb(var(--v-theme-secondary))'
          },
          {
            label: 'Cached',
            data: props.tokenLogs.map(t => t.cached),
            backgroundColor: 'rgb(var(--v-theme-success))'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'rgb(var(--v-theme-textPrimary))'
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              color: 'rgba(var(--v-theme-borderColor), 0.3)'
            },
            ticks: {
              color: 'rgb(var(--v-theme-textSecondary))'
            }
          },
          y: {
            stacked: true,
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
      <v-card-title class="text-h6 mb-3">Token Usage Breakdown</v-card-title>
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