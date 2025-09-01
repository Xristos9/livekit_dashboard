<script setup lang="ts">
import type { KPIData } from '@/types/ai-dashboard'

const props = defineProps<{
  data: KPIData
}>()

function formatUSD(n: number) {
  return `$${n.toFixed(3)}`
}
</script>

<template>
  <v-row class="kpi-cards">
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="kpi-card">
        <v-card-item>
          <div class="kpi-label">Total Sessions</div>
          <div class="kpi-value">{{ data.totalSessions }}</div>
          <!-- <div class="kpi-delta">+12% vs last period</div> -->
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="kpi-card">
        <v-card-item>
          <div class="kpi-label">Total Cost (USD)</div>
          <div class="kpi-value">{{ formatUSD(data.totalCost) }}</div>
          <!-- <div class="kpi-delta">+9% vs last period</div> -->
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="kpi-card">
        <v-card-item>
          <div class="kpi-label">Avg. Session Duration</div>
          <div class="kpi-value">{{ Math.round(data.avgDuration) }} s</div>
          <!-- <div class="kpi-delta">-5% vs last period</div> -->
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="kpi-card">
        <v-card-item>
          <div class="kpi-label">Avg. Cost per Session</div>
          <div class="kpi-value">{{ formatUSD(data.avgCostPerSession) }}</div>
          <!-- <div class="kpi-delta">-3% vs last period</div> -->
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.kpi-card {
  .kpi-label {
    color: rgb(var(--v-theme-textSecondary));
    font-size: 0.75rem;
    margin-bottom: 0.375rem;
  }

  .kpi-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: rgb(var(--v-theme-textPrimary));
    margin-bottom: 0.25rem;
  }

  .kpi-delta {
    font-size: 0.75rem;
    color: rgb(var(--v-theme-success));
  }
}
</style>
