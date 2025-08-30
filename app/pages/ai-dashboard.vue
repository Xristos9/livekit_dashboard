<script setup lang="ts">
import { sessions, tokenLogs, modelCosts, agentCosts } from '@/data/ai-dashboard/mockData'
import type { KPIData } from '@/types/ai-dashboard'

// Calculate KPIs
const kpiData = computed<KPIData>(() => {
  const totalSessions = sessions.length
  const totalCost = sessions.reduce((acc, s) => acc + s.cost, 0)
  const avgDuration = sessions.reduce((acc, s) => acc + s.duration, 0) / totalSessions
  const avgCostPerSession = totalCost / totalSessions

  return {
    totalSessions,
    totalCost,
    avgDuration,
    avgCostPerSession
  }
})

const selectedRange = ref('This Month')
const rangeOptions = ['This Month', 'Last 30 Days', 'Custom']
</script>

<template>
  <div class="ai-dashboard">
    <!-- Header -->
    <div class="dashboard-header mb-6">
      <div>
        <h1 class="dashboard-title">Client AI Usage Dashboard</h1>
        <p class="dashboard-subtitle">
          Monitor AI agent performance, costs, and usage patterns
        </p>
      </div>
      <div class="range-selector">
        <v-btn-toggle
          v-model="selectedRange"
          variant="outlined"
          color="primary"
          mandatory
        >
          <v-btn
            v-for="option in rangeOptions"
            :key="option"
            :value="option"
            size="small"
          >
            {{ option }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <!-- KPI Cards -->
    <KPICards :data="kpiData" class="mb-6" />

    <!-- Charts Grid -->
    <v-row class="charts-grid">
      <v-col cols="12" lg="6">
        <CostOverTimeChart :sessions="sessions" />
      </v-col>
      <v-col cols="12" lg="6">
        <TokenBreakdownChart :token-logs="tokenLogs" />
      </v-col>
      <v-col cols="12" lg="6">
        <DurationVsCostChart :sessions="sessions" />
      </v-col>
      <v-col cols="12" lg="6">
        <ModelCostChart :model-costs="modelCosts" />
      </v-col>
      <v-col cols="12">
        <AgentContributionChart :agent-costs="agentCosts" />
      </v-col>
      <v-col cols="12">
        <SessionsTable :sessions="sessions" />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.ai-dashboard {
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
    gap: 1rem;
  }
}
</style>