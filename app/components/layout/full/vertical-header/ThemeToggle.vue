<script setup lang="ts">
import { useTheme } from 'vuetify';
import { Icon } from '@iconify/vue';

const theme = useTheme();

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'BLUE_THEME' : 'DARK_BLUE_THEME';
};
</script>

<template>
  <v-btn 
    icon 
    class="custom-hover-primary" 
    size="small" 
    variant="text" 
    rounded="circle" 
    @click="toggleTheme"
    :title="theme.global.current.value.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
  >
    <Icon 
      :icon="theme.global.current.value.dark ? 'solar:sun-bold' : 'solar:moon-bold'" 
      height="22" 
    />
  </v-btn>
</template>