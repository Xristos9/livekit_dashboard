<script setup lang="ts">
import type {
  DashboardApiPayload,
  KPIData,
} from '@/types/dashboard'

const { data } = await useFetch<DashboardApiPayload>('/api/dashboard')

const sessions = computed(() => data.value?.sessions ?? [])
const agentUsage = computed(() => data.value?.agentUsage ?? [])
const callReasons = computed(() => data.value?.callReasons ?? [])

const kpiData = computed<KPIData>(() => {
  const totalSessions = sessions.value.length
  const totalCost = sessions.value.reduce((acc, session) => acc + session.cost, 0)
  const avgDuration = totalSessions
    ? sessions.value.reduce((acc, session) => acc + session.duration, 0) / totalSessions
    : 0
  const avgCostPerSession = totalSessions ? totalCost / totalSessions : 0

  return {
    totalSessions,
    totalCost,
    avgDuration,
    avgCostPerSession,
  }
})

const selectedRange = ref('This Month')
const rangeOptions = ['This Month', 'Last 30 Days', 'Custom']
</script>

<template>
  <div class="dashboard-page">
    <header class="dashboard-header mb-6">
      <div>
        <h1 class="dashboard-title">Client AI Usage Dashboard</h1>
        <p class="dashboard-subtitle">Monitor AI agent performance, costs, and usage patterns</p>
      </div>
      <div class="range-selector">
        <v-btn-toggle v-model="selectedRange" variant="outlined" color="primary" mandatory>
          <v-btn v-for="option in rangeOptions" :key="option" :value="option" size="small">
            {{ option }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </header>

    <DashboardCardsKpiSummaryCards :data="kpiData" class="mb-6" />

    <v-row class="charts-grid">
      <v-col cols="12" lg="6">
        <DashboardChartsCostOverTimeChart :sessions="sessions" />
      </v-col>
      <v-col cols="12" lg="6">
        <DashboardChartsAgentContributionChart :agent-usage="agentUsage" />
      </v-col>
      <v-col cols="12">
        <DashboardChartsCallReasonChart :reasons="callReasons" />
      </v-col>
      <v-col cols="12">
        <DashboardTablesSessionTable :sessions="sessions" />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.dashboard-page {
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .dashboard-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: rgb(var(--v-theme-textPrimary));
      margin-bottom: 0.25rem;
      letter-spacing: 0.2px;
    }

    .dashboard-subtitle {
      color: rgb(var(--v-theme-textSecondary));
      font-size: 0.875rem;
      margin: 0;
    }

    .range-selector {
      @media (max-width: 768px) {
        width: 100%;
      }
    }
  }

  .charts-grid {
    row-gap: 1rem;
  }
}
</style>
