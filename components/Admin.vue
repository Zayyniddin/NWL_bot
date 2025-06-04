<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
		<div class="w-full max-w-4xl bg-white p-6 rounded-xl shadow">
			<h2 class="text-2xl font-semibold mb-4 text-center">
				{{ $t('adminPanel.title') }}
			</h2>

			<!-- Добавление пользователя -->
			<div class="flex flex-col sm:flex-row gap-4 mb-6">
				<el-input 
					v-model="newUser.name" 
					:placeholder="$t('adminPanel.username')" 
				/>
				<el-input 
					v-model="newUser.phone" 
					:placeholder="$t('adminPanel.phone')" 
				/>
				<el-select 
					v-model="newUser.role" 
					:placeholder="$t('adminPanel.role')"
				>
					<el-option 
						:label="$t('roles.GUARD')" 
						value="GUARD" 
					/>
					<el-option 
						:label="$t('roles.MANAGER')" 
						value="MANAGER" 
					/>
					<el-option 
						:label="$t('roles.ADMIN')" 
						value="ADMIN" 
					/>
				</el-select>
				<el-button
					type="primary"
					:loading="addLoading"
					@click="addUser"
					:disabled="!formValid"
				>
					{{ $t('adminPanel.addButton') }}
				</el-button>
			</div>

			<!-- Таблица -->
			<el-table :data="users" stripe class="w-full" v-loading="loadingUsers">
				<el-table-column :label="$t('adminPanel.nameColumn')">
					<template #default="{ row }">
						<p class="text-[9px] sm:text-sm">{{ row.full_name }}</p>
					</template>
				</el-table-column>
				<el-table-column :label="$t('adminPanel.phoneColumn')">
					<template #default="{ row }">
						<p class="text-[9px] sm:text-sm">{{ row.phone || '-' }}</p>
					</template>
				</el-table-column>
				<el-table-column :label="$t('adminPanel.roleColumn')">
					<template #default="{ row }">
						<el-tag type="info" size="small">
							{{ formatRole(row.roles) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column 
					:label="$t('adminPanel.actionsColumn')" 
					width="120"
				>
					<template #default="{ row }">
						<el-popconfirm
							:title="$t('adminPanel.deleteConfirmTitle')"
							:confirm-button-text="$t('adminPanel.deleteConfirmConfirm')"
							:cancel-button-text="$t('adminPanel.deleteConfirmCancel')"
							@confirm="deleteUser(row.id)"
						>
							<template #reference>
								<el-button
									type="danger"
									size="small"
									:loading="deleteLoadingId === row.id"
								>
									{{ $t('adminPanel.deleteButton') }}
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
const {t}=useI18n()
import { ElNotification } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
const $axios = useAxios()

const users = ref([])
const loadingUsers = ref(false)
const addLoading = ref(false)
const deleteLoadingId = ref(null)

const newUser = ref({
	name: '',
	phone: '',
	role: '',
})

const formatRole = roles => {
	if (!roles || !roles.length) return '-'
	if (roles.includes('ADMIN')) return t('roles.ADMIN')
	if (roles.includes('MANAGER')) return t('roles.MANAGER')
	if (roles.includes('GUARD')) return t('roles.GUARD')
	return roles[0]
}

const formValid = computed(() => {
	return newUser.value.name && newUser.value.phone && newUser.value.role
})

const loadUsers = async () => {
	loadingUsers.value = true
	try {
		const res = await $axios.get('/api/auth/users?is_guard=false')
		users.value = res.data.data
	} catch (err) {
		console.error(err)
		ElNotification({
			title: t('notificationsAdmin.error'),
			message: t('notificationsAdmin.loadUsersError'),
			type: 'error',
		})
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
			permissions: [newUser.value.role],
		}

		await $axios.post('/api/auth/create', payload)
		ElNotification({
			title: t('notificationsAdmin.success'),
			message: t('notificationsAdmin.userAdded'),
			type: 'success',
		})
		await loadUsers()

		newUser.value = { name: '', phone: '', role: '' }
	} catch (err) {
		console.error(err)
		ElNotification({
			title: t('notificationsAdmin.error'),
			message: t('notificationsAdmin.addUserError'),
			type: 'error',
		})
	} finally {
		addLoading.value = false
	}
}

const deleteUser = async id => {
	deleteLoadingId.value = id
	try {
		await $axios.delete(`/api/auth/delete/${id}`)
		ElNotification({
			title: t('notificationsAdmin.success'),
			message: t('notificationsAdmin.userDeleted'),
			type: 'success',
		})
		await loadUsers()
	} catch (err) {
		console.error(err)
		ElNotification({
			title: t('notificationsAdmin.error'),
			message: t('notificationsAdmin.deleteUserError'),
			type: 'error',
		})
	} finally {
		deleteLoadingId.value = null
	}
}

onMounted(() => {
	loadUsers()
})
</script>