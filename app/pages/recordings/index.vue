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
                placeholder="Filter by phone number"
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
        v-for="r in filteredRecords"
        :key="r.json?.key || r.egressId || Math.random()"
        :rec="r"
        :file-url="fileUrl"
      />
    </div>

    <p v-else-if="!loading" class="no-records">
      No records yet. Set options and press <em>Load</em>.
    </p>
    <p v-if="loading" class="loading-text">Loading…</p>
  </div>
</template>

<script setup lang="ts">
const { records, loading, error, load, fileUrl } = useSpaces()

// filter state
const phoneFilter = ref('')
const startDate = ref('')
const endDate = ref('')

// derived list applying filters
const filteredRecords = computed(() => {
  return records.value.filter((r) => {
    if (phoneFilter.value) {
      if (!(r.phoneNumber || '').includes(phoneFilter.value)) return false
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

// Additional filter ideas: by duration, file size or missing MP4

onMounted(() => {
  // Optional: auto-load initial batch
  load({ reset: true })
})
</script>
