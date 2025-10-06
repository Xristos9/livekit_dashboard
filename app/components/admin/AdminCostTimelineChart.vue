<script setup lang="ts">
import type { AdminUsageTimelineEntry } from '@/types/admin'

const props = defineProps<{
  timeline: AdminUsageTimelineEntry[]
  currency?: string
  openAiAvailable?: boolean
}>()

function formatDateLabel(dateStr: string) {
  const [yy, mm, dd] = dateStr.split('-')
  const day = Number(dd)
  const month = Number(mm)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthLabel = month >= 1 && month <= 12 ? months[month - 1] : ''
  return `${day || ''} ${monthLabel}`.trim()
}

const currencyFormatter = computed(() =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: props.currency || 'EUR',
    maximumFractionDigits: 2,
  })
)

const chartSeries = computed(() => {
  if (!props.timeline?.length) {
    return []
  }
  const totalCost = props.timeline.map((item) => Number(item.totalCost.toFixed(2)))
  const openAiCost = props.timeline.map((item) => Number(item.openAiCost.toFixed(2)))
  const profit = props.timeline.map((item) => Number(item.profit.toFixed(2)))

  return [
    { name: 'Total Cost', data: totalCost },
    { name: 'OpenAI Cost', data: openAiCost },
    { name: 'Profit', data: profit },
  ]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'inherit',
    foreColor: '#adb0bb',
  },
  colors: [
    'rgba(var(--v-theme-primary))',
    'rgba(var(--v-theme-secondary))',
    '#3CB371',
  ],
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  dataLabels: { enabled: false },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 0.4, opacityFrom: 0.5, opacityTo: 0.1, stops: [0, 90, 100] },
  },
  xaxis: {
    categories: props.timeline.map((item) => formatDateLabel(item.date)),
    labels: { style: { fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => currencyFormatter.value.format(val),
      style: { fontSize: '12px' },
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: (value: number) => currencyFormatter.value.format(value ?? 0),
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
  },
}))
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="chart-title">Cost & Profit Trend</v-card-title>
      <v-card-subtitle class="chart-subtitle">Daily totals for revenue, OpenAI cost, and profit.</v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <div v-if="chartSeries.length">
        <apexchart type="area" height="340" :series="chartSeries" :options="chartOptions" />
      </div>
      <v-alert v-else color="info" variant="tonal" prominent>
        No timeline data is available for the selected period.
      </v-alert>
      <v-alert
        v-if="!openAiAvailable"
        color="warning"
        variant="tonal"
        class="mt-4"
        prominent
      >
        <strong>OpenAI cost data unavailable.</strong> Add an <code>OPENAI_ADMIN_KEY</code> in the environment to see cost and profit insights.
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.chart-card {
  height: 100%;

  .chart-title {
    font-size: 1.25rem;
    font-weight: 600;
    padding: 0;
  }

  .chart-subtitle {
    font-size: 0.875rem;
    padding: 0;
    margin-top: 0.25rem;
  }
}
</style>
