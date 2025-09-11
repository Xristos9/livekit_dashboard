<script setup lang="ts">
import type { Call } from '@/types/cold-calling'

const props = defineProps<{
  callbacks: Call[]
}>()

const page = ref(1)
const itemsPerPage = 10
const search = ref('')

const filteredCallbacks = computed(() => {
  if (!search.value) return props.callbacks
  return props.callbacks.filter(
    (call) =>
      call.phone.includes(search.value) ||
      call.sessionId.toLowerCase().includes(search.value.toLowerCase())
  )
})

const pageCount = computed(() => Math.ceil(filteredCallbacks.value.length / itemsPerPage))

const paginatedCallbacks = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return filteredCallbacks.value.slice(start, start + itemsPerPage)
})

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Athens',
  })
}

const formatPhone = (phone: string) => {
  // Format E.164 phone number for display
  if (phone.startsWith('+30')) {
    return phone.replace('+30', '+30 ').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
  }
  return phone
}

const copyPhone = async (phone: string) => {
  try {
    await navigator.clipboard.writeText(phone)
    // You could add a toast notification here
  } catch (err) {
    console.error('Failed to copy phone number:', err)
  }
}
</script>

<template>
  <v-card elevation="10" class="callback-table-card">
    <v-card-item>
      <div class="d-flex justify-space-between align-center mb-4">
        <v-card-title class="text-h6 pa-0">Callback List</v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search phone or session..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
          style="max-width: 300px"
        />
      </div>

      <div class="mb-3">
        <v-chip color="success" variant="tonal" size="small">
          {{ filteredCallbacks.length }} callback{{ filteredCallbacks.length !== 1 ? 's' : '' }}
          pending
        </v-chip>
      </div>

      <v-table class="callback-table">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Phone Number</th>
            <th>Callback Scheduled</th>
            <th>Call Received</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="callback in paginatedCallbacks" :key="callback.id">
            <td>
              <v-chip size="small" variant="tonal" color="primary">
                {{ callback.sessionId }}
              </v-chip>
            </td>
            <td>
              <div class="phone-cell">
                <span class="phone-number">{{ formatPhone(callback.phone) }}</span>
                <v-btn
                  icon
                  size="x-small"
                  variant="text"
                  @click="copyPhone(callback.phone)"
                  class="ml-2"
                >
                  <v-icon size="16">mdi-content-copy</v-icon>
                </v-btn>
              </div>
            </td>
            <td>
              <span v-if="callback.callbackAt" class="callback-time">
                {{ formatDateTime(callback.callbackAt) }}
              </span>
              <span v-else class="text-muted">—</span>
            </td>
            <td>
              <span class="created-time">
                {{ formatDateTime(callback.createdAt) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <v-btn
                  :href="`tel:${callback.phone}`"
                  color="success"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-phone"
                >
                  Call
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <div v-if="pageCount > 1" class="d-flex mt-4 justify-center">
        <v-pagination v-model="page" :length="pageCount" density="comfortable" />
      </div>

      <div v-if="filteredCallbacks.length === 0" class="py-8 text-center">
        <v-icon size="48" color="muted" class="mb-2">mdi-phone-off</v-icon>
        <p class="text-muted">
          {{ search ? 'No callbacks match your search.' : 'No callbacks available.' }}
        </p>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped lang="scss">
.callback-table-card {
  .callback-table {
    th {
      color: rgb(var(--v-theme-textSecondary)) !important;
      font-size: 0.8125rem;
      font-weight: 500;
    }

    td {
      font-size: 0.8125rem;
      color: rgb(var(--v-theme-textPrimary));
    }

    .phone-cell {
      display: flex;
      align-items: center;

      .phone-number {
        font-family: 'Courier New', monospace;
        font-weight: 500;
      }
    }

    .callback-time {
      color: rgb(var(--v-theme-warning));
      font-weight: 500;
    }

    .created-time {
      color: rgb(var(--v-theme-textSecondary));
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
  }

  .text-muted {
    color: rgb(var(--v-theme-textSecondary));
  }
}
</style>
