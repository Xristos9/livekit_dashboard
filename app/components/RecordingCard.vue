<script setup lang="ts">
import type { RecordPair } from '@/types/livekit'

const props = defineProps<{
  rec: RecordPair
  fileUrl: (k?: string | null) => string
}>()

const open = ref(false)
const jsonText = ref<string | null>(null)
const jsonErr = ref<string | null>(null)

const lastMod = computed(() => recLatestDate(props.rec)?.toLocaleString())
const title = computed(() => props.rec.roomName || props.rec.egressId || 'Recording')

// ns → Date
function toDate(ns?: number | null): Date | null {
  if (!ns && ns !== 0) return null
  return new Date(ns / 1e6) // ns → ms
}

const startedAtHuman = computed(() => toDate(props.rec.startedAt)?.toLocaleString() || '—')
const endedAtHuman = computed(() => toDate(props.rec.endedAt)?.toLocaleString() || '—')

function recLatestDate(rec: RecordPair): Date | null {
  const a = rec.mp4?.lastModified ? new Date(rec.mp4.lastModified) : null
  const b = rec.json?.lastModified ? new Date(rec.json.lastModified) : null
  if (a && b) return a > b ? a : b
  return a || b
}

function humanSize(n: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let v = n,
    i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`
}

function fmtDuration(s?: number | null) {
  if (!s && s !== 0) return '—'
  const total = Math.floor(s)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const sec = total % 60
  if (h) return `${h}h ${m}m ${sec}s`
  if (m) return `${m}m ${sec}s`
  return `${sec}s`
}
</script>

<template>
  <v-card elevation="10" class="recording-card">
    <v-card-item>
      <!-- Header -->
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
      </div>

      <!-- Row: Phone / Egress -->
      <div class="info-grid mb-4">
        <div class="info-item">
          <span class="info-label">Phone:</span>
          <span class="info-value">{{ rec.phoneNumber || '—' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Egress:</span>
          <span class="info-value">{{ rec.egressId || '—' }}</span>
        </div>
      </div>

      <!-- Row: Times / Duration -->
      <div class="info-grid-3 mb-4">
        <div class="info-item">
          <span class="info-label">Started:</span>
          <span class="info-value">{{ startedAtHuman }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Ended:</span>
          <span class="info-value">{{ endedAtHuman }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Duration:</span>
          <span class="info-value">{{ fmtDuration(rec.durationSeconds) }}</span>
        </div>
      </div>

      <!-- Row: Availability / Size -->
      <div class="info-grid-3 mb-4">
        <div class="info-item">
          <span class="info-label">JSON:</span>
          <v-chip 
            :color="rec.json ? 'success' : 'error'" 
            size="small" 
            variant="tonal"
            class="ml-2"
          >
            {{ rec.json ? 'available' : 'missing' }}
          </v-chip>
        </div>
        <div class="info-item">
          <span class="info-label">MP4:</span>
          <v-chip 
            :color="rec.mp4 ? 'success' : 'error'" 
            size="small" 
            variant="tonal"
            class="ml-2"
          >
            {{ rec.mp4 ? 'available' : 'missing' }}
          </v-chip>
        </div>
        <div class="info-item">
          <span class="info-label">Total Size:</span>
          <span class="info-value">{{ humanSize((rec.json?.size || 0) + (rec.mp4?.size || 0)) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="action-buttons mb-4">
        <v-btn
          v-if="rec.json"
          :href="fileUrl(rec.json.key)"
          target="_blank"
          rel="noopener"
          variant="outlined"
          size="small"
          color="primary"
        >
          View JSON
        </v-btn>
        <v-btn
          v-if="rec.mp4"
          :href="fileUrl(rec.mp4.key) + '&download=1'"
          target="_blank"
          rel="noopener"
          variant="flat"
          size="small"
          color="secondary"
        >
          Download Audio
        </v-btn>
      </div>

      <!-- Audio player for mp4 (audio-only) -->
      <div v-if="rec.mp4" class="audio-player">
        <audio
          :src="fileUrl(rec.mp4.key)"
          controls
          preload="metadata"
          class="audio-controls"
        />
      </div>
    </v-card-item>
  </v-card>
</template>
