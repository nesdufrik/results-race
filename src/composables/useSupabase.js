import { createClient } from '@supabase/supabase-js'
import { useUser } from './useUser'
import { config } from '../config'

const supabaseUrl = config.SUPABASE_URL
const supabaseAnonKey = config.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

supabase.auth.onAuthStateChange((event, session) => {
	const { setUser } = useUser()
	setUser(session?.user)
})

export function useSupabase() {
	return { supabase }
}
