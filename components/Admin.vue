<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-4xl bg-white p-6 rounded-xl shadow">
      <h2 class="text-2xl font-semibold mb-4 text-center">Админ панель — Пользователи</h2>

      <!-- Добавление пользователя -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <el-input v-model="newUser.name" placeholder="Имя пользователя" />
        <el-input v-model="newUser.phone" placeholder="Номер телефона" />
        <el-select v-model="newUser.role" placeholder="Роль">
          <el-option label="Охранник" value="Охранник" />
          <el-option label="Зав. склад" value="Зав. склад" />
        </el-select>
        <el-button type="primary" :loading="addLoading" @click="addUser" :disabled="!formValid">
          Добавить
        </el-button>
      </div>

      <!-- Таблица -->
      <el-table :data="users" stripe class="w-full" v-loading="loadingUsers">
        <el-table-column prop="full_name" label="Имя" />
        <el-table-column prop="phone_number" label="Номер" />
        <el-table-column label="Роль">
          <template #default="{ row }">
            {{ getRoleLabel(row.permissions) }}
          </template>
        </el-table-column>
        <el-table-column label="Действия" width="120">
          <template #default="{ row }">
            <el-popconfirm
              title="Удалить пользователя?"
              confirm-button-text="Да"
              cancel-button-text="Нет"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" :loading="deleteLoadingId === row.id">
                  Удалить
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import axios from 'axios'

const users = ref([])
const loadingUsers = ref(false)
const addLoading = ref(false)
const deleteLoadingId = ref(null)

const newUser = ref({
  name: '',
  phone: '',
  role: ''
})

const formValid = computed(() => {
  return newUser.value.name && newUser.value.phone && newUser.value.role
})

const getRoleLabel = (permissions) => {
  if (permissions.includes('GUARD')) return 'Охранник'
  if (permissions.includes('WAREHOUSE')) return 'Зав. склад'
  return 'Неизвестно'
}

const loadUsers = async () => {
  loadingUsers.value = true
  try {
    const res = await axios.get('/api/auth/users')
    users.value = res.data
  } catch (err) {
    console.error(err)
    ElNotification({ title: 'Ошибка', message: 'Не удалось загрузить пользователей', type: 'error' })
  } finally {
    loadingUsers.value = false
  }
}

const addUser = async () => {
  addLoading.value = true
  try {
    const payload = {
      full_name: newUser.value.name,
      phone_number: newUser.value.phone.replace('+', ''),
      permissions: newUser.value.role === 'Охранник' ? ['GUARD'] : ['WAREHOUSE']
    }

    await axios.post('/api/auth/create', payload)
    ElNotification({ title: 'Успешно', message: 'Пользователь добавлен', type: 'success' })
    await loadUsers()

    newUser.value = { name: '', phone: '', role: '' }
  } catch (err) {
    console.error(err)
    ElNotification({ title: 'Ошибка', message: 'Не удалось добавить пользователя', type: 'error' })
  } finally {
    addLoading.value = false
  }
}

const deleteUser = async (id) => {
  deleteLoadingId.value = id
  try {
    await axios.delete(`/api/auth/delete/${id}`)
    ElNotification({ title: 'Успешно', message: 'Пользователь удален', type: 'success' })
    await loadUsers()
  } catch (err) {
    console.error(err)
    ElNotification({ title: 'Ошибка', message: 'Не удалось удалить пользователя', type: 'error' })
  } finally {
    deleteLoadingId.value = null
  }
}

onMounted(() => {
  loadUsers()
})
</script>
