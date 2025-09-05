<script setup lang="ts">
import type { CallReason } from '@/types/ai-dashboard'

const props = defineProps<{
  reasons: CallReason[]
}>()

const labels = computed(() => (props.reasons ?? []).map(r => r.reason))
const series = computed(() => (props.reasons ?? []).map(r => r.count))

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
    formatter: (seriesName: string, opts: any) => {
      const percent = opts.w.globals.seriesPercent[opts.seriesIndex][0]
      return `${seriesName} - ${percent.toFixed(1)}%`
    },
  },
  colors: [
    'rgba(var(--v-theme-primary))',
    'rgba(var(--v-theme-secondary))',
    'rgba(var(--v-theme-success))',
    'rgba(var(--v-theme-warning))',
    'rgba(var(--v-theme-error))',
    'rgba(var(--v-theme-info))',
  ],
  dataLabels: {
    formatter: (_: any, opts: any) => `${opts.w.globals.seriesPercent[opts.seriesIndex][0].toFixed(1)}%`,
  },
  stroke: { colors: ['rgba(var(--v-theme-surface))'], width: 2 },
  noData: { text: 'No data' },
}))
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Call Reasons</v-card-title>
      <div class="mx-3 mt-4 pt-2 pb-3">
        <apexchart
          type="donut"
          height="320"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </v-card-item>
  </v-card>
</template>


