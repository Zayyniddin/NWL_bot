<template>
	<div
		class="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-50 p-4"
	>
		<p class="text-xl text-gray-500 mb-2">Охранник КПП NWL</p>

		<el-form
			label-position="top"
			class="w-full max-w-xl bg-white p-6 rounded-xl shadow"
			:model="form"
			:rules="rules"
			ref="formRef"
		>
			<!-- Въезд / Выезд -->
			<el-form-item label="Тип действия" required="" prop="actionType">
				<el-radio-group v-model="form.actionType">
					<el-radio-button label="въезд" />
					<el-radio-button label="выезд" />
				</el-radio-group>
			</el-form-item>

			<!-- Остальные поля только если выбран actionType -->
			<template v-if="form.actionType">
				<!-- Номер пропуска -->
				<el-form-item  v-if="form.actionType === 'выезд'" label="Номер пропуска" required prop="passNumber">
					<el-input
						v-model="form.passNumber"
						placeholder="Введите номер пропуска"
					/>
				</el-form-item>

				<!-- Только при въезде -->
				<template v-if="form.actionType === 'въезд'">
					<el-form-item label="Номер КПП" required="" prop="kpp">
						<el-select
							v-model="form.kpp"
							placeholder="Выберите КПП"
							:filterable="false"
						>
							<el-option
								v-for="kpp in kpps"
								:key="kpp"
								:label="kpp"
								:value="kpp"
							/>
						</el-select>
					</el-form-item>

					<!-- ФИО -->
					<el-form-item label="ФИО охранника" prop="fullName">
						<el-select
							v-model="form.fullName"
							placeholder="Выберите охранника"
							:filterable="false"
						>
							<el-option
								v-for="user in users"
								:key="user.id"
								:label="user.full_name"
								:value="user.id"
							/>
						</el-select>
					</el-form-item>

					<!-- Компания -->
					<el-form-item label="Компания" prop="selectedCompany">
						<el-select
							v-model="form.selectedCompany"
							:filterable="false"
							placeholder="Выберите компанию"
						>
							<el-option
								v-for="company in companies"
								:key="company"
								:label="company"
								:value="company"
							/>
						</el-select>
					</el-form-item>

					<!-- Название компании, если "Другое" -->
					<el-form-item
						v-if="form.selectedCompany === 'Другое'"
						label="Название компании"
						prop="customCompany"
					>
						<el-input
							v-model="form.customCompany"
							placeholder="Введите название компании вручную"
						/>
					</el-form-item>

					<!-- Номер машины -->
					<el-form-item
						label="Номер машины (01X001XX / 01001XXX)"
						prop="carNumber"
					>
						<el-input
							v-model="form.carNumber"
							placeholder="Введите номер машины"
						/>
					</el-form-item>

					<el-form-item label="Направление" prop="direction">
						<el-select
							v-model="form.direction"
							:filterable="false"
							placeholder="Выберите направление"
						>
							<el-option
								v-for="direction in directions"
								:key="direction"
								:label="direction"
								:value="direction"
							/>
						</el-select>
					</el-form-item>

					<!-- Кол-во мест -->
					<el-form-item label="Кол-во мест" prop="placesCount">
						<el-input
							v-model.number="form.placesCount"
							placeholder="Введите количество мест"
							type="number"
						/>
					</el-form-item>

					<!-- Вес груза -->
					<el-form-item label="Вес груза (в кг) (123.45)" prop="cargoWeight">
						<el-input
							v-model.number="form.cargoWeight"
							placeholder="Введите вес груза в кг"
							type="number"
						/>
					</el-form-item>

					<el-form-item label="Номер АТН (АТ123456789...)" prop="ATH"   v-if="form.direction === 'Импорт'">
            
						<el-input
							v-model.number="form.ath"
							placeholder="Введите номер ATH"
						/>
					</el-form-item>
				</template>

				<!-- Кнопка -->
				<el-form-item>
					<el-button
						:loading="isLoading"
						type="primary"
						:disabled="!isFormValid"
						@click="handleSubmit"
					>
						Отправить
					</el-button>
				</el-form-item>
			</template>
		</el-form>
	</div>
