<script setup lang="ts">
import type { Session } from '@/types/ai-dashboard'

const props = defineProps<{
  sessions: Session[]
}>()

const sortedSessions = computed(() => {
  return [...props.sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
            <th>Agent</th>
            <th>Model</th>
            <th>Cost (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sortedSessions" :key="session.id">
            <td>
              <v-chip 
                size="small" 
                variant="tonal" 
                color="primary"
                class="session-badge"
              >
                {{ session.id }}
              </v-chip>
            </td>
            <td>{{ session.date }}</td>
            <td>{{ session.duration }}</td>
            <td>{{ session.agent }}</td>
            <td>{{ session.model }}</td>
            <td>{{ formatUSD(session.cost) }}</td>
          </tr>
        </tbody>
      </v-table>
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