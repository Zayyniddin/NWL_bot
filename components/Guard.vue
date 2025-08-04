<template>
	<div
		class="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-50 p-4"
	>
		<p class="text-xl text-gray-500 mb-2">{{ $t('guardPage.title') }}</p>

		<el-form
			label-position="top"
			class="w-full max-w-xl bg-white p-6 rounded-xl shadow"
			:model="form"
			:rules="rules"
			ref="formRef"
		>
			<!-- Въезд / Выезд -->
			<el-form-item
				:label="$t('guardPage.actionType')"
				required
				prop="actionType"
			>
				<el-radio-group v-model="form.actionType">
					<el-radio-button :label="$t('guardPage.entry')" />
					<el-radio-button :label="$t('guardPage.exit')" />
				</el-radio-group>
			</el-form-item>

			<!-- Остальные поля только если выбран actionType -->
			<template v-if="form.actionType">
				<!-- Номер пропуска -->
				<el-form-item
					v-if="form.actionType === $t('guardPage.exit')"
					:label="$t('guardPage.passNumber')"
					required
					prop="passNumber"
				>
					<el-input
						v-model="form.passNumber"
						:placeholder="$t('guardPage.passPlaceholder')"
					/>
				</el-form-item>

				<!-- Только при въезде -->
				<template v-if="form.actionType === $t('guardPage.entry')">
					<el-form-item :label="$t('guardPage.kppNumber')" required prop="kpp">
						<el-select
							v-model="form.kpp"
							:placeholder="$t('guardPage.kppPlaceholder')"
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
					<el-form-item :label="$t('guardPage.guardName')" prop="fullName">
						<el-select
								filterable
							v-model="form.fullName"
							:placeholder="$t('guardPage.guardPlaceholder')"
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
					<el-form-item :label="$t('guardPage.company')" prop="selectedCompany">
						<el-select
							filterable
							v-model="form.selectedCompany"
							:filterable="false"
							:placeholder="$t('guardPage.companyPlaceholder')"
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
						:label="$t('guardPage.customCompany')"
						prop="customCompany"
					>
						<el-input
							v-model="form.customCompany"
							:placeholder="$t('guardPage.customCompanyPlaceholder')"
						/>
					</el-form-item>

					<!-- Номер машины -->
					<el-form-item :label="$t('guardPage.carNumber')" prop="carNumber">
						<el-input
							v-model="form.carNumber"
							:placeholder="$t('guardPage.carPlaceholder')"
						/>
					</el-form-item>

					<el-form-item :label="$t('guardPage.direction')" prop="direction">
						<el-select
							v-model="form.direction"
							:filterable="false"
							:placeholder="$t('guardPage.directionPlaceholder')"
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
					<el-form-item :label="$t('guardPage.placesCount')" prop="placesCount">
						<el-input
							v-model.number="form.placesCount"
							:placeholder="$t('guardPage.placesPlaceholder')"
							type="number"
						/>
					</el-form-item>

					<!-- Вес груза -->
					<el-form-item :label="$t('guardPage.cargoWeight')" prop="cargoWeight">
						<el-input
							v-model.number="form.cargoWeight"
							:placeholder="$t('guardPage.weightPlaceholder')"
							type="number"
						/>
					</el-form-item>

					<el-form-item
						v-if="form.direction === $t('directions.import')"
						:label="$t('guardPage.athNumber')"
						prop="ATH"
					>
						<el-input
							v-model.number="form.ath"
							:placeholder="$t('guardPage.athPlaceholder')"
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
						{{ $t('guardPage.submit') }}
					</el-button>
				</el-form-item>
			</template>
		</el-form>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const $axios = useAxios()
const users = ref([])
const formRef = ref(null)
const isLoading = ref(false)

onMounted(async () => {
	try {
		const res = await $axios.get('/api/auth/users?is_guard=true')
		users.value = res.data.data
	} catch (err) {
		console.error('Error loading users:', err)
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

// Статические данные с переводами
const directions = ref([
	t('directions.import'),
	t('directions.export'),
	t('directions.svh'),
])

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

const kpps = ref(['1', '2'])

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

// Правила валидации с переводами
const rules = {
	actionType: [
		{
			required: true,
			message: () => t('validation.required'),
			trigger: 'change',
		},
	],
	passNumber: [
		{
			required: true,
			message: () => t('validation.passRequired'),
			trigger: 'blur',
		},
	],
	fullName: [
		{
			required: true,
			trigger: 'blur',
			validator: (_, value) => {
				return form.value.actionType === t('guardPage.entry')
					? !!value || new Error(t('validation.nameRequired'))
					: true
			},
		},
	],
	selectedCompany: [
		{
			required: true,
			trigger: 'change',
			validator: (_, value) => {
				return form.value.actionType === t('guardPage.entry')
					? !!value || new Error(t('validation.companyRequired'))
					: true
			},
		},
	],
	customCompany: [
		{
			required: true,
			trigger: 'blur',
			validator: (_, value) => {
				return form.value.selectedCompany === 'Другое'
					? !!value || new Error(t('validation.customCompanyRequired'))
					: true
			},
		},
	],
	carNumber: [
		{
			required: true,
			trigger: 'blur',
			validator: (_, value) => {
				return form.value.actionType === t('guardPage.entry')
					? !!value || new Error(t('validation.carRequired'))
					: true
			},
		},
	],
	placesCount: [
		{
			required: true,
			trigger: 'blur',
			validator: (_, value) => {
				return form.value.actionType === t('guardPage.entry')
					? !!value || new Error(t('validation.placesRequired'))
					: true
			},
		},
	],
	cargoWeight: [
		{
			required: true,
			trigger: 'blur',
			validator: (_, value) => {
				return form.value.actionType === t('guardPage.entry')
					? !!value || new Error(t('validation.weightRequired'))
					: true
			},
		},
	],
}

const isFormValid = computed(() => {
	const f = form.value
	const entry = t('guardPage.entry')

	if (f.actionType === entry) {
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
			if (form.value.actionType === t('guardPage.exit')) {
				const validateRes = await $axios.get('/api/exit-records/validate', {
					params: { passNumber: form.value.passNumber },
				})

				if (validateRes.data?.success) {
					ElNotification({
						title: t('notifications.success'),
						message: t('notifications.exitSuccess'),
						type: 'success',
						duration: 3000,
					})
					formRef.value.resetFields()
				} else {
					ElNotification({
						title: t('notifications.error'),
						message: t('notifications.passError'),
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
				title: t('notifications.success'),
				message: t('notifications.entrySuccess'),
				type: 'success',
				duration: 3000,
			})
			formRef.value.resetFields()
		} catch (error) {
			console.error('Submit error:', error)
			ElNotification({
				title: t('notifications.error'),
				message: t('notifications.submitError'),
				type: 'error',
				duration: 3000,
			})
		} finally {
			isLoading.value = false
		}
	})
}
</script>
