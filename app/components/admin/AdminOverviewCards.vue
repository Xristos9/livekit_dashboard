<script setup lang="ts">
import type { AdminTotalsSummary } from '@/types/admin'

const props = defineProps<{
  totals: AdminTotalsSummary | null
  currency?: string
  openAiAvailable?: boolean
}>()

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
})

const currencyFormatter = computed(() =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: props.currency || 'EUR',
    maximumFractionDigits: 2,
  })
)

const cards = computed(() => {
  if (!props.totals) return []
  return [
    {
      title: 'Total Minutes',
      value: numberFormatter.format(Math.round(props.totals.totalMinutes)),
      subtitle: 'Across all customers within the selected range',
      icon: 'mdi-timer-sand-complete',
    },
    {
      title: 'Total Sessions',
      value: numberFormatter.format(props.totals.totalSessions),
      subtitle: 'Completed calls handled by agents',
      icon: 'mdi-headset',
    },
    {
      title: 'Gross Revenue',
      value: currencyFormatter.value.format(props.totals.totalCost),
      subtitle: 'Billable customer minutes',
      icon: 'mdi-cash-plus',
    },
    {
      title: 'Commission',
      value: currencyFormatter.value.format(props.totals.totalCommission),
      subtitle: '0.04€ per minute commission collected',
      icon: 'mdi-percent-outline',
    },
    {
      title: 'OpenAI Cost',
      value: props.openAiAvailable
        ? currencyFormatter.value.format(props.totals.totalOpenAiCost)
        : 'Unavailable',
      subtitle: props.openAiAvailable
        ? 'Fetched via OpenAI cost API'
        : 'Provide an admin API key to view cost data',
      icon: 'mdi-api',
    },
    {
      title: 'Net Profit',
      value: currencyFormatter.value.format(props.totals.totalProfit),
      subtitle: 'Gross revenue minus OpenAI spend',
      icon: 'mdi-trending-up',
    },
  ]
})
</script>

<template>
  <v-row v-if="cards.length" class="g-4">
    <v-col v-for="card in cards" :key="card.title" cols="12" md="4">
      <v-card class="h-100" elevation="2">
        <v-card-item>
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-subtitle-1 text-medium-emphasis">{{ card.title }}</div>
              <div class="text-h5 font-weight-bold mt-2">{{ card.value }}</div>
              <div class="text-caption text-medium-emphasis mt-1">{{ card.subtitle }}</div>
            </div>
            <v-avatar color="primary" size="40">
              <v-icon :icon="card.icon" color="white"></v-icon>
            </v-avatar>
          </div>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
  <v-alert v-else color="warning" variant="tonal">
    No data available for the selected period.
  </v-alert>
</template>
