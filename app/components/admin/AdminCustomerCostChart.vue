<script setup lang="ts">
import type { AdminCustomerSummary } from '@/types/admin'

const props = defineProps<{
  customers: AdminCustomerSummary[]
  currency?: string
}>()

const currencyFormatter = computed(() =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: props.currency || 'EUR',
    maximumFractionDigits: 2,
  })
)

const chartData = computed(() => {
  const sorted = [...(props.customers || [])].sort((a, b) => b.totalCost - a.totalCost)
  const top = sorted.slice(0, 10)
  const categories = top.map((customer) => customer.name || 'Unknown')
  return {
    categories,
    totalCost: top.map((customer) => Number(customer.totalCost.toFixed(2))),
    openAiCost: top.map((customer) => Number(customer.openAiCost.toFixed(2))),
    profit: top.map((customer) => Number(customer.profit.toFixed(2))),
  }
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    },
  },
  colors: [
    'rgba(var(--v-theme-primary))',
    'rgba(var(--v-theme-secondary))',
    '#3CB371',
  ],
  dataLabels: { enabled: false },
  xaxis: {
    categories: chartData.value.categories,
    labels: {
      rotate: -30,
      rotateAlways: false,
      trim: true,
      style: { fontSize: '12px' },
    },
  },
  yaxis: {
    labels: {
      formatter: (value: number) => currencyFormatter.value.format(value ?? 0),
    },
  },
  tooltip: {
    y: {
      formatter: (value: number) => currencyFormatter.value.format(value ?? 0),
    },
  },
  legend: {
    position: 'top',
  },
}))

const chartSeries = computed(() => [
  { name: 'Total Cost', data: chartData.value.totalCost },
  { name: 'OpenAI Cost', data: chartData.value.openAiCost },
  { name: 'Profit', data: chartData.value.profit },
])
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="chart-title">Top Customers by Cost</v-card-title>
      <v-card-subtitle class="chart-subtitle">Comparison of billable cost, OpenAI spend, and profit.</v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <div v-if="chartData.categories.length">
        <apexchart type="bar" height="360" :series="chartSeries" :options="chartOptions" />
      </div>
      <v-alert v-else color="info" variant="tonal" prominent>No customer cost data is available.</v-alert>
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