</template>

<script setup>
const $axios = useAxios()
const users = ref([])
const formRef = ref(null)
const isLoading = ref(false)

onMounted(async () => {
	try {
		const res = await $axios.get('/api/auth/users?is_guard=true')
		users.value = res.data.data
	} catch (err) {
		console.error('Ошибка при загрузке пользователей:', err)
	}
})

const form = ref({
	kpp: '',
	fullName: '',
	actionType: '',
	passNumber: '',
	direction: '',
	selectedCompany: '',
	customCompany: '',
	carNumber: '',
	placesCount: '',
	cargoWeight: '',
	ath: '',
})

const resetFields = () => {
	form.value.fullName = ''
	form.value.passNumber = ''
	form.value.selectedCompany = ''
	form.value.customCompany = ''
	form.value.carNumber = ''
	form.value.placesCount = ''
	form.value.cargoWeight = ''
}

watch(
	() => form.value.actionType,
	(newValue, oldValue) => {
		if (oldValue && newValue !== oldValue) {
			resetFields()
		}
	}
)

const companies = [
	'SAODAT EXPRESS',
	'139 EXPRESS',
	'AB Express Group',
	'ABU EXPRESS',
	'ADETA FORWARD',
	'Aktiv Express Cargo',
	'ARABIA CARGO',
	'ARAMEX',
	'ASD',
	'Atlantic Logistics',
	'Avis Logistics',
	'AYUB EXPRESS',
	'BCA CARGO',
	'Best Express Expo',
	'BSA CARGO SERVICE',
	'BSB CARGO',
	'BTS Express Cargo Servis',
	'CA LOGIST',
	'Cargo Green',
	'CARGO SCRIPT',
	'CARGO STAR',
	'CDEK',
	'Courier Express',
	'CPCARGO',
	'DELIVEX',
	'Direct Programm',
	'DPD EURASIA',
	'Express Mail Universal',
	'Express Paradise',
	'EXPRESS SERVICE DELIVERY',
	'EXPRESS TASHKENT',
	'FAROVON EXPRESS POCHTA',
	'FAST EXIM',
	'FEDEX (CARGO STAR EXPRESS)',
	'FOX GOLDIN EXPRES',
	'GARANT POCHTA',
	'GLOBBING',
	'Greenline Logistics',
	'HAFSIZ KARGO',
	'HUMO DELIVERY',
	'IDM TRANS',
	'KHAYMANS EXPRESS',
	'Khizir Avia Logistics',
	'KLOGIS',
	'Lucky Express Group',
	'MEEST EXPORT',
	'MILLENIUM LOGISTICS',
	'MUSAFFO EXPRESS',
	'Nomex Delivery',
	'OK SUPER EXPRESS',
	'OMAD HAMKOR EXPRESS',
	'Onson Mail',
	'ONSONMAILCARGO',
	'Pilot Express',
	'PinDuoDuo Express',
	'Polar Express',
	'PONY EXPRESS',
	'PREMIUM IDEAL DELIVERY',
	'RAYYON 571',
	'Real Express Avia',
	'Real Shoh Express',
	'REGISTAN AVIA POCHTA',
	'Reliable Mail',
	'RESURSI',
	'ROASTMASTERS',
	'RZG NEW EXPRESS',
	'SARAY STORE',
	'Shipping Express',
	'SHOSH Express',
	'Smart Invest Express',
	'Sof Impex Servis',
	'Srn Intl Limited',
	'STAREX GLOBAL',
	'Supreme Express Logistics',
	'SURAT CARGO',
	'Tez Parcel',
	'TEZ TEZ',
	'Trans Post Asia',
	'UPS (TRANSCONTINENTAL)',
	'Valley Eternity',
	'WELL CARGO',
	'WIKISHOP',
	'World Wide Cargo',
	'YELLOW AVIA',
	'Другое',
]

