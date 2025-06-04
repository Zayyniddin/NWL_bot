<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton } from 'element-plus'

const route = useRoute()
const $axios = useAxios()

const { locale, t, setLocale } = useI18n()

const availableLanguages = reactive([
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: 'O‘zbekcha' },
])


const access_token = ref(localStorage.getItem('access_token') || null)
const isFetched = ref(false)
const authCode = ref('')
const userData = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const roles = ref(JSON.parse(localStorage.getItem('roles') || '[]'))

const availableViews = ref([])
const selectedView = ref('')

const roleLabels = reactive({
  form1: t('roles.GUARD'),
  form2: t('roles.MANAGER'),
  admin: t('roles.ADMIN'),
})

const updateView = () => {
  const views = []
  if (roles.value.includes('GUARD')) views.push('form1')
  if (roles.value.includes('MANAGER')) views.push('form2')
  if (roles.value.includes('ADMIN')) views.push('admin')

  availableViews.value = views
  selectedView.value = views[0] || ''
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

fetchUserInfo(route.query.access_token)

function handleLangCommand(code) {
  setLocale(code)
}

function handleViewCommand(view) {
  selectedView.value = view
}

</script>

<template>
  <div>
    <!-- Dropdown выбора языка -->
    <div class="absolute top-4 left-4 z-50">
      <el-dropdown @command="handleLangCommand" trigger="click">
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
						class='px-4 py-1 cursor-pointer'
              v-for="lang in availableLanguages"
              :key="lang.code"
              :command="lang.code"
            >
              {{ lang.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>

        <el-button type="primary" size="small">
          {{ availableLanguages.find(l => l.code === locale)?.label || 'Select' }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </el-dropdown>
    </div>

    <!-- Dropdown выбора view -->
    <div v-if="availableViews.length > 1" class="absolute top-4 right-4 z-50">
      <el-dropdown @command="handleViewCommand" trigger="click">
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
							class='px-4 py-1 cursor-pointer'
              v-for="view in availableViews"
              :key="view"
              :command="view"
            >
              {{ roleLabels[view] }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>

        <el-button type="primary" size="small">
          {{ roleLabels[selectedView] || 'Select View' }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </el-dropdown>
    </div>

    <Guard v-if="selectedView === 'form1'" />
    <Warehouse v-else-if="selectedView === 'form2'" />
    <Admin
      v-else-if="selectedView === 'admin'"
      :selected-view="selectedView"
      @update:selected-view="selectedView = $event"
      :available-views="availableViews"
      :role-labels="roleLabels"
    />

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
