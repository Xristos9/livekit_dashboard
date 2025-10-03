<template>
  <div class="recordings-page">
    <v-row>
      <v-col cols="12" md="12">
        <v-card elevation="10">
          <v-card-item>
            <div class="dashboard-header">
              <div>
                <h1 class="dashboard-title">Recordings</h1>
              </div>
            </div>

            <div class="controls-section">
              <!-- Filter inputs -->
              <input
                v-model="phoneFilter"
                type="text"
                class="limit-input"
                placeholder="Search by phone number"
              />
              <input
                v-model="roomFilter"
                type="text"
                class="limit-input"
                placeholder="Search by session ID"
              />
              <input
                v-model="startDate"
                type="datetime-local"
                class="limit-input"
                placeholder="Start date"
              />
              <input
                v-model="endDate"
                type="datetime-local"
                class="limit-input"
                placeholder="End date"
              />
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <p v-if="error" class="error-message">
      {{ error }}
    </p>

    <div v-if="filteredRecords.length" class="records-grid">
      <RecordingCard
        v-for="r in paginatedRecords"
        :key="r.json?.key || r.egressId || Math.random()"
        :rec="r"
        :file-url="fileUrl"
      />
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <v-pagination v-model="page" :length="totalPages" rounded density="comfortable" />
    </div>

    <p v-else-if="!loading" class="no-records">No records.</p>
    <p v-if="loading" class="loading-text">Loading…</p>
  </div>
</template>

<script setup lang="ts">
const { records, loading, error, load, fileUrl } = useSpaces()

const route = useRoute()
const router = useRouter()

// filter state
const phoneFilter = ref('')
const initialRoomQuery =
  typeof route.query.roomName === 'string'
    ? route.query.roomName
    : typeof route.query.egressId === 'string'
      ? route.query.egressId
      : ''
const roomFilter = ref(initialRoomQuery)
const startDate = ref('')
const endDate = ref('')
const page = ref(1)
const pageSize = 10

if (import.meta.client) {
  const updatingFromRoute = ref(false)
  const updatingRoute = ref(false)

  watch(
    () => [route.query.roomName, route.query.egressId],
    ([roomName, egressId]) => {
      if (updatingRoute.value) {
        updatingRoute.value = false
        return
      }
      const preferred = typeof roomName === 'string' ? roomName : null
      const fallback = !preferred && typeof egressId === 'string' ? egressId : null
      const next = preferred || fallback || ''
      if (next !== roomFilter.value) {
        updatingFromRoute.value = true
        roomFilter.value = next
      }
    },
    { immediate: true }
  )

  watch(roomFilter, async (value) => {
    if (updatingFromRoute.value) {
      updatingFromRoute.value = false
      return
    }
    const trimmed = value.trim()
    const query = { ...route.query }
    if (trimmed) {
      query.roomName = trimmed
    } else {
      delete query.roomName
    }
    delete query.egressId
    updatingRoute.value = true
    try {
      await router.replace({ path: route.path, query })
    } catch {
      // ignore navigation failures (e.g., navigating to same route)
    } finally {
      updatingRoute.value = false
    }
  })
}

// derived list applying filters
const filteredRecords = computed(() => {
  return records.value.filter((r) => {
    if (phoneFilter.value) {
      if (!(r.phoneNumber || '').includes(phoneFilter.value)) return false
    }
    const roomQuery = roomFilter.value.trim().toLowerCase()
    if (roomQuery) {
      if (!(r.roomName || '').toLowerCase().includes(roomQuery)) {
        return false
      }
    }
    const tsRaw = r.mp4?.lastModified || r.json?.lastModified
    if (tsRaw) {
      const ts = new Date(tsRaw).getTime()
      if (startDate.value && ts < new Date(startDate.value).getTime()) return false
      if (endDate.value && ts > new Date(endDate.value).getTime()) return false
    }
    return true
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredRecords.value.length / pageSize))
})

const paginatedRecords = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredRecords.value.slice(start, start + pageSize)
})

watch(filteredRecords, () => {
  const total = totalPages.value
  if (page.value > total) {
    page.value = total
  }
})

watch([phoneFilter, roomFilter, startDate, endDate], () => {
  page.value = 1
})

watch(records, () => {
  page.value = 1
})

// Additional filter ideas: by duration, file size or missing MP4

onMounted(() => {
  // Optional: auto-load initial batch
  load({ reset: true })
})
</script>
