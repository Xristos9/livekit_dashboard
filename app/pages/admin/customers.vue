<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})
</script>

<template>
  <div class="d-flex flex-column ga-8">
    <header class="d-flex flex-column ga-2">
      <h1 class="text-h4 font-weight-bold">Register a new customer</h1>
      <p class="text-body-2 text-medium-emphasis">
        Create customer accounts to grant access to the platform. Only administrators can perform
        registrations.
      </p>
    </header>

    <AdminCustomerRegistrationForm class="mt-2" />
  </div>
</template>
