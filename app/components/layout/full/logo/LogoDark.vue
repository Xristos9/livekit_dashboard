<script setup lang="ts">
import Logoimg from '/images/logos/abyssaltech_logo_black.png'
</script>
<template>
  <div class="logo">
    <NuxtLink to="/dashboard">
      <img :src="Logoimg" alt="home" />
    </NuxtLink>
  </div>
</template>
