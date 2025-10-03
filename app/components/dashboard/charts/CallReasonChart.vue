<script setup lang="ts">
import type { CallReason } from '@/types/dashboard'

const props = defineProps<{
  reasons: CallReason[]
}>()

const labels = computed(() => (props.reasons ?? []).map((r) => r.reason))
const series = computed(() => [
  {
    name: 'Calls',
    data: (props.reasons ?? []).map((r) => r.count),
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  xaxis: {
    categories: labels.value,
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-surface))',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-surface))',
      },
    },
    title: { text: 'Calls' },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6,
      barHeight: '70%',
      dataLabels: {
        position: 'right',
      },
    },
  },
  colors: ['rgba(var(--v-theme-primary))'],
  dataLabels: {
    enabled: true,
    formatter: (val: number) => Math.round(val).toString(),
    style: {
      colors: ['rgba(var(--v-theme-on-surface))'],
    },
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} calls`,
    },
  },
  noData: { text: 'No data' },
}))
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Call Reasons</v-card-title>
      <div class="mx-3 mt-4 pt-2 pb-3">
        <apexchart type="bar" height="360" :options="chartOptions" :series="series" />
      </div>
    </v-card-item>
  </v-card>
</template>
