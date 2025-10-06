<script setup lang="ts">
import type { AdminOverviewPayload } from '@/types/admin'

definePageMeta({
  middleware: ['admin'],
})

const rangeOptions = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
  { label: 'Last 180 days', value: 180 },
]

const selectedRange = ref(rangeOptions[1].value)

const query = computed(() => ({
  days: selectedRange.value,
  timeline: 'true',
}))

const { data, pending, refresh, error } = await useFetch<AdminOverviewPayload>(
  '/api/admin/overview',
  {
    query,
    watch: [query],
  }
)

const overview = computed(() => data.value)
const currency = computed(() => overview.value?.meta.currency || 'EUR')
const openAiAvailable = computed(() => overview.value?.meta.openAiCostAvailable ?? false)

function refreshData() {
  refresh()
}
</script>

<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">Customer Intelligence Dashboard</h1>
        <p class="dashboard-subtitle">
          Monitor aggregated usage, costs, commissions, and profitability across all customers.
        </p>
      </div>
      <div class="header-controls">
        <v-select
          v-model="selectedRange"
          :items="rangeOptions"
          item-title="label"
          item-value="value"
          density="comfortable"
          variant="outlined"
          hide-details
          class="date-range-select"
          label="Date range"
        />
        <v-btn
          icon="mdi-refresh"
          color="primary"
          variant="tonal"
          @click="refreshData"
          :loading="pending"
        />
      </div>
    </div>

    <v-alert v-if="error" type="error" variant="tonal">
      {{ error?.statusMessage || 'Unable to load admin overview data.' }}
    </v-alert>

    <v-skeleton-loader
      v-if="pending && !overview"
      type="article"
      class="rounded-lg"
      max-width="100%"
      min-height="320"
    />

    <template v-else>
      <AdminOverviewCards
        :totals="overview?.totals ?? null"
        :currency="currency"
        :open-ai-available="openAiAvailable"
      />

      <v-row>
        <v-col cols="12" lg="8">
          <AdminCostTimelineChart
            :timeline="overview?.timeline ?? []"
            :currency="currency"
            :open-ai-available="openAiAvailable"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <AdminUsagePatternReport :reports="overview?.reports?.customerUsagePatterns ?? []" />
        </v-col>
      </v-row>

      <v-row class="mt-6">
        <v-col cols="12">
          <AdminCustomerCostChart
            :customers="overview?.customers ?? []"
            :currency="currency"
          />
        </v-col>
      </v-row>

      <v-row class="mt-6">
        <v-col cols="12">
          <AdminUsageTable :customers="overview?.customers ?? []" :currency="currency" />
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<style scoped lang="scss">
.admin-dashboard {
  max-width: 100%;
  padding: 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  .dashboard-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: rgb(var(--v-theme-textPrimary));
    margin-bottom: 0.5rem;
  }

  .dashboard-subtitle {
    font-size: 0.875rem;
    color: rgb(var(--v-theme-textSecondary));
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .date-range-select {
      min-width: 220px;
    }
  }
}
</style>
