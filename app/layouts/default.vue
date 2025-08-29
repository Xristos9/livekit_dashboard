<script setup lang="ts">
import { useHead } from '#imports';

useHead({
  title: 'Abyssaltech Al',
  titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk}` : 'Abyssaltech Al'),
});
</script>

<template>
  <v-locale-provider>
    <v-app>
      <LayoutFullMain />
      <v-main>
        <div class="mb-3 hr-layout bg-containerBg">
          <v-container
            fluid
            class="page-wrapper bg-background pt-md-8 rounded-xl"
          >
            <div class="maxWidth">
              <NuxtPage />
            </div>
          </v-container>
        </div>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
