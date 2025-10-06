<script setup lang="ts">
import type { AdminUsagePatternReport } from '@/types/admin'

const props = defineProps<{
  reports: AdminUsagePatternReport[]
}>()

const topBySessions = computed(() => [...props.reports].sort((a, b) => b.totalSessions - a.totalSessions).slice(0, 5))
const topByMinutes = computed(() => [...props.reports].sort((a, b) => b.totalMinutes - a.totalMinutes).slice(0, 5))
</script>

<template>
  <v-card elevation="10">
    <v-card-item>
      <v-card-title class="text-h5">Usage Pattern Highlights</v-card-title>
      <v-card-subtitle>Identify where agents spend most of their time.</v-card-subtitle>
    </v-card-item>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">Top Customers by Sessions</h3>
          <v-list density="compact" lines="two">
            <v-list-item v-for="item in topBySessions" :key="item.customerId">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.totalSessions }} sessions · {{ item.totalMinutes.toFixed(1) }} minutes total
                <span v-if="item.peakUsageDay"> · Peak day: {{ item.peakUsageDay }}</span>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="!topBySessions.length">
              <v-list-item-title>No sessions recorded.</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="6">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">Longest Average Calls</h3>
          <v-list density="compact" lines="two">
            <v-list-item
              v-for="item in topByMinutes"
              :key="item.customerId"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                Avg {{ item.averageSessionDurationMinutes.toFixed(1) }} min · Peak hour:
                <span v-if="item.peakUsageHour !== undefined">{{ item.peakUsageHour }}:00 UTC</span>
                <span v-else>n/a</span>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="!topByMinutes.length">
              <v-list-item-title>No call duration data available.</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
