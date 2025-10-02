export type RecordPair = {
  egressId: string | null
  roomId: string | null
  roomName: string | null
  startedAt: number | null
  endedAt: number | null
  durationSeconds: number | null
  phoneNumber: string | null
  json: { key: string; size?: number; lastModified?: string } | null
  mp4: { key: string; size?: number; lastModified?: string } | null
}
