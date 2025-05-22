<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const $axios = useAxios()

const access_token = ref(localStorage.getItem('access_token') || null)
const currentView = ref('')
const isFetched = ref(false)
const authCode = ref('')
const userData = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const roles = ref(JSON.parse(localStorage.getItem('roles') || '[]')) 

const updateView = () => {
	if (roles.value.includes('GUARD')) {
		currentView.value = 'form1'
	} else if (roles.value.includes('MANAGER')) {
		currentView.value = 'form2'
	} else if (roles.value.includes('ADMIN')) {
		currentView.value = 'admin'
	} else {
		currentView.value = ''
	}
}

const fetchUserInfo = async (telegramId) => {
	try {
		const generateRes = await $axios.get(`/api/auth/generate-code?telegramId=${telegramId}`)
		authCode.value = generateRes.data.data

		const loginRes = await $axios.get(`/api/auth/login?code=${authCode.value}`)
		userData.value = loginRes.data.data
		roles.value = loginRes.data.data.roles 

		localStorage.setItem('access_token', userData.value.access_token)
		localStorage.setItem('user', JSON.stringify(userData.value.user))
		localStorage.setItem('roles', JSON.stringify(roles.value)) 

		access_token.value = userData.value.access_token
		isFetched.value = true
		updateView()
	} catch (error) {
		console.error('Ошибка авторизации:', error)
	}
}

onMounted(async () => {
	const tokenFromUrl = route.query.access_token

	if (tokenFromUrl && !localStorage.getItem('access_token')) {
		await fetchUserInfo(tokenFromUrl)

		const { access_token, ...restQuery } = route.query
		router.replace({ query: restQuery })
	} else if (!isFetched.value && access_token.value && !userData.value) {
		await fetchUserInfo(access_token.value)
	} else if (userData.value) {
		isFetched.value = true
		updateView()
	}
})
</script>

<template>
	<div>
		<Guard v-if="currentView === 'form1'" />
		<Warehouse v-else-if="currentView === 'form2'" />
		<Admin v-else-if="currentView === 'admin'" />

		<div v-else class="flex items-center justify-center h-screen">
			<svg
				class="animate-spin h-20 w-20 text-gray-700"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
				></path>
			</svg>
		</div>
	</div>
</template>
