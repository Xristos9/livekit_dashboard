<script setup lang="ts">
import type { DialerStats, ActiveCall } from '@/types/dialer'

const props = defineProps<{
  stats: DialerStats
  activeCalls: ActiveCall[]
  isRunning: boolean
  isPaused: boolean
  globalConcurrency: number
  progress: number
}>()

const emit = defineEmits<{
  start: []
  pause: []
  resume: []
  stop: []
  updateConcurrency: [value: number]
}>()

const localConcurrency = ref(props.globalConcurrency)

const handleStart = () => {
  emit('start')
}

const handlePauseResume = () => {
  if (props.isPaused) {
    emit('resume')
  } else {
    emit('pause')
  }
}

const handleStop = () => {
  emit('stop')
}

const updateConcurrency = () => {
  emit('updateConcurrency', localConcurrency.value)
}

watch(
  () => props.globalConcurrency,
  (newValue) => {
    localConcurrency.value = newValue
  }
)
</script>

<template>
  <div class="dialer-controls">
    <!-- Global Configuration -->
    <v-card elevation="10" class="config-card">
      <v-card-item>
        <v-card-title class="text-h6 mb-4">Configuration</v-card-title>

        <div class="config-section">
          <v-text-field
            v-model.number="localConcurrency"
            @blur="updateConcurrency"
            @keyup.enter="updateConcurrency"
            label="Global Concurrency"
            type="number"
            min="1"
            max="20"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-phone-multiple"
            hint="Max simultaneous calls"
            persistent-hint
          />
        </div>

        <div class="progress-section">
          <div class="progress-label">
            <span>Overall Progress</span>
            <span class="progress-text">{{ Math.round(progress) }}%</span>
          </div>
          <v-progress-linear
            :model-value="progress"
            color="primary"
            height="8"
            rounded
            class="progress-bar"
          />
        </div>
      </v-card-item>
    </v-card>

    <!-- KPI Grid -->
    <v-card elevation="10" class="kpi-card">
      <v-card-item>
        <v-card-title class="text-h6 mb-4">Live Stats</v-card-title>

        <div class="kpi-grid">
          <div class="kpi-item">
            <div class="kpi-value">{{ stats.queued }}</div>
            <div class="kpi-label">Queued</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">{{ stats.active }}</div>
            <div class="kpi-label">Active</div>
          </div>
          <div class="kpi-item">
            <div class="kpi-value">{{ stats.completed + stats.failed }}</div>
            <div class="kpi-label">Done</div>
          </div>
        </div>
      </v-card-item>
    </v-card>

    <!-- Run Controls -->
    <v-card elevation="10" class="controls-card">
      <v-card-item>
        <v-card-title class="text-h6 mb-4">Run Controls</v-card-title>

        <div class="control-buttons">
          <v-btn
            @click="handleStart"
            :disabled="isRunning"
            color="success"
            variant="flat"
            size="large"
            prepend-icon="mdi-play"
            block
            class="control-btn"
          >
            Start
          </v-btn>

          <v-btn
            @click="handlePauseResume"
            :disabled="!isRunning"
            :color="isPaused ? 'info' : isRunning ? 'warning' : 'grey100'"
            variant="flat"
            size="large"
            :prepend-icon="isPaused ? 'mdi-play' : 'mdi-pause'"
            block
            class="control-btn"
          >
            {{ !!isPaused ? 'Resume' : 'Pause' }}
          </v-btn>

          <v-btn
            @click="handleStop"
            :disabled="!isRunning"
            color="error"
            variant="flat"
            size="large"
            prepend-icon="mdi-stop"
            block
            class="control-btn"
          >
            Stop
          </v-btn>
        </div>
      </v-card-item>
    </v-card>

    <!-- Active Calls -->
    <v-card elevation="10" class="active-calls-card">
      <v-card-item>
        <v-card-title class="text-h6 mb-4">Active Calls</v-card-title>

        <div class="active-calls-list">
          <div v-for="call in activeCalls" :key="call.id" class="active-call-item">
            <div class="call-info">
              <div class="call-phone">{{ call.phone }}</div>
              <div class="call-lead">{{ call.leadName }}</div>
            </div>
            <v-chip
              :color="call.status === 'dialing' ? 'amber' : 'blue'"
              variant="tonal"
              size="small"
            >
              {{ call.status === 'dialing' ? 'Dialing' : 'In Call' }}
            </v-chip>
          </div>

          <div v-if="activeCalls.length === 0" class="no-calls">
            <v-icon color="muted" class="mb-2">mdi-phone-off</v-icon>
            <p class="text-muted">No active calls</p>
          </div>
        </div>
      </v-card-item>
    </v-card>

    <!-- Compliance Footer -->
    <div class="compliance-footer">
      <v-icon size="16" color="muted" class="mr-2">mdi-shield-check</v-icon>
      <span class="compliance-text">
        Local dial window enforced by timezone and compliance settings
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dialer-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;

  .config-card {
    .config-section {
      margin-bottom: 1.5rem;
    }

    .progress-section {
      .progress-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: rgb(var(--v-theme-textSecondary));

        .progress-text {
          font-weight: 600;
          color: rgb(var(--v-theme-textPrimary));
        }
      }

      .progress-bar {
        margin-bottom: 0.5rem;
      }
    }
  }

  .kpi-card {
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;

      .kpi-item {
        text-align: center;
        padding: 0.75rem;
        background: rgba(var(--v-theme-surface), 0.5);
        border-radius: 8px;

        .kpi-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgb(var(--v-theme-textPrimary));
          margin-bottom: 0.25rem;
        }

        .kpi-label {
          font-size: 0.75rem;
          color: rgb(var(--v-theme-textSecondary));
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
    }
  }

  .controls-card {
    .control-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .control-btn {
        height: 48px;
        font-weight: 600;
      }
    }
  }

  .active-calls-card {
    flex: 1;
    min-height: 200px;

    .active-calls-list {
      .active-call-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        border: 1px solid rgba(var(--v-theme-borderColor), 0.12);
        border-radius: 8px;
        margin-bottom: 0.5rem;

        &:last-child {
          margin-bottom: 0;
        }

        .call-info {
          .call-phone {
            font-family: 'Courier New', monospace;
            font-weight: 600;
            color: rgb(var(--v-theme-textPrimary));
            font-size: 0.875rem;
          }

          .call-lead {
            font-size: 0.75rem;
            color: rgb(var(--v-theme-textSecondary));
            margin-top: 0.25rem;
          }
        }
      }

      .no-calls {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;

        .text-muted {
          color: rgb(var(--v-theme-textSecondary));
          font-size: 0.875rem;
          margin: 0;
        }
      }
    }
  }

  .compliance-footer {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background: rgba(var(--v-theme-warning), 0.1);
    border: 1px solid rgba(var(--v-theme-warning), 0.2);
    border-radius: 8px;
    margin-top: auto;

    .compliance-text {
      font-size: 0.75rem;
      color: rgb(var(--v-theme-textSecondary));
      line-height: 1.4;
    }
  }
}
</style>
