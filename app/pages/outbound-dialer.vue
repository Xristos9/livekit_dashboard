<script setup lang="ts">
import type { Lead, Agent, ActiveCall, ActivityLogEntry, DialerStats, CSVMapping } from '@/types/dialer'
import Papa from 'papaparse'

useHead({
  title: 'Outbound AI Dialer Console - Abyssaltech AI',
  meta: [
    {
      name: 'description',
      content: 'Manage outbound AI calling campaigns with real-time monitoring and lead management.',
    },
  ],
})

// State
const activeTab = ref('leads')
const leads = ref<Lead[]>([])
const agents = ref<Agent[]>([
  {
    id: 'agent-1',
    name: 'AI Agent Alpha',
    status: 'idle',
    capacity: 3,
    callerId: '+1234567890',
    voicemailDrop: true,
    timezone: 'Europe/Athens',
    currentCalls: 0
  },
  {
    id: 'agent-2',
    name: 'AI Agent Beta',
    status: 'idle',
    capacity: 2,
    callerId: '+1234567891',
    voicemailDrop: false,
    timezone: 'Europe/Athens',
    currentCalls: 0
  }
])
const activeCalls = ref<ActiveCall[]>([])
const activityLog = ref<ActivityLogEntry[]>([])

// Dialer state
const isRunning = ref(false)
const isPaused = ref(false)
const globalConcurrency = ref(5)

// CSV import
const showMappingDialog = ref(false)
const csvHeaders = ref<string[]>([])
const csvData = ref<any[]>([])

// Computed
const stats = computed<DialerStats>(() => {
  const queued = leads.value.filter(l => l.status === 'queued').length
  const active = leads.value.filter(l => ['dialing', 'in-call'].includes(l.status)).length
  const completed = leads.value.filter(l => l.status === 'completed').length
  const failed = leads.value.filter(l => l.status === 'failed').length
  const skipped = leads.value.filter(l => l.status === 'skipped').length
  const total = leads.value.length

  return { queued, active, completed, failed, skipped, total }
})

const progress = computed(() => {
  if (stats.value.total === 0) return 0
  return ((stats.value.completed + stats.value.failed + stats.value.skipped) / stats.value.total) * 100
})

// Methods
const handleUploadCsv = (file: File) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      if (results.data.length > 0) {
        csvHeaders.value = Object.keys(results.data[0] as object)
        csvData.value = results.data as any[]
        showMappingDialog.value = true
      }
    },
    error: (error) => {
      console.error('CSV parsing error:', error)
      // Add error handling UI here
    }
  })
}

const handleCsvMapping = (mapping: CSVMapping) => {
  const newLeads: Lead[] = csvData.value.map((row, index) => ({
    id: `lead-${Date.now()}-${index}`,
    phone: row[mapping.phone] || '',
    firstName: mapping.firstName ? row[mapping.firstName] : undefined,
    lastName: mapping.lastName ? row[mapping.lastName] : undefined,
    company: mapping.company ? row[mapping.company] : undefined,
    status: 'queued',
    createdAt: new Date().toISOString()
  })).filter(lead => lead.phone) // Only include leads with phone numbers

  leads.value = [...leads.value, ...newLeads]
  
  // Add activity log entry
  addActivityLog('start', `Imported ${newLeads.length} leads from CSV`)
}

const handleLoadFromSource = (sourceId: string) => {
  // Mock loading from data source
  const mockLeads: Lead[] = [
    {
      id: 'lead-mock-1',
      phone: '+306912345678',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Corp',
      status: 'queued',
      createdAt: new Date().toISOString()
    },
    {
      id: 'lead-mock-2',
      phone: '+306987654321',
      firstName: 'Jane',
      lastName: 'Smith',
      company: 'Tech Solutions',
      status: 'queued',
      createdAt: new Date().toISOString()
    }
  ]

  leads.value = [...leads.value, ...mockLeads]
  addActivityLog('start', `Loaded ${mockLeads.length} leads from ${sourceId}`)
}

