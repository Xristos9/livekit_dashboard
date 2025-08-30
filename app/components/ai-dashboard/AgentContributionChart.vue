<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import type { AgentCost } from '@/types/ai-dashboard'

Chart.register(...registerables)

const props = defineProps<{
  agentCosts: AgentCost[]
}>()

const chartRef = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

onMounted(() => {
  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: 'pie',
      data: {
        labels: props.agentCosts.map(a => a.agent),
        datasets: [{
          data: props.agentCosts.map(a => a.cost),
          backgroundColor: [
            'rgb(var(--v-theme-primary))',
            'rgb(var(--v-theme-secondary))',
            'rgb(var(--v-theme-success))',
            'rgb(var(--v-theme-warning))',
            'rgb(var(--v-theme-error))',
            'rgb(var(--v-theme-info))'
          ],
          borderWidth: 2,
          borderColor: 'rgb(var(--v-theme-surface))'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'rgb(var(--v-theme-textPrimary))',
              usePointStyle: true,
              padding: 20
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
      <v-card-title class="text-h6 mb-3">Agent Contribution</v-card-title>
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