<script setup lang="ts">
import type { Session } from '@/types/dashboard'

const props = defineProps<{
  sessions: Session[]
}>()

const search = ref('')

type SortKey = 'id' | 'date' | 'duration' | 'agents' | 'model' | 'cost'

const columns: Array<{
  key: SortKey
  label: string
}> = [
  { key: 'id', label: 'Session ID' },
  { key: 'date', label: 'Date' },
  { key: 'duration', label: 'Duration (s)' },
  { key: 'agents', label: 'Agents' },
  { key: 'cost', label: 'Cost' },
]

const sortKey = ref<SortKey>('date')
const sortDesc = ref(true)

function getSortValue(session: Session, key: SortKey) {
  switch (key) {
    case 'id':
      return session.id ?? ''
    case 'date':
      return new Date(session.date).getTime() || 0
    case 'duration':
      return session.duration ?? 0
    case 'agents':
      return session.agents.join(', ')
    case 'model':
      return session.model ?? ''
    case 'cost':
      return session.cost ?? 0
    default:
      return ''
  }
}

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDesc.value = !sortDesc.value
  } else {
    sortKey.value = key
    sortDesc.value = key === 'date' ? true : false
  }
}

const filteredSessions = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) {
    return props.sessions
  }

  return props.sessions.filter((session) => {
    const id = session.id?.toLowerCase() ?? ''
    const roomName = session.roomName?.toLowerCase() ?? ''

    return id.includes(term) || roomName.includes(term)
  })
})

const sortedSessions = computed(() => {
  const key = sortKey.value
  const desc = sortDesc.value

  return [...filteredSessions.value].sort((a, b) => {
    const valueA = getSortValue(a, key)
    const valueB = getSortValue(b, key)

    if (valueA == null && valueB == null) return 0
    if (valueA == null) return desc ? 1 : -1
    if (valueB == null) return desc ? -1 : 1

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return desc ? valueB - valueA : valueA - valueB
    }

    const stringA = String(valueA)
    const stringB = String(valueB)
    return desc ? stringB.localeCompare(stringA) : stringA.localeCompare(stringB)
  })
})

const page = ref(1)
const itemsPerPage = 5
const pageCount = computed(() => Math.ceil(sortedSessions.value.length / itemsPerPage) || 1)
const paginatedSessions = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return sortedSessions.value.slice(start, start + itemsPerPage)
})

watch(
  () => search.value,
  () => {
    page.value = 1
  }
)

watch(
  () => [sortKey.value, sortDesc.value],
  () => {
    page.value = 1
  }
)

function recordingLink(session: Session) {
  const query: Record<string, string> = {}
  const roomQuery = session.roomName?.trim()
  if (roomQuery) {
    query.roomName = roomQuery
  } else if (session.id) {
    query.roomName = session.id
  }
  return {
    path: '/recordings',
    query,
  }
}

function formatEUR(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(n)
}
</script>

<template>
  <v-card elevation="10" class="sessions-table-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-3">Recent Sessions</v-card-title>
      <v-text-field
        v-model="search"
        class="mb-4"
        density="comfortable"
        placeholder="Search by session ID"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        hide-details
        clearable
      />
      <v-table class="sessions-table">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="sortable"
              @click="toggleSort(column.key)"
            >
              <span>{{ column.label }}</span>
              <v-icon
                size="16"
                class="ml-1"
                :icon="
                  sortKey === column.key
                    ? sortDesc
                      ? 'mdi-arrow-down'
                      : 'mdi-arrow-up'
                    : 'mdi-swap-vertical'
                "
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in paginatedSessions" :key="session.id">
            <td>
              <v-chip
                v-if="session.id"
                :to="recordingLink(session)"
                size="small"
                variant="tonal"
                color="primary"
                class="session-badge"
                link
              >
                {{ session.id }}
              </v-chip>
              <span v-else>{{ session.id }}</span>
            </td>
            <td>{{ session.date }}</td>
            <td>{{ session.duration }}</td>
            <td>{{ session.agents.join(', ') }}</td>
            <td>{{ formatEUR(session.cost) }}</td>
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
    cursor: pointer;
    user-select: none;
    align-items: center;
    justify-content: flex-start;
    gap: 0.25rem;
  }

  td {
    font-size: 0.8125rem;
    color: rgb(var(--v-theme-textPrimary));
  }

  .session-badge {
    font-size: 0.75rem;
    cursor: pointer;
  }
}
</style>
