<script setup lang="ts">
import type { Agent } from '@/types/dialer'

const props = defineProps<{
  agents: Agent[]
}>()

const emit = defineEmits<{
  updateAgent: [agent: Agent]
}>()

const timezones = [
  'Europe/Athens',
  'Europe/London',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Asia/Tokyo',
  'Australia/Sydney'
]

const getStatusColor = (status: string) => {
  const colors = {
    idle: 'success',
    calling: 'primary',
    paused: 'warning',
    error: 'error'
  }
  return colors[status as keyof typeof colors] || 'grey'
}

const getStatusText = (status: string) => {
  const texts = {
    idle: 'Idle',
    calling: 'Calling',
    paused: 'Paused',
    error: 'Error'
  }
  return texts[status as keyof typeof texts] || status
}

const updateAgent = (agent: Agent) => {
  emit('updateAgent', agent)
}
</script>

<template>
  <div class="agents-tab">
    <div class="agents-grid">
      <v-card
        v-for="agent in agents"
        :key="agent.id"
        elevation="10"
        class="agent-card"
      >
        <v-card-item>
          <div class="agent-header">
            <div class="agent-info">
              <h3 class="agent-name">{{ agent.name }}</h3>
              <v-chip
                :color="getStatusColor(agent.status)"
                variant="tonal"
                size="small"
                class="status-chip"
              >
                {{ getStatusText(agent.status) }}
              </v-chip>
            </div>
            <v-chip
              color="info"
              variant="outlined"
              size="small"
              class="capacity-chip"
            >
              {{ agent.capacity }}x capacity
            </v-chip>
          </div>

          <div class="agent-stats" v-if="agent.status === 'calling'">
            <div class="stat-item">
              <span class="stat-label">Active Calls:</span>
              <span class="stat-value">{{ agent.currentCalls }}/{{ agent.capacity }}</span>
            </div>
            <v-progress-linear
              :model-value="(agent.currentCalls / agent.capacity) * 100"
              color="primary"
              height="4"
              rounded
              class="progress-bar"
            />
          </div>

          <v-divider class="my-4" />

          <div class="agent-settings">
            <v-text-field
              :model-value="agent.callerId"
              @update:model-value="(value) => updateAgent({ ...agent, callerId: value })"
              label="Caller ID"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-phone"
              class="setting-field"
            />

            <div class="toggle-setting">
              <v-switch
                :model-value="agent.voicemailDrop"
                @update:model-value="(value) => updateAgent({ ...agent, voicemailDrop: value })"
                color="primary"
                hide-details
                density="compact"
              />
              <span class="toggle-label">Voicemail Drop</span>
            </div>

            <v-select
              :model-value="agent.timezone"
              @update:model-value="(value) => updateAgent({ ...agent, timezone: value })"
              :items="timezones"
              label="Timezone"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-clock"
              class="setting-field"
            />
          </div>
        </v-card-item>
      </v-card>
    </div>

    <div v-if="agents.length === 0" class="empty-state">
      <v-icon size="48" color="muted" class="mb-4">mdi-robot</v-icon>
      <p class="text-muted">No agents configured</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.agents-tab {
  .agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .agent-card {
      .agent-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;

        .agent-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          .agent-name {
            font-size: 1.125rem;
            font-weight: 600;
            color: rgb(var(--v-theme-textPrimary));
            margin: 0;
          }
        }

        .capacity-chip {
          font-size: 0.75rem;
        }
      }

      .agent-stats {
        margin-bottom: 1rem;

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;

          .stat-label {
            font-size: 0.875rem;
            color: rgb(var(--v-theme-textSecondary));
          }

          .stat-value {
            font-weight: 600;
            color: rgb(var(--v-theme-textPrimary));
          }
        }

        .progress-bar {
          margin-top: 0.5rem;
        }
      }

      .agent-settings {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .setting-field {
          margin-bottom: 0;
        }

        .toggle-setting {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .toggle-label {
            font-size: 0.875rem;
            color: rgb(var(--v-theme-textPrimary));
          }
        }
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;

    .text-muted {
      color: rgb(var(--v-theme-textSecondary));
      font-size: 1rem;
    }
  }
}
</style>