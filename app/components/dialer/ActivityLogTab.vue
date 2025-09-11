<script setup lang="ts">
import type { ActivityLogEntry } from '@/types/dialer'

const props = defineProps<{
  activities: ActivityLogEntry[]
}>()

const getActivityIcon = (type: string) => {
  const icons = {
    dial: '☎️',
    success: '✅',
    failure: '❌',
    pause: '⏸️',
    resume: '▶️',
    start: '🚀',
    stop: '⏹️'
  }
  return icons[type as keyof typeof icons] || '📝'
}

const getActivityColor = (type: string) => {
  const colors = {
    dial: 'primary',
    success: 'success',
    failure: 'error',
    pause: 'warning',
    resume: 'info',
    start: 'success',
    stop: 'error'
  }
  return colors[type as keyof typeof colors] || 'grey'
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const sortedActivities = computed(() => {
  return [...props.activities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
})
</script>

<template>
  <div class="activity-log-tab">
    <v-card elevation="10" class="log-container">
      <v-card-item>
        <v-card-title class="text-h6 mb-4">Activity Log</v-card-title>
        
        <div class="log-content">
          <div
            v-for="activity in sortedActivities"
            :key="activity.id"
            class="log-entry"
          >
            <div class="log-time">
              {{ formatTime(activity.timestamp) }}
            </div>
            <div class="log-icon">
              {{ getActivityIcon(activity.type) }}
            </div>
            <div class="log-message">
              <span :class="`text-${getActivityColor(activity.type)}`">
                {{ activity.message }}
              </span>
            </div>
          </div>

          <div v-if="activities.length === 0" class="empty-log">
            <v-icon size="48" color="muted" class="mb-4">mdi-clipboard-text-outline</v-icon>
            <p class="text-muted">No activity yet</p>
            <p class="text-caption text-muted">
              Activity will appear here when you start a dialing session
            </p>
          </div>
        </div>
      </v-card-item>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.activity-log-tab {
  .log-container {
    height: 600px;
    display: flex;
    flex-direction: column;

    .log-content {
      flex: 1;
      overflow-y: auto;
      padding-right: 0.5rem;

      .log-entry {
        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: 0.75rem;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(var(--v-theme-borderColor), 0.12);
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;

        &:last-child {
          border-bottom: none;
        }

        .log-time {
          color: rgb(var(--v-theme-textSecondary));
          font-size: 0.75rem;
          white-space: nowrap;
        }

        .log-icon {
          font-size: 1rem;
        }

        .log-message {
          color: rgb(var(--v-theme-textPrimary));
          word-break: break-word;
        }
      }

      .empty-log {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: 2rem;

        .text-muted {
          color: rgb(var(--v-theme-textSecondary));
        }
      }

      // Custom scrollbar
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(var(--v-theme-borderColor), 0.1);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(var(--v-theme-textSecondary), 0.3);
        border-radius: 3px;

        &:hover {
          background: rgba(var(--v-theme-textSecondary), 0.5);
        }
      }
    }
  }
}
</style>