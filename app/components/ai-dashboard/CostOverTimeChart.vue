<script setup lang="ts">
import type { Session } from '@/types/ai-dashboard'

const props = defineProps<{
  sessions: Session[]
}>()

const costByDate = computed<{ labels: string[]; values: (number | null)[] }>(() => {
  const grouped = props.sessions.reduce(
    (acc, session) => {
      acc[session.date] = (acc[session.date] || 0) + session.cost
      return acc
    },
    {} as Record<string, number>
  )

  // Sort raw ISO dates, then format to `DD Mon` (e.g., `29 Jul`)
  const rawDates = Object.keys(grouped).sort()

  const values = rawDates.map((date) => {
    const val = grouped[date]
    return val != null ? Number(val.toFixed(3)) : null
  })

  const labels = rawDates.map((dateStr) => formatDateLabel(dateStr))

  return { labels, values }
})

function formatDateLabel(dateStr: string): string {
  // Avoid timezone drift by parsing and mapping month names manually
  const [yy, mm, dd] = dateStr.split('-')
  const dNum = parseInt(dd || '', 10)
  const mNum = parseInt(mm || '', 10)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const day = Number.isNaN(dNum) ? '' : String(dNum)
  const mon = !Number.isNaN(mNum) && mNum >= 1 && mNum <= 12 ? months[mNum - 1] : ''
  return `${day} ${mon}`.trim()
}

const series = computed(() => [
  {
    name: 'Total Cost (USD)',
    data: costByDate.value.values,
  },
])

const chartOptions = computed(() => ({
  chart: {
    toolbar: {
      show: false,
    },
    type: 'line',
    fontFamily: 'inherit',
    foreColor: '#adb0bb',
    offsetX: -15,
  },
  colors: ['rgba(var(--v-theme-primary))'],
  stroke: {
    curve: 'straight',
  },
  fill: {
    type: 'solid',
    opacity: 0.1,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    line: {
      horizontal: false,
      barHeight: '60%',
      columnWidth: '15%',
      borderRadius: [6],
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'all',
    },
  },
  grid: {
    show: true,
    padding: {
      top: 0,
      bottom: 0,
      right: 0,
    },
    borderColor: 'rgba(0,0,0,0.05)',
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  xaxis: {
    categories: costByDate.value.labels,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: { fontSize: '13px', colors: '#adb0bb', fontWeight: '400' },
    },
  },
  tooltip: {
    theme: 'dark',
  },
}))
</script>

<template>
  <v-card elevation="10">
    <v-card-item>
      <v-card-title class="text-h5">Cost Over Time</v-card-title>
      <div class="mx-3 mt-4 pt-2">
        <apexchart
          type="line"
          height="320"
          class="rounded-bars"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </v-card-item>
  </v-card>
</template>
