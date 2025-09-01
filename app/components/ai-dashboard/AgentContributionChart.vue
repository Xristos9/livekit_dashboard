<script setup lang="ts">
import type { AgentCost } from '@/types/ai-dashboard'

const props = defineProps<{
  agentCosts: AgentCost[]
}>()

const labels = computed(() => (props.agentCosts ?? []).map(a => a.agent))
const series = computed(() => (props.agentCosts ?? []).map(a => a.cost))

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  labels: labels.value,
  legend: {
    position: 'right',
    markers: { width: 12, height: 12 },
  },
  colors: [
    'rgb(var(--v-theme-primary))',
    'rgb(var(--v-theme-secondary))',
    'rgb(var(--v-theme-success))',
    'rgb(var(--v-theme-warning))',
    'rgb(var(--v-theme-error))',
    'rgb(var(--v-theme-info))'
  ],
  stroke: { colors: ['rgb(var(--v-theme-surface))'], width: 2 },
  dataLabels: { enabled: false },
  noData: { text: 'No data' },
}))

const ready = computed(() => Array.isArray(series.value) && series.value.length > 0 && labels.value.length > 0)
const chartKey = computed(() => (ready.value ? labels.value.join('|') : 'empty'))
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Agent Contribution</v-card-title>
      <div class="chart-container">
        <client-only>
          <apexchart
            :key="chartKey"
            v-if="ready"
            type="donut"
            height="320"
            :options="chartOptions"
            :series="series"
          />
          <div v-else class="d-flex align-center justify-center h-100">No data</div>
        </client-only>
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
