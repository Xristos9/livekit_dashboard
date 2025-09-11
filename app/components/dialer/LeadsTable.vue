<script setup lang="ts">
import type { Lead } from '@/types/dialer'

const props = defineProps<{
  leads: Lead[]
  loading?: boolean
}>()

const emit = defineEmits<{
  bulkAction: [action: string, leadIds: string[]]
  updateLead: [lead: Lead]
}>()

const search = ref('')
const selectedLeads = ref<string[]>([])
const selectAll = ref(false)

const filteredLeads = computed(() => {
  if (!search.value) return props.leads
  const query = search.value.toLowerCase()
  return props.leads.filter(
    (lead) =>
      lead.phone.includes(query) ||
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(query)
  )
})

const statusCounts = computed(() => {
  return props.leads.reduce(
    (acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
})

const bulkActions = [
  { title: 'Clear Selection', value: 'clear-selection' },
  { title: 'Clear List', value: 'clear-list' },
  { title: 'Keep Only Selected', value: 'keep-selected' },
  { title: 'Skip Selected', value: 'skip-selected' },
]

const handleBulkAction = (action: string) => {
  emit('bulkAction', action, selectedLeads.value)
  if (action === 'clear-selection') {
    selectedLeads.value = []
    selectAll.value = false
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedLeads.value = filteredLeads.value.map((lead) => lead.id)
  } else {
    selectedLeads.value = []
  }
}

const getStatusColor = (status: string) => {
  const colors = {
    queued: 'grey',
    dialing: 'amber',
    'in-call': 'blue',
    completed: 'success',
    failed: 'error',
    skipped: 'purple',
  }
  return colors[status as keyof typeof colors] || 'grey'
}

const getStatusText = (status: string) => {
  const texts = {
    queued: 'Queued',
    dialing: 'Dialing',
    'in-call': 'In Call',
    completed: 'Completed',
    failed: 'Failed',
    skipped: 'Skipped',
  }
  return texts[status as keyof typeof texts] || status
}

watch(
  () => props.leads,
  () => {
    selectedLeads.value = []
    selectAll.value = false
  }
)
</script>

<template>
  <div class="leads-table-container">
    <!-- Top Bar -->
    <div class="table-header">
      <div class="search-section">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search leads..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
          class="search-field"
        />

        <v-menu>
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              variant="outlined"
              prepend-icon="mdi-cog"
              :disabled="selectedLeads.length === 0"
            >
              Bulk Actions
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="action in bulkActions"
              :key="action.value"
              @click="handleBulkAction(action.value)"
            >
              <v-list-item-title>{{ action.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <div class="status-badges">
        <v-chip
          v-for="(count, status) in statusCounts"
          :key="status"
          :color="getStatusColor(status)"
          variant="tonal"
          size="small"
          class="status-chip"
        >
          {{ getStatusText(status) }}: {{ count }}
        </v-chip>
      </div>
    </div>

    <!-- Table -->
    <v-card elevation="10">
      <v-data-table
        v-model="selectedLeads"
        :headers="[
          { title: '', key: 'select', sortable: false, width: '50px' },
          { title: 'Phone', key: 'phone', width: '150px' },
          { title: 'Name', key: 'name', width: '200px' },
          { title: 'Status', key: 'status', width: '120px' },
          { title: 'Disposition', key: 'disposition', width: '150px' },
        ]"
        :items="filteredLeads"
        :loading="loading"
        item-value="id"
        show-select
        class="leads-table"
      >
        <template #item.phone="{ item }">
          <span class="phone-number">{{ item.phone }}</span>
        </template>

        <template #item.name="{ item }">
          <span>{{ `${item.firstName || ''} ${item.lastName || ''}`.trim() || '—' }}</span>
        </template>

        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item.status)" variant="tonal" size="small">
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <template #item.disposition="{ item }">
          <span>{{ item.disposition || '—' }}</span>
        </template>

        <template #bottom>
          <div class="table-footer">
            <span class="selection-count">
              {{ selectedLeads.length }} of {{ filteredLeads.length }} selected
            </span>
            <span class="total-count"> Total: {{ props.leads.length }} leads </span>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.leads-table-container {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }

    .search-section {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex: 1;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        max-width: 300px;
        flex: 1;

        @media (max-width: 768px) {
          max-width: none;
        }
      }
    }

    .status-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;

      .status-chip {
        font-size: 0.75rem;
      }
    }
  }

  .leads-table {
    .phone-number {
      font-family: 'Courier New', monospace;
      font-weight: 500;
    }

    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-top: 1px solid rgba(var(--v-theme-borderColor), 0.12);
      font-size: 0.875rem;
      color: rgb(var(--v-theme-textSecondary));

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  }
}
</style>
