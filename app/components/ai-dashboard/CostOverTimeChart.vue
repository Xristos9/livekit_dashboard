<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import type { Session } from '@/types/ai-dashboard'

Chart.register(...registerables)

const props = defineProps<{
  sessions: Session[]
}>()

const chartRef = ref<HTMLCanvasElement>()
let chartInstance: Chart<'line', (number | null)[], string> | null = null

const costByDate = computed<{ labels: string[]; values: (number | null)[] }>(() => {
  const grouped = props.sessions.reduce((acc, session) => {
    acc[session.date] = (acc[session.date] || 0) + session.cost
    return acc
  }, {} as Record<string, number>)
  
  const labels = Object.keys(grouped).sort()
  // Use nulls (not undefined) for gaps to satisfy Chart.js types
  const values = labels.map(date => grouped[date] ?? null)
  
  return { labels, values }
})

onMounted(() => {
  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels: costByDate.value.labels,
        datasets: [{
          label: 'Total Cost (USD)',
          data: costByDate.value.values,
          borderColor: 'rgb(var(--v-theme-primary))',
          backgroundColor: 'rgba(var(--v-theme-primary), 0.1)',
          tension: 0.35,
          fill: true
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
      <v-card-title class="text-h6 mb-3">Cost Over Time</v-card-title>
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
