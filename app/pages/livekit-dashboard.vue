<template>
  <div class="livekit-dashboard">
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
              <!-- <input
                v-model="prefix"
                class="prefix-input"
                placeholder="Optional prefix/folder (e.g. 2025-08-22/)"
              /> -->
              <input
                v-model.number="jsonLimit"
                type="number"
                min="1"
                max="200"
                class="limit-input"
                placeholder="Limit"
              />
              <button @click="load({ reset: true })" class="load-button">Load</button>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <p v-if="error" class="error-message">
      {{ error }}
    </p>

    <div v-if="records.length" class="records-grid">
      <RecordingCard
        v-for="r in records"
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
const { prefix, jsonLimit, jsonConcurrency, records, loading, error, load, fileUrl } = useSpaces()

onMounted(() => {
  // Optional: auto-load initial batch
  // load({ reset: true })
})
</script>
