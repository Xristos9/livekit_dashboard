<script setup lang="ts">
import type { Call, CallStats } from '@/types/cold-calling'

useHead({
  title: 'Cold Calling Stats - Abyssaltech AI',
  meta: [
    {
      name: 'description',
      content: 'Monitor cold calling performance and manage callback leads for your sales team.',
    },
  ],
})

const { data, pending, error, refresh } = await useFetch<{
  calls: Call[]
  callbacks: Call[]
  stats: CallStats
}>('/api/cold-calling')

const calls = computed(() => data.value?.calls ?? [])
const callbacks = computed(() => data.value?.callbacks ?? [])
const stats = computed(() => data.value?.stats ?? {
  totalCalls: 0,
  callbacks: 0,
  negative: 0,
  callbackPercentage: 0,
  negativePercentage: 0,
})

const selectedRange = ref('This Month')
const rangeOptions = ['This Month', 'Last 30 Days', 'Custom']
</script>

<template>
  <div class="cold-calling-dashboard">
    <!-- Header -->
    <div class="dashboard-header mb-6">
      <div>
        <h1 class="dashboard-title">Cold Calling Dashboard</h1>
        <p class="dashboard-subtitle">Monitor outbound calling performance and manage callback leads</p>
      </div>
      <div class="range-selector">
        <v-btn-toggle v-model="selectedRange" variant="outlined" color="primary" mandatory>
          <v-btn v-for="option in rangeOptions" :key="option" :value="option" size="small">
            {{ option }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-muted">Loading call data...</p>
    </div>

    <!-- Error State -->
    <v-alert v-else-if="error" type="error" class="mb-6">
      Failed to load call data: {{ error.statusMessage || error.message }}
      <template #append>
        <v-btn @click="refresh()" variant="text" size="small">
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Stats Chart -->
      <v-row class="mb-6">
        <v-col cols="12">
          <ColdCallingCallStatsChart :stats="stats" />
        </v-col>
      </v-row>

      <!-- Callback Table -->
      <v-row>
        <v-col cols="12">
          <ColdCallingCallbackTable :callbacks="callbacks" />
        </v-col>
      </v-row>

      <!-- Refresh Button -->
      <div class="text-center mt-6">
        <v-btn @click="refresh()" variant="outlined" prepend-icon="mdi-refresh">
          Refresh Data
        </v-btn>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.cold-calling-dashboard {
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

  .text-muted {
    color: rgb(var(--v-theme-textSecondary));
  }
}
</style>