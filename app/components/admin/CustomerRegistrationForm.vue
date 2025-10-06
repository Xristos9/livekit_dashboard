<script setup lang="ts">
import type { CreateCustomerPayload } from '@/types/admin'

const emit = defineEmits<{
  created: []
}>()

const formRef = ref()
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = reactive<CreateCustomerPayload>({
  name: '',
  email: '',
  username: '',
  password: '',
  costPerMinute: 0,
  trunkId: '',
  openAiProjectId: '',
  commissionPerMinute: 0.04,
})

const rules = {
  required: (value: string) => (!!value && value.trim().length > 0) || 'Required field',
  email: (value: string) => /.+@.+\..+/.test(value) || 'Enter a valid email address',
  number: (value: number) => !Number.isNaN(value) || 'Enter a valid number',
}

async function submit() {
  const validation = await formRef.value?.validate()
  if (validation?.valid === false) {
    return
  }
  successMessage.value = ''
  errorMessage.value = ''
  loading.value = true
  try {
    await $fetch('/api/admin/customers', {
      method: 'POST',
      body: {
        ...form,
        costPerMinute: Number(form.costPerMinute),
        commissionPerMinute: Number(form.commissionPerMinute),
      },
    })
    successMessage.value = 'Customer successfully created.'
    emit('created')
    Object.assign(form, {
      name: '',
      email: '',
      username: '',
      password: '',
      costPerMinute: 0,
      trunkId: '',
      openAiProjectId: '',
      commissionPerMinute: 0.04,
    })
  } catch (error: any) {
    console.error('Failed to create customer', error)
    errorMessage.value = error?.data?.message || error?.statusMessage || 'Failed to create customer'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-card elevation="10" class="registration-form-card">
    <v-card-item>
      <v-card-title class="form-title">Register a Customer</v-card-title>
      <v-card-subtitle class="form-subtitle">Create new customer accounts with billing defaults.</v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-alert type="success" variant="tonal" v-if="successMessage" class="mb-4" prominent border="start">
        <strong>Success!</strong> {{ successMessage }}
      </v-alert>
      <v-alert type="error" variant="tonal" v-if="errorMessage" class="mb-4" prominent border="start">
        <strong>Error!</strong> {{ errorMessage }}
      </v-alert>
      <v-form ref="formRef" @submit.prevent="submit">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.name"
              label="Customer Name"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              density="comfortable"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.username"
              label="Username"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.password"
              label="Password"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              type="password"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="form.costPerMinute"
              label="Cost per Minute (€)"
              :rules="[rules.required, rules.number]"
              variant="outlined"
              density="comfortable"
              type="number"
              step="0.01"
              min="0"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model.number="form.commissionPerMinute"
              label="Commission per Minute (€)"
              :rules="[rules.required, rules.number]"
              variant="outlined"
              density="comfortable"
              type="number"
              step="0.01"
              min="0"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.trunkId"
              label="Trunk ID"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.openAiProjectId"
              label="OpenAI Project ID"
              hint="Used to fetch cost data from OpenAI"
              persistent-hint
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>
        <div class="form-actions">
          <v-btn color="primary" size="large" variant="flat" :loading="loading" type="submit" prepend-icon="mdi-account-plus">
            Create Customer
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.registration-form-card {
  .form-title {
    font-size: 1.25rem;
    font-weight: 600;
    padding: 0;
  }

  .form-subtitle {
    font-size: 0.875rem;
    padding: 0;
    margin-top: 0.25rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
  }
}
</style>
