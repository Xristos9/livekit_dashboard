<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#imports'

const username = ref('')
const password = ref('')
const checkbox = ref(true)
const error = ref('')
const loading = ref(false)
const user = useUser()
const router = useRouter()

// onMounted(() => {
//   const savedUsername = localStorage.getItem('rememberedUsername')
//   if (savedUsername) {
//     username.value = savedUsername
//     checkbox.value = true
//   }
//   if (!user.value) {
//     const savedUser = localStorage.getItem('userData')
//     if (savedUser) {
//       try {
//         user.value = JSON.parse(savedUser)
//       } catch {}
//     }
//   }
// })

const login = async () => {
  router.push('/dashboard')
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
          <template v-slot:label class="text-body-1">Remember this Device</template>
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
      <v-btn color="primary" size="large" block flat @click="login" :loading="loading">
        Sign in
      </v-btn>
    </v-col>
  </v-row>
</template>
