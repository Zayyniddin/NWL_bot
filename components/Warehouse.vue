<template>
	<div
		class="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-50 p-4"
	>
		<p class="text-xl text-gray-500 mb-2">{{ $t('warehousePage.title') }}</p>

		<el-form
			label-position="top"
			class="w-full max-w-xl bg-white p-6 rounded-xl shadow"
		>
			<el-form-item :label="$t('warehousePage.managerName')" required>
				<el-input v-model="managerName" disabled />
			</el-form-item>
			<!-- Pass Number -->
			<el-form-item :label="$t('warehousePage.passNumber')" required>
				<el-input
					v-model="passNumber"
					:placeholder="$t('warehousePage.passPlaceholder')"
				/>
			</el-form-item>

			<!-- Company -->
			<el-form-item :label="$t('warehousePage.company')" required>
				<el-select
					filterable
					v-model="selectedCompany"
					:placeholder="$t('warehousePage.companyPlaceholder')"
				>
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
				:label="$t('warehousePage.customCompany')"
				required
			>
				<el-input
					v-model="customCompany"
					:placeholder="$t('warehousePage.customCompanyPlaceholder')"
				/>
			</el-form-item>

			<el-form-item :label="$t('warehousePage.pickupMethod')" required>
				<el-select
					v-model="pickupMethod"
					:placeholder="$t('warehousePage.pickupPlaceholder')"
				>
					<el-option :label="$t('warehousePage.manual')" value="manual" />
					<el-option :label="$t('warehousePage.byCar')" value="byCar" />
				</el-select>
			</el-form-item>

			<!-- Car Number -->
			<el-form-item
				v-if="pickupMethod === 'byCar'"
				:label="$t('warehousePage.carNumber')"
				required
			>
				<el-input
					v-model="carNumber"
					:placeholder="$t('warehousePage.carPlaceholder')"
				/>
			</el-form-item>

			<!-- Places Count -->
			<el-form-item :label="$t('warehousePage.placesCount')" required>
				<el-input
					v-model="placesCount"
					:placeholder="$t('warehousePage.placesPlaceholder')"
					type="number"
				/>
			</el-form-item>

			<!-- Cargo Weight -->
			<el-form-item :label="$t('warehousePage.cargoWeight')" required>
				<el-input
					v-model="cargoWeight"
					:placeholder="$t('warehousePage.weightPlaceholder')"
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
					{{ $t('warehousePage.submit') }}
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const $axios = useAxios()
const passNumber = ref('')
const selectedCompany = ref('')
const customCompany = ref('')
const carNumber = ref('')
const placesCount = ref('')
const cargoWeight = ref('')
const pickupMethod = ref('')
const isLoading = ref(false)
const managerName = ref(t('warehousePage.managerNameValue'))

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
		pickupMethod.value === 'byCar' ? carNumber.value.trim() !== '' : true

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
		full_name: managerName.value,
		company: companyName,
		car_number: pickupMethod.value === 'byCar' ? carNumber.value : '',
		places_count: placesCount.value,
		cargo_weight: cargoWeight.value,
		pickup_method: pickupMethod.value,
	}

	try {
		await $axios.post('api/exit-records', payload)

		ElNotification({
			title: t('notifications.success'),
			message: t('notificationsWarehouse.passAdded'),
			type: 'success',
			duration: 3000,
		})

		// Сброс полей
		passNumber.value = ''
		selectedCompany.value = ''
		customCompany.value = ''
		carNumber.value = ''
		placesCount.value = ''
		cargoWeight.value = ''
		pickupMethod.value = ''
	} catch (error) {
		console.error(error)
		ElNotification({
			title: t('notifications.error'),
			message: t('notifications.submitError'),
			type: 'error',
			duration: 3000,
		})
	} finally {
		isLoading.value = false
	}
}
</script>
