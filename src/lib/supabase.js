import { createClient } from '@supabase/supabase-js'
const url = 'https://noiiuwkovoojkcwzupye.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vaWl1d2tvdm9vamtjd3p1cHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTQyMTcsImV4cCI6MjA4Njc3MDIxN30.Wpduc4qYawgVSWqMqKPaDWUXm0dp8A_z9IxOrVfqN7w'
export const supabase = createClient(url, key)
