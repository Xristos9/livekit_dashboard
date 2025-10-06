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
  <div class="d-flex flex-column ga-6">
    <div class="d-flex justify-space-between ga-4 align-center flex-wrap">
      <div>
        <h1 class="text-h4 font-weight-bold mb-1">Customer Intelligence Dashboard</h1>
        <p class="text-body-2 text-medium-emphasis">
          Monitor aggregated usage, costs, commissions, and profitability across all customers.
        </p>
      </div>
      <div class="d-flex align-center ga-3">
        <v-select
          v-model="selectedRange"
          :items="rangeOptions"
          item-title="label"
          item-value="value"
          density="compact"
          variant="outlined"
          hide-details
          style="max-width: 220px"
          label="Date range"
        />
        <v-btn
          icon="mdi-refresh"
          color="primary"
          variant="text"
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

      <v-row class="ga-6">
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

      <AdminCustomerCostChart
        :customers="overview?.customers ?? []"
        :currency="currency"
        class="mt-4"
      />

      <AdminUsageTable :customers="overview?.customers ?? []" :currency="currency" class="mt-4" />
    </template>
  </div>
</template>
