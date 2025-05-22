<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const $axios = useAxios()

const access_token = ref(route.query.access_token || null)
const currentView = ref('')
const isFetched = ref(false)
const authCode = ref('')
const userData = ref(null)
const roles = ref([])

const updateView = () => {
  if (roles.value.includes('GUARD')) {
    currentView.value = 'form1'
  } else if (access_token.value === '2') {
    currentView.value = 'form2'
  } else if (access_token.value === '3') {
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

    // Сохраняем в localStorage
    localStorage.setItem('access_token', userData.value.access_token)
    localStorage.setItem('user', JSON.stringify(userData.value.user))

    isFetched.value = true

    // 💡 ВАЖНО: вызывать только после загрузки ролей
    updateView()
  } catch (error) {
    console.error('Ошибка авторизации:', error)
  }
}

onMounted(() => {
  if (access_token.value && !isFetched.value) {
    fetchUserInfo(access_token.value)
  }
})

watch(
  () => route.query.access_token,
  (newToken) => {
    access_token.value = newToken
    if (newToken && !isFetched.value) {
      fetchUserInfo(newToken)
    }
  }
)

</script>



<template>
  <div>
    <Guard v-if="currentView === 'form1'" />
    <Warehouse v-else-if="currentView === 'form2'" />
    <Admin v-else-if="currentView === 'admin'" />

    <div v-else class="flex items-center justify-center h-screen">
      <!-- Большая спиннер анимация -->
      <svg class="animate-spin h-20 w-20 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
    </div>
  </div>
</template>
