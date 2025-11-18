import { useSupabase } from './useSupabase'
import { useUser } from './useUser'
import { useRouter } from 'vue-router'

export function useAuth() {
	const { supabase } = useSupabase()
	const { setUser } = useUser()
	const router = useRouter()

	const getSession = async () => {
		const { data, error } = await supabase.auth.getSession()
		const token = await supabase.auth.getUser(token)
		if (error) throw error
		if (data.session && data.session.user) {
			setUser(data.session.user)
		}
		return data.session
	}

	const loginWithPassw = async ({ email, password }) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error)
			throw new Error('Error de autenticación correo o contraseña incorrecta')

		setUser(data.user)
		router.push('/admin/dashboard')
	}

	return {
		getSession,
		loginWithPassw,
	}
}
