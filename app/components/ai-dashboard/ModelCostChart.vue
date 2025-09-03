<script setup lang="ts">
import type { ModelCost } from '@/types/ai-dashboard'

const props = defineProps<{
  modelCosts: ModelCost[]
}>()

const categories = computed(() => (props.modelCosts ?? []).map((m) => m.model))
const series = computed(() => [
  { name: 'Total Cost', data: (props.modelCosts ?? []).map((m) => m.cost) },
])
console.log(series.value);


const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
    foreColor: '#adb0bb',
    offsetX: -15,
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '60%',
      columnWidth: '15%',
      borderRadius: [6],
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'all',
    },
  },
  fill: {
    type: 'solid',
    opacity: 0.1,
  },
  colors: ['rgba(var(--v-theme-primary))'],
  dataLabels: { enabled: false },
  grid: {
    show: true,
    padding: {
      top: 0,
      bottom: 0,
      right: 0,
    },
    borderColor: 'rgba(0,0,0,0.05)',
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  xaxis: {
    title: { text: 'Cost (USD)' },
    categories: categories.value,
    axisBorder: {
      show: false,
    },
    labels: {
      style: { fontSize: '13px', colors: '#adb0bb', fontWeight: '400' },
    },
  },
  legend: { show: false },
  noData: { text: 'No data' },
}))
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Model Cost Distribution</v-card-title>
      <div class="mx-3 mt-4 pt-2">
        <apexchart type="bar" height="320" :options="chartOptions" :series="series" />
      </div>
    </v-card-item>
  </v-card>
</template>
