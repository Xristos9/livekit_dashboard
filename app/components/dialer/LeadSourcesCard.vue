<script setup lang="ts">
import type { DataSource } from '@/types/dialer'
import { Icon } from '@iconify/vue'

const emit = defineEmits<{
  uploadCsv: [file: File]
  loadFromSource: [sourceId: string]
}>()

const dataSources = ref<DataSource[]>([
  { id: 'primary-crm', name: 'Primary CRM', type: 'crm' },
  { id: 'data-warehouse', name: 'Data Warehouse', type: 'warehouse' },
  { id: 's3-archive', name: 'S3 CSV Archive', type: 's3' },
])

const selectedSource = ref('')
const fileInput = ref<HTMLInputElement>()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('uploadCsv', file)
  }
}

const loadFromSource = () => {
  if (selectedSource.value) {
    emit('loadFromSource', selectedSource.value)
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}
</script>

<template>
  <v-card elevation="10" class="lead-sources-card">
    <v-card-item>
      <v-card-title class="text-h6 mb-4">Lead Sources</v-card-title>
      
      <div class="sources-controls">
        <!-- CSV Upload -->
        <div class="upload-section">
          <input
            ref="fileInput"
            type="file"
            accept=".csv"
            @change="handleFileUpload"
            style="display: none"
          />
          <v-btn
            @click="triggerFileUpload"
            variant="outlined"
            color="primary"
            prepend-icon="mdi-upload"
            class="upload-btn"
          >
            Upload CSV
          </v-btn>
        </div>

        <!-- Data Source Selector -->
        <div class="source-section">
          <v-select
            v-model="selectedSource"
            :items="dataSources"
            item-title="name"
            item-value="id"
            label="Select Data Source"
            variant="outlined"
            density="compact"
            class="source-select"
          >
            <template #prepend-item>
              <v-list-item>
                <v-list-item-title class="text-caption text-muted">
                  Choose your lead source
                </v-list-item-title>
              </v-list-item>
              <v-divider />
            </template>
          </v-select>
          
          <v-btn
            @click="loadFromSource"
            :disabled="!selectedSource"
            color="primary"
            variant="flat"
            class="load-btn"
          >
            Load
          </v-btn>
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped lang="scss">
.lead-sources-card {
  margin-bottom: 1rem;

  .sources-controls {
    display: flex;
    gap: 1rem;
    align-items: end;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }

    .upload-section {
      .upload-btn {
        min-width: 140px;
      }
    }

    .source-section {
      display: flex;
      gap: 0.75rem;
      align-items: end;
      flex: 1;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
      }

      .source-select {
        min-width: 200px;
        flex: 1;
      }

      .load-btn {
        min-width: 80px;
        height: 40px;
      }
    }
  }
}
</style>