<script setup lang="ts">
import type { AgentCost } from '@/types/dashboard'

const props = defineProps<{
  agentCosts: AgentCost[]
}>()

const labels = computed(() => (props.agentCosts ?? []).map((a) => a.agent))
const series = computed(() => (props.agentCosts ?? []).map((a) => a.cost))

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
    'rgba(var(--v-theme-primary))',
    'rgba(var(--v-theme-secondary))',
    'rgba(var(--v-theme-success))',
    'rgba(var(--v-theme-warning))',
    'rgba(var(--v-theme-error))',
    'rgba(var(--v-theme-info))',
  ],
  stroke: { colors: ['rgba(var(--v-theme-surface))'], width: 2 },
  dataLabels: { enabled: false },
  noData: { text: 'No data' },
}))
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3 pb-5">Agent Contribution</v-card-title>
      <div class="mx-3 mt-4 pt-2 pb-3">
        <apexchart type="donut" height="320" :options="chartOptions" :series="series" />
      </div>
    </v-card-item>
  </v-card>
</template>
