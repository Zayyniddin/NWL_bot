import axios from 'axios'
export default defineNuxtPlugin(() => {
	const instance = axios.create({
		baseURL: 'https://backend.efteams.uz/',
	})

	instance.interceptors.request.use(
		request => {
			if (process.client) {
				const token = localStorage.getItem('access_token')
				if (token) {
					request.headers.Authorization = `Bearer ${token}`
				}
			}
			return request
		},
		error => {
			return Promise.reject(error)
		}
	)

	return {
		provide: {
			axios: instance,
		},
	}
})
