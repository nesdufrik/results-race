<template>
	<div class="flex items-center justify-center">
		<div class="max-w-4xl xl:max-w-7xl w-full flex flex-col gap-5 px-2">
			<Menubar :model="items">
				<template #item="{ item, props, hasSubmenu }">
					<router-link
						v-if="item.route"
						v-slot="{ href, navigate }"
						:to="item.route"
						custom
					>
						<a v-ripple :href="href" v-bind="props.action" @click="navigate">
							<span :class="item.icon" />
							<span>{{ item.label }}</span>
						</a>
					</router-link>
					<a
						v-else
						v-ripple
						:href="item.url"
						:target="item.target"
						v-bind="props.action"
					>
						<span :class="item.icon" />
						<span>{{ item.label }}</span>
						<span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
					</a>
				</template>
				<template #end>
					<Button
						icon="pi pi-moon"
						iconPos="right"
						@click="toggleTheme"
						rounded
						text
					/>
				</template>
			</Menubar>
			<div class="flex flex-col gap-4">
				<div class="flex flex-row gap-4">
					<h1 class="text-primary font-semibold text-2xl">
						Tabla de Resultados
					</h1>
				</div>
				<div class="flex flex-col gap-1">
					<Select
						v-model="selectEvento"
						@change="cargarParticipantes"
						:options="events"
						optionLabel="name"
						placeholder="Seleccionar un evento"
						:loading="loading"
					/>
				</div>
				<div v-if="selectEvento" class="flex flex-col gap-4">
					<Panel
						v-for="category in selectEvento.categories.filter(
							(c) => c.startTime
						)"
						:key="category.id"
						toggleable
					>
						<template #header>
							<div class="flex flex-col justify-between">
								<div class="font-semibold text-lg">{{ category.name }}</div>
								<div class="flex flex-col gap-1">
									<div class="font-semibold">
										Inicio: {{ formatTime(category.startTime) }}
									</div>
									<div
										v-if="selectEvento.status === 'finished'"
										class="text-green-600 font-bold text-xs"
									>
										Carrera finalizada
									</div>
								</div>
							</div>
						</template>
						<div class="overflow-x-auto">
							<table class="min-w-full divide-y divide-gray-200">
								<thead>
									<tr>
										<th
											class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Posición
										</th>
										<th
											class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Número
										</th>
										<th
											class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Nombre
										</th>
										<th
											class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Equipo
										</th>
										<th
											class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Tiempo
										</th>
										<th
											class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
										>
											Estado
										</th>
									</tr>
								</thead>
								<tbody class="bg-white divide-y divide-gray-200">
									<tr
										v-for="(participant, index) in getLeaderboard(
											selectEvento.identificador,
											category.id
										)"
										:key="participant.id"
										:class="index < 3 ? 'bg-yellow-50' : ''"
									>
										<td class="px-6 py-4 whitespace-nowrap text-sm">
											<span
												:class="{
													'px-2 py-1 rounded-full text-xs font-medium':
														index < 3,
													'bg-yellow-100 text-yellow-800': index === 0,
													'bg-gray-100 text-gray-800': index === 1,
													'bg-orange-100 text-orange-800': index === 2,
												}"
											>
												{{ index + 1 }}
											</span>
										</td>
										<td
											class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
										>
											{{ participant.number }}
										</td>
										<td
											class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
										>
											{{ participant.name }}
										</td>
										<td
											class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
										>
											{{ participant.team }}
										</td>
										<td
											class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
										>
											{{ formatRaceTime(participant) }}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm">
											<span
												:class="{
													'px-2 py-1 rounded-full text-xs font-medium': true,
													'bg-yellow-100 text-yellow-800':
														!participant.startTime,
													'bg-blue-100 text-blue-800':
														participant.startTime && !participant.finishTime,
													'bg-green-100 text-green-800': participant.finishTime,
												}"
											>
												{{ getParticipantStatus(participant) }}
											</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Panel>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRace } from '@/composables/useRace'

const items = ref([
	{
		label: 'Leaderboard',
		icon: 'pi pi-chart-bar',
		route: '/leaderboard',
	},
])

const toggleTheme = () => {
	const theme = document.querySelector('html')
	theme.classList.toggle('p-dark')
	const icon = document.querySelector('.pi')
	icon.classList.toggle('pi-moon')
	icon.classList.toggle('pi-sun')
}

const {
	events,
	loadEventos,
	loading,
	participants,
	loadParticipantes,
	getLeaderboard,
} = useRace()

const selectEvento = ref(null)

const cargarParticipantes = async () => {
	if (selectEvento.value) {
		console.log(selectEvento.value)
		await loadParticipantes(selectEvento.value.identificador)
	}
}
const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString()
}

const formatTime = (timeString) => {
	return new Date(timeString).toLocaleTimeString()
}

const formatRaceTime = (participant) => {
	if (!participant.startTime) return '--:--'
	if (!participant.finishTime) return 'En curso'

	const start = new Date(participant.startTime)
	const finish = new Date(participant.finishTime)
	const diff = finish - start

	const minutes = Math.floor(diff / 60000)
	const seconds = ((diff % 60000) / 1000).toFixed(0)
	return `${minutes}:${seconds.padStart(2, '0')}`
}

const getParticipantStatus = (participant) => {
	if (!participant.startTime) return 'No iniciado'
	if (!participant.finishTime) return 'En curso'
	return 'Finalizado'
}

loadEventos()
</script>
