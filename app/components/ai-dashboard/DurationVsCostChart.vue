<script setup lang="ts">
import type { Session } from '@/types/ai-dashboard'

const props = defineProps<{
  sessions: Session[]
}>()

// console.log('DurationVsCostChart sessions:', props.sessions)

const series = computed(() => [
  {
    name: 'Sessions',
    data: (props.sessions ?? []).map((s) => ({ x: s.duration, y: s.cost })),
  },

])

// console.log('Duration vs Cost series:', series.value)


const chartOptions = computed(() => ({
  chart: {
    toolbar: {
      show: false,
    },
    type: 'scatter',
    fontFamily: 'inherit',
    foreColor: '#adb0bb',
    offsetX: -15,
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
  tooltip: {
    theme: 'dark',
  },
  xaxis: {
    title: { text: 'Duration (s)' },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: { fontSize: '13px', colors: '#adb0bb', fontWeight: '400' },
    },
  },
  yaxis: {
    title: { text: 'Cost (USD)' },
    labels: {
      // style: { fontSize: '13px', colors: '#adb0bb', fontWeight: '400' },
      formatter: (val: number) => {
        const n = Number(val)
        return Number.isFinite(n) ? n.toFixed(2) : ''
      },
    },
  },
  legend: { show: false },
  markers: { size: 4 },
  noData: { text: 'No data' },
}))

</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h5">Session Duration vs Cost</v-card-title>
      <div class="mx-3 mt-4 pt-2">
        <apexchart
          type="scatter"
          height="320"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </v-card-item>
  </v-card>
</template>
