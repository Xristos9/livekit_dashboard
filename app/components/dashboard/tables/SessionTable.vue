<script setup lang="ts">
import type { Session } from '@/types/dashboard'

const props = defineProps<{
  sessions: Session[]
}>()

const sortedSessions = computed(() => {
  return [...props.sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const page = ref(1)
const itemsPerPage = 5
const pageCount = computed(() => Math.ceil(sortedSessions.value.length / itemsPerPage))
const paginatedSessions = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return sortedSessions.value.slice(start, start + itemsPerPage)
})

function formatUSD(n: number) {
  return `$${n.toFixed(3)}`
}
</script>

<template>
  <v-card elevation="10" class="sessions-table-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Recent Sessions</v-card-title>
      <v-table class="sessions-table">
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Date</th>
            <th>Duration (s)</th>
            <th>Agents</th>
            <th>Model</th>
            <th>Cost (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in paginatedSessions" :key="session.id">
            <td>
              <v-chip size="small" variant="tonal" color="primary" class="session-badge">
                {{ session.id }}
              </v-chip>
            </td>
            <td>{{ session.date }}</td>
            <td>{{ session.duration }}</td>
            <td>{{ session.agents.join(', ') }}</td>
            <td>{{ session.model }}</td>
            <td>{{ formatUSD(session.cost) }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="d-flex mt-4 justify-center">
        <v-pagination v-model="page" :length="pageCount" density="comfortable" />
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped lang="scss">
.sessions-table {
  th {
    color: rgb(var(--v-theme-textSecondary)) !important;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  td {
    font-size: 0.8125rem;
    color: rgb(var(--v-theme-textPrimary));
  }

  .session-badge {
    font-size: 0.75rem;
  }
}
</style>
