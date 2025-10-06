<script setup lang="ts">
import type { KPIData } from '@/types/dashboard'

const props = defineProps<{
  data: KPIData
}>()

function formatEUR(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}
</script>

<template>
  <v-row class="kpi-cards">
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="kpi-card">
        <v-card-item>
          <div class="kpi-label">Total Sessions</div>
          <div class="kpi-value">{{ props.data.totalSessions }}</div>
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="kpi-card">
        <v-card-item>
          <div class="kpi-label">Total Cost</div>
          <div class="kpi-value">{{ formatEUR(props.data.totalCost) }}</div>
          <!-- <div class="kpi-delta">+9% vs last period</div> -->
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="kpi-card">
        <v-card-item>
          <div class="kpi-label">Avg. Session Duration</div>
          <div class="kpi-value">{{ Math.round(props.data.avgDuration) }} s</div>
          <!-- <div class="kpi-delta">-5% vs last period</div> -->
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" lg="3">
      <v-card elevation="10" class="kpi-card">
        <v-card-item>
          <div class="kpi-label">Avg. Cost per Session</div>
          <div class="kpi-value">{{ formatEUR(props.data.avgCostPerSession) }}</div>
          <!-- <div class="kpi-delta">-3% vs last period</div> -->
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>
