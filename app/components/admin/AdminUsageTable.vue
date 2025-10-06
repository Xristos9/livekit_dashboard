<script setup lang="ts">
import type { AdminCustomerSummary } from '@/types/admin'

const props = defineProps<{
  customers: AdminCustomerSummary[]
  currency?: string
}>()

const search = ref('')

const headers = [
  { title: 'Customer', key: 'name' },
  { title: 'Sessions', key: 'totalSessions', align: 'end' },
  { title: 'Minutes', key: 'totalMinutes', align: 'end' },
  { title: 'Avg. Duration (min)', key: 'averageSessionDurationMinutes', align: 'end' },
  { title: 'Cost', key: 'totalCost', align: 'end' },
  { title: 'OpenAI Cost', key: 'openAiCost', align: 'end' },
  { title: 'Commission', key: 'commission', align: 'end' },
  { title: 'Profit', key: 'profit', align: 'end' },
  { title: 'Peak Day', key: 'peakUsageDay' },
  { title: 'Peak Hour (UTC)', key: 'peakUsageHour', align: 'end' },
  { title: 'Last Session', key: 'lastSessionAt' },
]

const currencyFormatter = computed(() =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: props.currency || 'EUR',
    maximumFractionDigits: 2,
  })
)

const numberFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
const minuteFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 })

const filtered = computed(() => {
  if (!search.value) return props.customers
  const needle = search.value.toLowerCase()
  return props.customers.filter((customer) =>
    [customer.name, customer.email, customer.trunkId, customer.username]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(needle))
  )
})

function escapeCsv(value: unknown) {
  if (value === null || value === undefined) return ''
  const stringValue = String(value)
  if (/[,"\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const headerLine = headers.map(escapeCsv).join(',')
  const lines = rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(','))
  return [headerLine, ...lines].join('\r\n')
}

function downloadCsv() {
  if (!process.client || !filtered.value.length) return
  const rows = filtered.value.map((customer) => ({
    Name: customer.name,
    Email: customer.email || '',
    Username: customer.username || '',
    'Total Sessions': customer.totalSessions,
    'Total Minutes': Number(customer.totalMinutes.toFixed(2)),
    'Average Session Duration (min)': Number(customer.averageSessionDurationMinutes.toFixed(2)),
    'Total Cost': Number(customer.totalCost.toFixed(2)),
    'OpenAI Cost': Number(customer.openAiCost.toFixed(2)),
    Commission: Number(customer.commission.toFixed(2)),
    Profit: Number(customer.profit.toFixed(2)),
    'Peak Usage Day': customer.peakUsageDay || '',
    'Peak Usage Hour (UTC)': customer.peakUsageHour ?? '',
    'Last Session': customer.lastSessionAt || '',
  }))
  const csv = toCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `customer-usage-${Date.now()}.csv`)
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <v-card elevation="10" class="usage-table-card">
    <v-card-item>
      <div class="table-header">
        <div class="header-info">
          <v-card-title class="table-title">Customer Usage Details</v-card-title>
          <v-card-subtitle class="table-subtitle">Granular metrics for deeper analysis.</v-card-subtitle>
        </div>
        <div class="header-actions">
          <v-text-field
            v-model="search"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            placeholder="Search customers"
            class="search-field"
          />
          <v-btn color="primary" variant="flat" :disabled="!filtered.length" @click="downloadCsv" prepend-icon="mdi-download">
            Export CSV
          </v-btn>
        </div>
      </div>
    </v-card-item>
    <v-data-table
      :headers="headers"
      :items="filtered"
      class="elevation-0 custom-table"
      :items-per-page="10"
      hover
    >
      <template #item.totalSessions="{ value }">
        {{ numberFormatter.format(value ?? 0) }}
      </template>
      <template #item.totalMinutes="{ value }">
        {{ minuteFormatter.format(value ?? 0) }}
      </template>
      <template #item.averageSessionDurationMinutes="{ value }">
        {{ minuteFormatter.format(value ?? 0) }}
      </template>
      <template #item.totalCost="{ value }">
        {{ currencyFormatter.format(value ?? 0) }}
      </template>
      <template #item.openAiCost="{ value }">
        {{ currencyFormatter.format(value ?? 0) }}
      </template>
      <template #item.commission="{ value }">
        {{ currencyFormatter.format(value ?? 0) }}
      </template>
      <template #item.profit="{ value }">
        {{ currencyFormatter.format(value ?? 0) }}
      </template>
      <template #item.lastSessionAt="{ value }">
        <span v-if="value">{{ new Date(value).toLocaleString() }}</span>
        <span v-else>-</span>
      </template>
      <template #bottom>
        <v-divider />
        <div class="table-footer">
          Showing {{ filtered.length }} of {{ props.customers.length }} customers.
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped lang="scss">
.usage-table-card {
  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .header-info {
    .table-title {
      font-size: 1.25rem;
      font-weight: 600;
      padding: 0;
    }

    .table-subtitle {
      font-size: 0.875rem;
      padding: 0;
      margin-top: 0.25rem;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .search-field {
      min-width: 260px;
    }
  }

  .custom-table {
    :deep(thead) {
      background-color: rgb(var(--v-theme-grey100));

      th {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.75rem;
      }
    }

    :deep(tbody tr) {
      transition: background-color 0.15s ease;

      &:hover {
        background-color: rgb(var(--v-theme-hoverColor)) !important;
      }
    }
  }

  .table-footer {
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
    color: rgb(var(--v-theme-textSecondary));
  }
}
</style>
