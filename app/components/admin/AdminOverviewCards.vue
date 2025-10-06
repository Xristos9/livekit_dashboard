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
  <v-row v-if="cards.length">
    <v-col v-for="card in cards" :key="card.title" cols="12" md="4">
      <v-card class="overview-card" elevation="10">
        <v-card-item>
          <div class="card-content">
            <div class="card-info">
              <div class="card-label">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
              <div class="card-subtitle">{{ card.subtitle }}</div>
            </div>
            <v-avatar class="card-icon" color="primary" size="56">
              <v-icon :icon="card.icon" size="28" color="white"></v-icon>
            </v-avatar>
          </div>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
  <v-alert v-else color="warning" variant="tonal" prominent>
    No data available for the selected period.
  </v-alert>
</template>

<style scoped lang="scss">
.overview-card {
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }

  .card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .card-info {
    flex: 1;
  }

  .card-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: rgb(var(--v-theme-textSecondary));
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: rgb(var(--v-theme-textPrimary));
    margin-top: 0.5rem;
  }

  .card-subtitle {
    font-size: 0.75rem;
    color: rgb(var(--v-theme-textSecondary));
    margin-top: 0.25rem;
    line-height: 1.4;
  }

  .card-icon {
    flex-shrink: 0;
  }
}
</style>
