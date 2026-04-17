import { createClient } from '@supabase/supabase-js'
const url = 'https://noiiuwkovoojkcwzupye.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vaWl1d2tvdm9vamtjd3p1cHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NTI0ODAsImV4cCI6MjA1NjMyODQ4MH0.JgEGuYPOv-afBkw_J1mBnTN5aWJIzSMzB_dHbLXzp40'
export const supabase = createClient(url, key)
