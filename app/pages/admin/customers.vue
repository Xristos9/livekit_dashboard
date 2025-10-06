<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})
</script>

<template>
  <div class="customers-page">
    <header class="page-header">
      <h1 class="page-title">Register New Customer</h1>
      <p class="page-subtitle">
        Create customer accounts to grant access to the platform. Only administrators can perform
        registrations.
      </p>
    </header>

    <div class="form-container">
      <AdminCustomerRegistrationForm />
    </div>
  </div>
</template>

<style scoped lang="scss">
.customers-page {
  max-width: 100%;
  padding: 0;
}

.page-header {
  margin-bottom: 2rem;

  .page-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: rgb(var(--v-theme-textPrimary));
    margin-bottom: 0.5rem;
  }

  .page-subtitle {
    font-size: 0.875rem;
    color: rgb(var(--v-theme-textSecondary));
    max-width: 700px;
  }
}

.form-container {
  max-width: 1000px;
}
</style>
