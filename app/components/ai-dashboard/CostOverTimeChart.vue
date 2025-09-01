<script setup lang="ts">
import type { Session } from '@/types/ai-dashboard'

const props = defineProps<{
  sessions: Session[]
}>()

const costByDate = computed<{ labels: string[]; values: (number | null)[] }>(() => {
  const grouped = props.sessions.reduce(
    (acc, session) => {
      acc[session.date] = (acc[session.date] || 0) + session.cost
      return acc
    },
    {} as Record<string, number>
  )

  const labels = Object.keys(grouped).sort()
  const values = labels.map((date) => grouped[date] ?? null)

  return { labels, values }
})

const series = computed(() => [
  {
    name: 'Total Cost (USD)',
    data: costByDate.value.values,
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  colors: ['rgb(var(--v-theme-primary))'],
  stroke: {
    curve: 'smooth',
  },
  fill: {
    type: 'solid',
    opacity: 0.1,
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: 'rgba(var(--v-theme-borderColor), 0.3)',
  },
  xaxis: {
    categories: costByDate.value.labels,
    axisBorder: { color: 'rgba(var(--v-theme-borderColor), 0.3)' },
    labels: {
      style: { colors: 'rgb(var(--v-theme-textSecondary))' },
    },
  },
  yaxis: {
    labels: {
      style: { colors: 'rgb(var(--v-theme-textSecondary))' },
    },
  },
  legend: { show: false },
}))
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Cost Over Time</v-card-title>
      <div class="chart-container">
        <client-only>
          <apexchart type="line" height="320" :options="chartOptions" :series="series" />
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
