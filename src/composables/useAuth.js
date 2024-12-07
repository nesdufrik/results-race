import { login } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

export const useAuth = () => {
	const authStore = useAuthStore()
	const { user } = storeToRefs(authStore)
	const loading = ref(false)
	const errorMessage = ref('')

	const loginAction = async (username, password) => {
		try {
			errorMessage.value = ''
			loading.value = true
			const response = await login(username, password)
			loading.value = false
			if (response.success) {
				authStore.login(response.data)
			} else {
				errorMessage.value = response.message
				setTimeout(() => {
					errorMessage.value = ''
				}, 3000)
			}
		} catch (error) {
			return Promise.reject(error)
		}
	}

	const logoutAction = () => {
		authStore.logout()
	}

	return {
		user,
		login: loginAction,
		logout: logoutAction,
		loading,
		errorMessage,
	}
}
