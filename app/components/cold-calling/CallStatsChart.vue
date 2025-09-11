<script setup lang="ts">
import type { CallStats } from '@/types/cold-calling'

const props = defineProps<{
  stats: CallStats
}>()

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  labels: ['Callbacks (Success)', 'Negative'],
  legend: {
    position: 'bottom',
    markers: { width: 12, height: 12 },
    fontSize: '14px',
  },
  colors: ['rgba(var(--v-theme-success))', 'rgba(var(--v-theme-error))'],
  stroke: { colors: ['rgba(var(--v-theme-surface))'], width: 2 },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
    style: {
      fontSize: '14px',
      fontWeight: 600,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Calls',
            fontSize: '16px',
            fontWeight: 600,
            color: 'rgb(var(--v-theme-textPrimary))',
            formatter: () => props.stats.totalCalls.toString(),
          },
        },
      },
    },
  },
  noData: { text: 'No data available' },
}))

const series = computed(() => [props.stats.callbacks, props.stats.negative])
</script>

<template>
  <v-card elevation="10" class="stats-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-4">Call Success Rate</v-card-title>

      <!-- Summary Stats -->
      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalCalls }}</div>
            <div class="stat-label">Total Calls</div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="stat-item success">
            <div class="stat-value">{{ stats.callbacks }}</div>
            <div class="stat-label">Callbacks</div>
            <div class="stat-percentage">{{ stats.callbackPercentage.toFixed(1) }}%</div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="stat-item error">
            <div class="stat-value">{{ stats.negative }}</div>
            <div class="stat-label">Negative</div>
            <div class="stat-percentage">{{ stats.negativePercentage.toFixed(1) }}%</div>
          </div>
        </v-col>
      </v-row>

      <!-- Chart -->
      <div class="chart-container">
        <apexchart type="donut" height="300" :options="chartOptions" :series="series" />
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped lang="scss">
.stats-card {
  .stat-item {
    text-align: center;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(var(--v-theme-surface), 0.5);

    &.success {
      background: rgba(var(--v-theme-success), 0.1);
      border: 1px solid rgba(var(--v-theme-success), 0.2);
    }

    &.error {
      background: rgba(var(--v-theme-error), 0.1);
      border: 1px solid rgba(var(--v-theme-error), 0.2);
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: rgb(var(--v-theme-textPrimary));
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: rgb(var(--v-theme-textSecondary));
      margin-bottom: 0.25rem;
    }

    .stat-percentage {
      font-size: 0.75rem;
      font-weight: 600;

      .success & {
        color: rgb(var(--v-theme-success));
      }

      .error & {
        color: rgb(var(--v-theme-error));
      }
    }
  }

  .chart-container {
    margin-top: 1rem;
  }
}
</style>