const directions = ['Импорт', 'Экспорт', 'Забор с СВХ']
const kpps = ['1', '2']

const rules = {
	actionType: [{ required: true, message: 'Обязательно', trigger: 'change' }],
	passNumber: [
		{ required: true, message: 'Введите номер пропуска', trigger: 'blur' },
	],
	fullName: [
		{
			required: true,
			message: 'Введите ФИО',
			trigger: 'blur',
			validator(_, value) {
				return form.value.actionType === 'въезд' ? !!value : true
			},
		},
	],
	selectedCompany: [
		{
			required: true,
			message: 'Выберите компанию',
			trigger: 'change',
			validator(_, value) {
				return form.value.actionType === 'въезд' ? !!value : true
			},
		},
	],
	customCompany: [
		{
			required: true,
			message: 'Введите название компании',
			trigger: 'blur',
			validator(_, value) {
				return form.value.selectedCompany === 'Другое' ? !!value : true
			},
		},
	],
	carNumber: [
		{
			required: true,
			message: 'Введите номер машины',
			trigger: 'blur',
			validator(_, value) {
				return form.value.actionType === 'въезд' ? !!value : true
			},
		},
	],
	placesCount: [
		{
			required: true,
			message: 'Введите количество мест',
			trigger: 'blur',
			validator(_, value) {
				return form.value.actionType === 'въезд' ? !!value : true
			},
		},
	],
	cargoWeight: [
		{
			required: true,
			message: 'Введите вес груза',
			trigger: 'blur',
			validator(_, value) {
				return form.value.actionType === 'въезд' ? !!value : true
			},
		},
	],
}

const isFormValid = computed(() => {
	const f = form.value
	if (f.actionType === 'въезд') {
		if (
			!f.fullName ||
			!f.selectedCompany ||
			!f.carNumber ||
			!f.placesCount ||
			!f.cargoWeight
		)
			return false
		if (f.selectedCompany === 'Другое' && !f.customCompany) return false
	}
	return true
})

const handleSubmit = () => {
	formRef.value.validate(async valid => {
		if (!valid) return

		isLoading.value = true

		try {
			if (form.value.actionType === 'выезд') {
				const validateRes = await $axios.get('/api/exit-records/validate', {
					params: {
						passNumber: form.value.passNumber,
					},
				})

				if (validateRes.data?.success) {
					ElNotification({
						title: 'Успешно',
						message: 'Выезд успешно зарегистрирован',
						type: 'success',
						duration: 3000,
					})
					formRef.value.resetFields()
				} else {
					ElNotification({
						title: 'Ошибка',
						message: 'Пропуск недействителен или не найден',
						type: 'error',
						duration: 3000,
					})
				}

				isLoading.value = false
				return
			}

			let selectedUser = users.value.find(
				user => user.id === form.value.fullName
			)

			const payload = {
				pass_number: form.value.passNumber,
				full_name: selectedUser?.full_name || '',
				company:
					form.value.selectedCompany === 'Другое'
						? form.value.customCompany
						: form.value.selectedCompany,
				car_number: form.value.carNumber,
				places_count: form.value.placesCount,
				cargo_weight: form.value.cargoWeight,
				kpp: form.value.kpp,
				ath: form.value.ath,
				direction: form.value.direction,
				staff_id: selectedUser?.id || null,
			}

			await $axios.post('api/entry-records', payload)

			ElNotification({
				title: 'Успешно',
				message: 'Въезд успешно зарегистрирован',
				type: 'success',
				duration: 3000,
			})
			formRef.value.resetFields()
		} catch (error) {
			console.error('Ошибка при отправке:', error)
			ElNotification({
				title: 'Ошибка',
				message: 'Не удалось отправить данные',
				type: 'error',
				duration: 3000,
			})
		} finally {
			isLoading.value = false
		}
	})
}
</script>
