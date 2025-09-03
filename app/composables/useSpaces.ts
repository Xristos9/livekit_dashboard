import type { RecordPair } from '@/types/livekit'

export function useSpaces() {
  const config = useRuntimeConfig()
  // Public base (absolute) to serve files (e.g., https://bucket.fra1.digitaloceanspaces.com)
  const publicBase = computed(() =>
    (useRuntimeConfig().public.spacesPublicBase || '').replace(/\/$/, '')
  )

  // UI state
  const prefix = useState('prefix', () => '')
  const jsonLimit = useState('jsonLimit', () => 25) // tune as needed
  const jsonConcurrency = useState('jsonConcurrency', () => 3) // tune as needed

  const records = useState<RecordPair[]>('records', () => [])
  const loading = useState('loading', () => false)
  const error = useState<string | null>('err', () => null)

  // Build absolute URL for an object key
  function fileUrl(key?: string | null) {
    return key ? `/api/spaces/file?key=${encodeURIComponent(key)}` : '#'
  }

  async function load(opts?: { reset?: boolean }) {
    if (opts?.reset) {
      records.value = []
    }
    loading.value = true
    error.value = null
    try {
      // Server returns an ARRAY of records now
      const { data, error: err } = await useFetch<RecordPair[]>('/api/spaces/list', {
        query: {
          prefix: prefix.value || undefined,
          jsonLimit: jsonLimit.value,
          jsonConcurrency: jsonConcurrency.value,
        },
        // Include key so Nuxt caches per query
        key: `list-${prefix.value}-${jsonLimit.value}-${jsonConcurrency.value}`,
      })
      if (err.value) throw err.value
      records.value = data.value ?? []
    } catch (e: any) {
      error.value = e?.message || String(e)
    } finally {
      loading.value = false
    }
  }

  load()

  return {
    // state
    prefix,
    jsonLimit,
    jsonConcurrency,
    records,
    loading,
    error,
    // actions
    load,
    // helpers
    fileUrl,
  }
}
