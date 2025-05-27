<template>
	<div
		class="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-50 p-4"
	>
		<p class="text-xl text-gray-500 mb-2">Заведующий склада NWL</p>

		<el-form
			label-position="top"
			class="w-full max-w-xl bg-white p-6 rounded-xl shadow"
		>
			<el-form-item label="ФИО Зав. Склада" required>
				<el-input v-model="managerName" disabled />
			</el-form-item>
			<!-- Pass Number -->
			<el-form-item label="Номер пропуска" required>
				<el-input v-model="passNumber" placeholder="Введите номер пропуска" />
			</el-form-item>

			<!-- Company -->
			<el-form-item label="Компания" required>
				<el-select v-model="selectedCompany" placeholder="Выберите компанию">
					<el-option
						v-for="company in companies"
						:key="company"
						:label="company"
						:value="company"
					/>
				</el-select>
			</el-form-item>

			<!-- Custom Company -->
			<el-form-item
				v-if="selectedCompany === 'Другое'"
				label="Введите название компании"
				required
			>
				<el-input
					v-model="customCompany"
					placeholder="Введите название в ручную"
				/>
			</el-form-item>

			<el-form-item label="Метод забора" required>
				<el-select v-model="pickupMethod" placeholder="Выберите метод забора">
					<el-option label="вручную" value="вручную" />
					<el-option label="на машине" value="на машине" />
				</el-select>
			</el-form-item>

			<!-- Car Number -->
			<el-form-item
				v-if="pickupMethod === 'на машине'"
				label="Номер машины (01X001XX / 01001XXX)"
				required
			>
				<el-input v-model="carNumber" placeholder="Введите номер машины" />
			</el-form-item>

			<!-- Places Count -->
			<el-form-item label="Количество мест" required>
				<el-input
					v-model="placesCount"
					placeholder="Введите количество мест"
					type="number"
				/>
			</el-form-item>

			<!-- Cargo Weight -->
			<el-form-item label="Вес груза (кг)" required>
				<el-input
					v-model="cargoWeight"
					placeholder="Введите вес груза"
					type="number"
				/>
			</el-form-item>

			<!-- Submit Button -->
			<el-form-item>
				<el-button
					type="primary"
					@click="submitForm"
					:disabled="!isFormValid"
					:loading="isLoading"
				>
					Отправить
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
const $axios = useAxios()
const passNumber = ref('')
const selectedCompany = ref('')
const customCompany = ref('')
const carNumber = ref('')
const placesCount = ref('')
const cargoWeight = ref('')
const pickupMethod = ref('')
const isLoading = ref(false)
const managerName = 'Гафуров Кудратжон'

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

const isFormValid = computed(() => {
	const isCompanyValid =
		selectedCompany.value === 'Другое'
			? customCompany.value.trim() !== ''
			: selectedCompany.value.trim() !== ''

	const isCarNumberValid =
		pickupMethod.value === 'на машине' ? carNumber.value.trim() !== '' : true

	return (
		passNumber.value.trim() !== '' &&
		isCompanyValid &&
		isCarNumberValid &&
		placesCount.value.trim() !== '' &&
		cargoWeight.value.trim() !== '' &&
		pickupMethod.value.trim() !== ''
	)
})

const submitForm = async () => {
	isLoading.value = true

	const companyName =
		selectedCompany.value === 'Другое'
			? customCompany.value
			: selectedCompany.value

	const payload = {
		pass_number: passNumber.value,
		company: companyName,
		car_number: pickupMethod.value === 'на машине' ? carNumber.value : '',
		places_count: placesCount.value,
		cargo_weight: cargoWeight.value,
		pickup_method: pickupMethod.value,
	}

	try {
		await $axios.post('api/exit-records', payload)

		ElNotification({
			title: 'Успешно',
			message: 'Пропуск успешно добавлен',
			type: 'success',
			duration: 3000,
		})

		passNumber.value = ''
		selectedCompany.value = ''
		customCompany.value = ''
		carNumber.value = ''
		placesCount.value = ''
		cargoWeight.value = ''
	} catch (error) {
		console.error(error)
		ElNotification({
			title: 'Ошибка',
			message: 'Не удалось отправить данные',
			type: 'error',
			duration: 3000,
		})
	} finally {
		isLoading.value = false
	}
}
</script>
