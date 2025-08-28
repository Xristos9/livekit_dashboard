
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import VueApexCharts from 'vue3-apexcharts';
import '@mdi/font/css/materialdesignicons.css';
import '@/scss/style.scss';
import {
  BLUE_THEME,
} from "@/theme/LightTheme";
import {
  DARK_BLUE_THEME,
} from "@/theme/DarkTheme";
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "BLUE_THEME",
      themes: {
        BLUE_THEME,
        DARK_BLUE_THEME,
      },
    },
    defaults: {
      VBtn: {},
      VCard: {
          rounded: 'md'
      },
      VTextField: {
          rounded: 'lg'
      },
      VTooltip: {
          location: 'top'
      }
  }
  });
  nuxtApp.vueApp.use(vuetify);
  // Register ApexCharts component globally to avoid plugin type issues
  nuxtApp.vueApp.component('apexchart', VueApexCharts);
});

