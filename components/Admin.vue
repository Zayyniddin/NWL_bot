<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-3xl bg-white p-6 rounded-xl shadow">
      <h2 class="text-2xl font-semibold mb-4 text-center">Админ панель — Пользователи</h2>

      <!-- Добавление пользователя -->
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <el-input v-model="newUser.name" placeholder="Имя пользователя" />
        <el-select v-model="newUser.role" placeholder="Роль">
          <el-option label="Охранник" value="Охранник" />
          <el-option label="Зав. склад" value="Зав. склад" />
        </el-select>
        <el-button type="primary" @click="addUser" :disabled="!newUser.name || !newUser.role">
          Добавить
        </el-button>
      </div>

      <!-- Таблица -->
      <el-table :data="users" stripe class="w-full">
        <el-table-column prop="name" label="Имя" />
        <el-table-column prop="role" label="Роль" />
        <el-table-column label="Действия" width="100">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="deleteUser(row)">Удалить</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { name: 'Иван', role: 'Охранник' },
  { name: 'Алексей', role: 'Зав. склад' }
])

const newUser = ref({ name: '', role: '' })

const addUser = () => {
  users.value.push({ ...newUser.value })
  newUser.value.name = ''
  newUser.value.role = ''
}

const deleteUser = (user) => {
  users.value = users.value.filter(u => u !== user)
}
</script>
