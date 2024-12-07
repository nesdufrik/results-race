import axios from 'axios'

export const login = async (username, password) => {
	try {
		const response = await axios.post('/auth', {
			username,
			password,
		})

		if (response.data.success) {
			axios.defaults.headers.common[
				'Authorization'
			] = `Bearer ${response.data.data.token}`
		}

		return response.data
	} catch (error) {
		return Promise.reject(error)
	}
}
