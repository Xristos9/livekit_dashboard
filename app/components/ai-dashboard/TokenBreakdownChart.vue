<script setup lang="ts">
import type { TokenLog } from '@/types/ai-dashboard'

const props = defineProps<{
  tokenLogs: TokenLog[]
}>()

const categories = computed(() => (props.tokenLogs ?? []).map(t => t.session))

const series = computed(() => {
  const logs = props.tokenLogs ?? []
  return [
    { name: 'Prompt', data: logs.map(t => t.prompt) },
    { name: 'Completion', data: logs.map(t => t.completion) },
    { name: 'Cached', data: logs.map(t => t.cached) },
  ]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  plotOptions: {
    bar: { horizontal: false }
  },
  colors: [
    'rgb(var(--v-theme-primary))',
    'rgb(var(--v-theme-secondary))',
    'rgb(var(--v-theme-success))'
  ],
  dataLabels: { enabled: false },
  grid: { borderColor: 'rgba(var(--v-theme-borderColor), 0.3)' },
  xaxis: {
    categories: categories.value,
    axisBorder: { color: 'rgba(var(--v-theme-borderColor), 0.3)' },
    labels: { style: { colors: 'rgb(var(--v-theme-textSecondary))' } },
  },
  yaxis: {
    labels: { style: { colors: 'rgb(var(--v-theme-textSecondary))' } },
  },
  legend: { position: 'top' },
  noData: { text: 'No data' },
}))

const ready = computed(() =>
  Array.isArray(series.value) && series.value.length > 0 && categories.value.length > 0
)
const chartKey = computed(() =>
  ready.value ? `${categories.value.join('|')}-${series.value.map(s=>s.data.length).join(',')}` : 'empty'
)
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Token Usage Breakdown</v-card-title>
      <div class="chart-container">
        <client-only>
          <apexchart
            :key="chartKey"
            v-if="ready"
            type="bar"
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
