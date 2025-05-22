import axios from 'axios'
export default defineNuxtPlugin(() => {
	const instance = axios.create({
		baseURL: 'http://95.130.227.195:8090/',
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
