<template>
  <main class="livekit-dashboard">
    <header class="dashboard-header">
      <div>
        <h1 class="dashboard-title">LiveKit Egress — Dashboard</h1>
        <p class="dashboard-subtitle">
          Browse .json logs and .mp4 recordings from your DigitalOcean Space.
        </p>
      </div>
    </header>

    <section class="controls-section">
      <input
        v-model="prefix"
        class="prefix-input"
        placeholder="Optional prefix/folder (e.g. 2025-08-22/)"
      />
      <input
        v-model.number="jsonLimit"
        type="number"
        min="1"
        max="200"
        class="limit-input"
        placeholder="jsonLimit"
      />
      <button
        @click="load({ reset: true })"
        class="load-button"
      >
        Load
      </button>
    </section>

    <p
      v-if="error"
      class="error-message"
    >
      {{ error }}
    </p>

    <section
      v-if="records.length"
      class="records-grid"
    >
      <RecordingCard
        v-for="r in records"
        :key="r.json?.key || r.egressId || Math.random()"
        :rec="r"
        :file-url="fileUrl"
      />
    </section>

    <p v-else-if="!loading" class="no-records">
      No records yet. Set options and press <em>Load</em>.
    </p>
    <p v-if="loading" class="loading-text">Loading…</p>
  </main>
</template>

<script setup lang="ts">
// Types
type RecordPair = {
  egressId: string | null;
  roomId: string | null;
  roomName: string | null;
  startedAt: number | null;
  endedAt: number | null;
  durationSeconds: number | null;
  phoneNumber: string | null;
  json: { key: string; size?: number; lastModified?: string } | null;
  mp4: { key: string; size?: number; lastModified?: string } | null;
};

// Composable for spaces functionality
function useSpaces() {
  const prefix = ref('');
  const jsonLimit = ref(25);
  const jsonConcurrency = ref(3);
  const records = ref<RecordPair[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async ({ reset = false } = {}) => {
    if (reset) {
      records.value = [];
    }
    
    loading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams({
        prefix: prefix.value,
        jsonLimit: jsonLimit.value.toString(),
        jsonConcurrency: jsonConcurrency.value.toString(),
      });

      const response = await $fetch<RecordPair[]>(`/api/spaces/list?${params}`);
      records.value = response;
    } catch (err: any) {
      error.value = err.message || 'Failed to load records';
      console.error('Load error:', err);
    } finally {
      loading.value = false;
    }
  };

  const fileUrl = (key?: string | null) => {
    if (!key) return '';
    return `/api/spaces/file?key=${encodeURIComponent(key)}`;
  };

  return {
    prefix,
    jsonLimit,
    jsonConcurrency,
    records,
    loading,
    error,
    load,
    fileUrl,
  };
}

const { prefix, jsonLimit, jsonConcurrency, records, loading, error, load, fileUrl } = useSpaces();

onMounted(() => {
  // Optional: auto-load initial batch
  // load({ reset: true })
});
</script>

<style lang="scss" scoped>
.livekit-dashboard {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.75rem;
  font-family: inherit;
  color: rgb(var(--v-theme-textPrimary));
}

.dashboard-header {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .dashboard-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: rgb(var(--v-theme-textPrimary));
    margin-bottom: 0.5rem;
  }

  .dashboard-subtitle {
    color: rgb(var(--v-theme-textSecondary));
    font-size: 0.875rem;
  }
}

.controls-section {
  margin: 0.75rem 0 1rem;
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 0.625rem;

  .prefix-input,
  .limit-input {
    border-radius: 0.5rem;
    border: 1px solid rgb(var(--v-theme-borderColor));
    background-color: rgb(var(--v-theme-surface));
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    color: rgb(var(--v-theme-textPrimary));
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: rgb(var(--v-theme-primary));
    }

    &::placeholder {
      color: rgb(var(--v-theme-textSecondary));
    }
  }

  .limit-input {
    max-width: 140px;
  }

  .load-button {
    cursor: pointer;
    border-radius: 0.5rem;
    border: 1px solid rgb(var(--v-theme-borderColor));
    background-color: rgb(var(--v-theme-containerBg));
    padding: 0.625rem 0.875rem;
    color: rgb(var(--v-theme-textPrimary));
    transition: all 0.2s ease;
    font-weight: 500;

    &:hover {
      background-color: rgb(var(--v-theme-hoverColor));
      border-color: rgb(var(--v-theme-primary));
    }
  }
}

.error-message {
  margin-bottom: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgb(var(--v-theme-error));
  background-color: rgba(var(--v-theme-error), 0.1);
  padding: 0.625rem 0.75rem;
  color: rgb(var(--v-theme-error));
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 0.875rem;
}

.no-records,
.loading-text {
  color: rgb(var(--v-theme-textSecondary));
  font-style: italic;
}
</style>