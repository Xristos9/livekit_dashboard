<script setup lang="ts">
import type { Session } from '@/types/ai-dashboard'

const props = defineProps<{
  sessions: Session[]
}>()

const series = computed(() => [
  {
    name: 'Sessions',
    data: (props.sessions ?? []).map(s => ({ x: s.duration, y: s.cost })),
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'scatter',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  colors: ['rgb(var(--v-theme-primary))'],
  dataLabels: { enabled: false },
  grid: { borderColor: 'rgba(var(--v-theme-borderColor), 0.3)' },
  xaxis: {
    title: { text: 'Duration (s)' },
    axisBorder: { color: 'rgba(var(--v-theme-borderColor), 0.3)' },
    labels: { style: { colors: 'rgb(var(--v-theme-textSecondary))' } },
  },
  yaxis: {
    title: { text: 'Cost (USD)' },
    labels: { style: { colors: 'rgb(var(--v-theme-textSecondary))' } },
  },
  legend: { show: false },
  markers: { size: 4 },
  noData: { text: 'No data' },
}))

const ready = computed(() => Array.isArray(series.value?.[0]?.data) && series.value[0].data.length > 0)
const chartKey = computed(() => (ready.value ? series.value[0].data.length : 'empty'))
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Session Duration vs Cost</v-card-title>
      <div class="chart-container">
        <client-only>
          <apexchart
            :key="chartKey"
            v-if="ready"
            type="scatter"
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
