<script setup lang="ts">
import type { ModelCost } from '@/types/ai-dashboard'

const props = defineProps<{
  modelCosts: ModelCost[]
}>()

const categories = computed(() => (props.modelCosts ?? []).map(m => m.model))
const series = computed(() => [
  { name: 'Total Cost', data: (props.modelCosts ?? []).map(m => m.cost) },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  plotOptions: {
    bar: { horizontal: true }
  },
  colors: ['rgb(var(--v-theme-info))'],
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
  legend: { show: false },
  noData: { text: 'No data' },
}))

const ready = computed(() => Array.isArray(series.value) && series.value[0]?.data?.length > 0)
const chartKey = computed(() => (ready.value ? categories.value.join('|') : 'empty'))
</script>

<template>
  <v-card elevation="10" class="chart-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Model Cost Distribution</v-card-title>
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
