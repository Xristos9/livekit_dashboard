<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#imports'

const username = ref('')
const password = ref('')
const checkbox = ref(true)
const error = ref('')
const router = useRouter()
const user = useCurrentUser()

const login = async () => {
  error.value = ''
  try {
    const res = await $fetch<{
      success: boolean
      message?: string
      user?: Record<string, any>
    }>('/api/login', {
      method: 'POST',
      body: { username: username.value, password: password.value },
    })
    if (res.success && res.user) {
      user.value = res.user
      router.push('/dashboard')
    } else {
      error.value = res.message || 'Invalid credentials'
    }
  } catch (e: any) {
    error.value = e?.statusMessage || 'Login failed'
  }
}
</script>

<template>
  <v-row class="d-flex mb-3">
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Username</v-label>
      <v-text-field
        v-model="username"
        variant="outlined"
        density="compact"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-label class="font-weight-bold mb-1">Password</v-label>
      <v-text-field
        v-model="password"
        variant="outlined"
        density="compact"
        type="password"
        hide-details
        color="primary"
      ></v-text-field>
    </v-col>
    <v-col cols="12" class="pt-0">
      <div class="d-flex align-center flex-wrap">
        <v-checkbox v-model="checkbox" color="primary" hide-details>
          <template v-slot:label class="text-body-1">Remeber this Device</template>
        </v-checkbox>
        <div class="ml-sm-auto">
          <NuxtLink
            to="/"
            class="text-primary text-decoration-none text-body-1 font-weight-medium opacity-1"
            >Forgot Password ?</NuxtLink
          >
        </div>
      </div>
    </v-col>
    <v-col cols="12" class="pt-0" v-if="error">
      <v-alert type="error" density="compact" variant="tonal">{{ error }}</v-alert>
    </v-col>
    <v-col cols="12" class="pt-0">
      <v-btn color="primary" size="large" block flat @click="login">Sign in</v-btn>
    </v-col>
  </v-row>
</template>
