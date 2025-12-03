<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import Chart from 'primevue/chart'

const { supabase } = useSupabase()

const participants = ref([])
const events = ref([])
const loading = ref(true)

const totalParticipants = computed(() => participants.value.length)
const menCount = computed(
	() =>
		participants.value.filter(
			(p) => p.gender === 'Masculino' || p.gender === 'male' || p.gender === 'M'
		).length
)
const womenCount = computed(
	() =>
		participants.value.filter(
			(p) =>
				p.gender === 'Femenino' || p.gender === 'female' || p.gender === 'F'
		).length
)

const estimatedRevenue = computed(() => {
	return menCount.value * 50 + womenCount.value * 35
})

const chartDataGender = computed(() => {
	return {
		labels: ['Hombres', 'Mujeres'],
		datasets: [
			{
				data: [menCount.value, womenCount.value],
				backgroundColor: ['#3b82f6', '#ec4899'],
				hoverBackgroundColor: ['#2563eb', '#db2777'],
			},
		],
	}
})

const chartOptionsGender = ref({
	plugins: {
		legend: {
			labels: {
				usePointStyle: true,
			},
		},
	},
})

const chartDataRegistrations = computed(() => {
	const dates = participants.value.map((p) =>
		new Date(p.registration_date).toLocaleDateString()
	)
	const dateCounts = dates.reduce((acc, date) => {
		acc[date] = (acc[date] || 0) + 1
		return acc
	}, {})

	const sortedDates = Object.keys(dateCounts).sort(
		(a, b) => new Date(a) - new Date(b)
	)

	return {
		labels: sortedDates,
		datasets: [
			{
				label: 'Inscripciones por día',
				data: sortedDates.map((date) => dateCounts[date]),
				fill: false,
				borderColor: '#10b981',
				tension: 0.4,
			},
		],
	}
})

const chartOptionsRegistrations = ref({
	maintainAspectRatio: false,
	aspectRatio: 0.6,
	plugins: {
		legend: {
			labels: {
				color: '#4b5563',
			},
		},
	},
	scales: {
		x: {
			ticks: {
				color: '#6b7280',
			},
			grid: {
				color: '#e5e7eb',
			},
		},
		y: {
			ticks: {
				color: '#6b7280',
			},
			grid: {
				color: '#e5e7eb',
			},
		},
	},
})

const fetchData = async () => {
	try {
		loading.value = true
		const { data: participantsData, error: participantsError } = await supabase
			.from('participants')
			.select('*')

		if (participantsError) throw participantsError
		participants.value = participantsData

		const { data: eventsData, error: eventsError } = await supabase
			.from('events')
			.select('*')

		if (eventsError) throw eventsError
		events.value = eventsData
	} catch (error) {
		console.error('Error fetching dashboard data:', error)
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	fetchData()
})
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold text-primary">Dashboard</h1>

		<div v-if="loading" class="text-center py-10">
			<i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
			<p class="mt-2 text-gray-500">Cargando datos...</p>
		</div>

		<div
			v-else
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-9"
		>
			<!-- Stats Cards -->
			<Card class="border-l-4 border-blue-500">
				<template #content>
					<div class="flex items-center justify-between">
						<div>
							<p
								class="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold"
							>
								Total Participantes
							</p>
							<p class="text-3xl font-bold text-gray-800 dark:text-white mt-1">
								{{ totalParticipants }}
							</p>
						</div>
						<div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
							<i
								class="pi pi-users text-blue-600 dark:text-blue-300 text-xl"
							></i>
						</div>
					</div>
				</template>
			</Card>

			<Card class="border-l-4 border-green-500">
				<template #content>
					<div class="flex items-center justify-between">
						<div>
							<p
								class="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold"
							>
								Eventos Activos
							</p>
							<p class="text-3xl font-bold text-gray-800 dark:text-white mt-1">
								{{ events.length }}
							</p>
						</div>
						<div class="bg-green-100 dark:bg-green-900 p-3 rounded-full">
							<i
								class="pi pi-calendar text-green-600 dark:text-green-300 text-xl"
							></i>
						</div>
					</div>
				</template>
			</Card>

			<Card class="border-l-4 border-purple-500">
				<template #content>
					<div class="flex items-center justify-between">
						<div>
							<p
								class="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold"
							>
								Ingresos Estimados
							</p>
							<p class="text-3xl font-bold text-gray-800 dark:text-white mt-1">
								Bs. {{ estimatedRevenue.toLocaleString() }}
							</p>
						</div>
						<div class="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
							<i
								class="pi pi-dollar text-purple-600 dark:text-purple-300 text-xl"
							></i>
						</div>
					</div>
				</template>
			</Card>

			<!-- Charts -->
			<Card class="border-l-4 border-blue-500">
				<template #content>
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
						Distribución por Género
					</h3>
					<div class="flex justify-center">
						<Chart
							type="doughnut"
							:data="chartDataGender"
							:options="chartOptionsGender"
							class="w-full md:w-30rem"
						/>
					</div>
				</template>
			</Card>

			<Card class="p-6 col-span-1 lg:col-span-2">
				<template #content>
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
						Inscripciones en el Tiempo
					</h3>
					<Chart
						type="line"
						:data="chartDataRegistrations"
						:options="chartOptionsRegistrations"
						class="h-[300px]"
					/>
				</template>
			</Card>
		</div>
	</div>
</template>