const handleBulkAction = (action: string, leadIds: string[]) => {
  switch (action) {
    case 'clear-selection':
      // Handled in component
      break
    case 'clear-list':
      leads.value = []
      addActivityLog('stop', 'Cleared all leads')
      break
    case 'keep-selected':
      leads.value = leads.value.filter(lead => leadIds.includes(lead.id))
      addActivityLog('start', `Kept ${leadIds.length} selected leads`)
      break
    case 'skip-selected':
      leads.value = leads.value.map(lead => 
        leadIds.includes(lead.id) ? { ...lead, status: 'skipped' as const } : lead
      )
      addActivityLog('pause', `Skipped ${leadIds.length} leads`)
      break
  }
}

const updateAgent = (updatedAgent: Agent) => {
  const index = agents.value.findIndex(a => a.id === updatedAgent.id)
  if (index >= 0) {
    agents.value[index] = updatedAgent
  }
}

const handleStart = () => {
  isRunning.value = true
  isPaused.value = false
  
  // Update agent statuses
  agents.value = agents.value.map(agent => ({ ...agent, status: 'calling' }))
  
  addActivityLog('start', 'Started dialing session')
  
  // Mock some dialing activity
  simulateDialing()
}

const handlePause = () => {
  isPaused.value = true
  addActivityLog('pause', 'Paused dialing session')
}

const handleResume = () => {
  isPaused.value = false
  addActivityLog('resume', 'Resumed dialing session')
  simulateDialing()
}

const handleStop = () => {
  isRunning.value = false
  isPaused.value = false
  
  // Update agent statuses
  agents.value = agents.value.map(agent => ({ ...agent, status: 'idle', currentCalls: 0 }))
  
  // Clear active calls
  activeCalls.value = []
  
  // Reset queued leads
  leads.value = leads.value.map(lead => 
    ['dialing', 'in-call'].includes(lead.status) ? { ...lead, status: 'queued' } : lead
  )
  
  addActivityLog('stop', 'Stopped dialing session')
}

const updateConcurrency = (value: number) => {
  globalConcurrency.value = value
  addActivityLog('start', `Updated global concurrency to ${value}`)
}

const addActivityLog = (type: ActivityLogEntry['type'], message: string) => {
  const entry: ActivityLogEntry = {
    id: `activity-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type,
    message
  }
  activityLog.value.unshift(entry)
  
  // Keep only last 100 entries
  if (activityLog.value.length > 100) {
    activityLog.value = activityLog.value.slice(0, 100)
  }
}

// Mock dialing simulation
const simulateDialing = () => {
  if (!isRunning.value || isPaused.value) return
  
  const queuedLeads = leads.value.filter(l => l.status === 'queued')
  if (queuedLeads.length === 0) {
    handleStop()
    return
  }
  
  // Simulate some calls
  const availableSlots = Math.min(globalConcurrency.value - activeCalls.value.length, queuedLeads.length)
  
  for (let i = 0; i < availableSlots; i++) {
    const lead = queuedLeads[i]
    if (lead) {
      // Start dialing
      lead.status = 'dialing'
      
      const activeCall: ActiveCall = {
        id: `call-${Date.now()}-${i}`,
        phone: lead.phone,
        leadName: `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unknown',
        status: 'dialing',
        startedAt: new Date().toISOString(),
        agentId: agents.value[i % agents.value.length].id
      }
      
      activeCalls.value.push(activeCall)
      addActivityLog('dial', `Dialing ${lead.phone}`)
      
      // Simulate call completion after random time
      setTimeout(() => {
        completeCall(activeCall.id, lead.id)
      }, Math.random() * 10000 + 5000) // 5-15 seconds
    }
  }
  
  // Continue simulation
  setTimeout(() => {
    simulateDialing()
  }, 2000)
}

const completeCall = (callId: string, leadId: string) => {
  // Remove from active calls
  activeCalls.value = activeCalls.value.filter(call => call.id !== callId)
  
  // Update lead status
  const lead = leads.value.find(l => l.id === leadId)
  if (lead) {
    const isSuccess = Math.random() > 0.7 // 30% success rate
    lead.status = isSuccess ? 'completed' : 'failed'
    lead.disposition = isSuccess ? 'Connected' : 'No Answer'
    
    addActivityLog(isSuccess ? 'success' : 'failure', 
      `Call to ${lead.phone} ${isSuccess ? 'completed successfully' : 'failed'}`)
  }
}

