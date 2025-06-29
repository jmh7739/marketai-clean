import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://avbjqxpgletdvgayjqsyi.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2YmpxeHBnbGV0dmdheWpxc3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNjE5NDEsImV4cCI6MjA2NjczNzk0MX0.U7SOisz6JXAuyxkplO0bw-Y1zbGp57LRMT2R1HGqWiY"
const supabaseServiceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2YmpxeHBnbGV0dmdheWpxc3lpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTE2MTk0MSwiZXhwIjoyMDY2NzM3OTQxfQ.ZsNrPrreXsm9XnohHdDWUOTbZdUvMKyHf4UKwNw46ug"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// 관리자용 클라이언트 (서버 사이드에서만 사용)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
