import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
	}),
	getters: {
		isLogged: (state) => state.user !== null,
	},
	actions: {
		login(user) {
			this.user = user
			localStorage.setItem('token', user.token)
			this.router.push('/admin')
		},
		logout() {
			this.user = null
			localStorage.removeItem('token')
			this.router.push('/')
		},
		async verifyToken() {
			const token = localStorage.getItem('token')
			const response = await axios.get('/auth/verify', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (response.data.success) {
				axios.defaults.headers.common[
					'Authorization'
				] = `Bearer ${response.data.data.token}`
				this.login(response.data.data)
			} else {
				this.logout()
			}
		},
	},
})