// Initialize with some mock data
onMounted(() => {
  addActivityLog('start', 'Dialer console initialized')
})
</script>

<template>
  <div class="outbound-dialer">
    <!-- Header -->
    <div class="dialer-header">
      <div>
        <h1 class="dialer-title">Outbound AI Dialer Console</h1>
        <p class="dialer-subtitle">Manage AI-powered cold calling campaigns and lead generation</p>
      </div>
      
      <!-- Header Progress -->
      <div class="header-progress">
        <div class="progress-info">
          <span class="progress-label">Campaign Progress</span>
          <span class="progress-value">{{ Math.round(progress) }}%</span>
        </div>
        <v-progress-linear
          :model-value="progress"
          color="primary"
          height="6"
          rounded
          class="progress-bar"
        />
      </div>
    </div>

    <!-- Main Layout -->
    <div class="dialer-layout">
      <!-- Left Panel -->
      <div class="left-panel">
        <!-- Lead Sources -->
        <DialerLeadSourcesCard
          @upload-csv="handleUploadCsv"
          @load-from-source="handleLoadFromSource"
        />

        <!-- Tabs -->
        <v-card elevation="10" class="tabs-card">
          <v-tabs v-model="activeTab" color="primary" class="dialer-tabs">
            <v-tab value="leads">
              <v-icon class="mr-2">mdi-account-group</v-icon>
              Leads ({{ leads.length }})
            </v-tab>
            <v-tab value="agents">
              <v-icon class="mr-2">mdi-robot</v-icon>
              Agents ({{ agents.length }})
            </v-tab>
            <v-tab value="activity">
              <v-icon class="mr-2">mdi-clipboard-text</v-icon>
              Activity Log
            </v-tab>
          </v-tabs>

          <v-card-text class="tab-content">
            <v-window v-model="activeTab">
              <v-window-item value="leads">
                <DialerLeadsTable
                  :leads="leads"
                  @bulk-action="handleBulkAction"
                />
              </v-window-item>
              
              <v-window-item value="agents">
                <DialerAgentsTab
                  :agents="agents"
                  @update-agent="updateAgent"
                />
              </v-window-item>
              
              <v-window-item value="activity">
                <DialerActivityLogTab :activities="activityLog" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <DialerDialerControls
          :stats="stats"
          :active-calls="activeCalls"
          :is-running="isRunning"
          :is-paused="isPaused"
          :global-concurrency="globalConcurrency"
          :progress="progress"
          @start="handleStart"
          @pause="handlePause"
          @resume="handleResume"
          @stop="handleStop"
          @update-concurrency="updateConcurrency"
        />
      </div>
    </div>

    <!-- CSV Mapping Dialog -->
    <DialerCSVMappingDialog
      v-model="showMappingDialog"
      :csv-headers="csvHeaders"
      :csv-data="csvData"
      @confirm="handleCsvMapping"
    />
  </div>
</template>

<style scoped lang="scss">
.outbound-dialer {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;

  .dialer-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
    gap: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .dialer-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: rgb(var(--v-theme-textPrimary));
      margin-bottom: 0.5rem;
    }

    .dialer-subtitle {
      color: rgb(var(--v-theme-textSecondary));
      font-size: 1rem;
      margin: 0;
    }

    .header-progress {
      min-width: 300px;

      @media (max-width: 768px) {
        min-width: auto;
      }

      .progress-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .progress-label {
          font-size: 0.875rem;
          color: rgb(var(--v-theme-textSecondary));
        }

        .progress-value {
          font-weight: 600;
          color: rgb(var(--v-theme-textPrimary));
        }
      }
    }
  }

  .dialer-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    align-items: start;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }

    .left-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .tabs-card {
        flex: 1;

        .dialer-tabs {
          border-bottom: 1px solid rgba(var(--v-theme-borderColor), 0.12);
        }

        .tab-content {
          min-height: 600px;
          padding: 1.5rem;
        }
      }
    }

    .right-panel {
      position: sticky;
      top: 2rem;
      height: fit-content;

      @media (max-width: 1024px) {
        position: static;
      }
    }
  }
}
</style>