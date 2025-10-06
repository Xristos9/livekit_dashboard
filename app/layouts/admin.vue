<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const userCookie = useCookie<string | null>('user')

const user = computed(() => {
  if (!userCookie.value) return null
  try {
    return JSON.parse(userCookie.value)
  } catch (error) {
    console.error('Failed to parse user cookie', error)
    return null
  }
})

const navItems = [
  { label: 'Overview', to: '/admin' },
  { label: 'Customers', to: '/admin/customers' },
]

const active = computed({
  get: () => {
    const match = navItems.find((item) => route.path.startsWith(item.to))
    return match ? match.to : '/admin'
  },
  set: (value: string) => {
    if (value && value !== route.path) {
      router.push(value)
    }
  },
})

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <v-locale-provider>
    <v-app>
      <v-app-bar elevation="1" class="admin-app-bar" color="primary" dark>
        <v-toolbar-title class="d-flex align-center">
          <span class="font-weight-bold">Admin Control Center</span>
        </v-toolbar-title>
        <div class="d-flex align-center ga-2">
          <span class="text-caption text-white text-opacity-80" v-if="user">
            Signed in as <strong>{{ user?.name || user?.username }}</strong>
          </span>
          <v-btn variant="text" color="white" class="text-none" @click="goToDashboard">
            Back to Client View
          </v-btn>
        </div>
      </v-app-bar>
      <v-app-bar flat color="white" height="64" class="border-b">
        <v-tabs v-model="active" align-tabs="start" color="primary" grow>
          <v-tab v-for="item in navItems" :key="item.to" :value="item.to" class="text-none">
            {{ item.label }}
          </v-tab>
        </v-tabs>
      </v-app-bar>
      <v-main class="bg-grey-lighten-4">
        <v-container fluid class="py-6">
          <slot />
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>

<style scoped>
.admin-app-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
