<script setup lang="ts">
import type { CSVMapping } from '@/types/dialer'

const props = defineProps<{
  modelValue: boolean
  csvHeaders: string[]
  csvData: any[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [mapping: CSVMapping]
  cancel: []
}>()

// Local mapping uses only strings for clean v-model typing
const mapping = ref({
  phone: '',
  firstName: '',
  lastName: '',
  company: '',
})

const previewData = computed(() => {
  return props.csvData.slice(0, 3).map((row) => ({
    phone: mapping.value.phone ? row[mapping.value.phone] : '',
    firstName: mapping.value.firstName ? row[mapping.value.firstName] : '',
    lastName: mapping.value.lastName ? row[mapping.value.lastName] : '',
    company: mapping.value.company ? row[mapping.value.company] : '',
  }))
})

const isValid = computed(() => {
  return mapping.value.phone !== ''
})

const handleConfirm = () => {
  if (isValid.value) {
    const result: CSVMapping = {
      phone: mapping.value.phone,
      ...(mapping.value.firstName ? { firstName: mapping.value.firstName } : {}),
      ...(mapping.value.lastName ? { lastName: mapping.value.lastName } : {}),
      ...(mapping.value.company ? { company: mapping.value.company } : {}),
    }
    emit('confirm', result)
    emit('update:modelValue', false)
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

// Auto-detect common field mappings
watch(
  () => props.csvHeaders,
  (headers) => {
    if (headers.length > 0) {
      const lowerHeaders = headers.map((h) => h.toLowerCase())

      // Auto-detect phone
      const phoneIndex = lowerHeaders.findIndex(
        (h) => h.includes('phone') || h.includes('mobile') || h.includes('tel')
      )
      if (phoneIndex >= 0) {
        mapping.value.phone = headers[phoneIndex] ?? ''
      }

      // Auto-detect first name
      const firstNameIndex = lowerHeaders.findIndex(
        (h) => h.includes('first') || h.includes('fname') || h === 'name'
      )
      if (firstNameIndex >= 0) {
        mapping.value.firstName = headers[firstNameIndex] ?? ''
      }

      // Auto-detect last name
      const lastNameIndex = lowerHeaders.findIndex(
        (h) => h.includes('last') || h.includes('lname') || h.includes('surname')
      )
      if (lastNameIndex >= 0) {
        mapping.value.lastName = headers[lastNameIndex] ?? ''
      }

      // Auto-detect company
      const companyIndex = lowerHeaders.findIndex(
        (h) => h.includes('company') || h.includes('organization') || h.includes('business')
      )
      if (companyIndex >= 0) {
        mapping.value.company = headers[companyIndex] ?? ''
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5 pa-6 pb-4"> Map CSV Columns </v-card-title>

      <v-card-text class="pa-6 pt-0">
        <p class="text-body-2 text-muted mb-6">
          Map your CSV columns to the required fields. Phone number is required.
        </p>

        <div class="mapping-section">
          <v-select
            v-model="mapping.phone"
            :items="csvHeaders"
            label="Phone Number *"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-phone"
            :rules="[(v) => !!v || 'Phone number is required']"
            class="mapping-field"
          />

          <v-select
            v-model="mapping.firstName"
            :items="csvHeaders"
            label="First Name"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-account"
            clearable
            class="mapping-field"
          />

          <v-select
            v-model="mapping.lastName"
            :items="csvHeaders"
            label="Last Name"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-account"
            clearable
            class="mapping-field"
          />

          <v-select
            v-model="mapping.company"
            :items="csvHeaders"
            label="Company"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-office-building"
            clearable
            class="mapping-field"
          />
        </div>

        <v-divider class="my-6" />

        <div class="preview-section">
          <h4 class="text-h6 mb-4">Preview</h4>
          <div class="preview-table">
            <div class="preview-header">
              <div class="preview-cell">Phone</div>
              <div class="preview-cell">First Name</div>
              <div class="preview-cell">Last Name</div>
              <div class="preview-cell">Company</div>
            </div>
            <div v-for="(row, index) in previewData" :key="index" class="preview-row">
              <div class="preview-cell">{{ row.phone || '—' }}</div>
              <div class="preview-cell">{{ row.firstName || '—' }}</div>
              <div class="preview-cell">{{ row.lastName || '—' }}</div>
              <div class="preview-cell">{{ row.company || '—' }}</div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn @click="handleCancel" variant="text" color="grey"> Cancel </v-btn>
        <v-btn @click="handleConfirm" :disabled="!isValid" color="primary" variant="flat">
          Import Leads
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.mapping-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .mapping-field {
    margin-bottom: 0;
  }
}

.preview-section {
  .preview-table {
    border: 1px solid rgba(var(--v-theme-borderColor), 0.12);
    border-radius: 8px;
    overflow: hidden;

    .preview-header {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      background: rgba(var(--v-theme-surface), 0.5);
      border-bottom: 1px solid rgba(var(--v-theme-borderColor), 0.12);

      .preview-cell {
        padding: 0.75rem;
        font-weight: 600;
        font-size: 0.875rem;
        color: rgb(var(--v-theme-textSecondary));
        border-right: 1px solid rgba(var(--v-theme-borderColor), 0.12);

        &:last-child {
          border-right: none;
        }
      }
    }

    .preview-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-bottom: 1px solid rgba(var(--v-theme-borderColor), 0.12);

      &:last-child {
        border-bottom: none;
      }

      .preview-cell {
        padding: 0.75rem;
        font-size: 0.875rem;
        color: rgb(var(--v-theme-textPrimary));
        border-right: 1px solid rgba(var(--v-theme-borderColor), 0.12);
        word-break: break-word;

        &:last-child {
          border-right: none;
        }
      }
    }
  }
}
</style>
