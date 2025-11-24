<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useRace } from '@/composables/useRace'
import { useSupabase } from '@/composables/useSupabase'

const route = useRoute()
const toast = useToast()
const confirm = useConfirm()
const eventId = ref(route.params.idEvent)
const { supabase } = useSupabase()

const {
	loading,
	participants,
	event,
	loadEvent,
	registerFinish,
	loadParticipants,
} = useRace()

onMounted(() => {
	loadEvent(eventId.value)
	loadParticipants(eventId.value)
	fetchLiveRanking()
})

const form = ref({ number: '' })
const lastRegistrered = ref(null)

const recentFinishes = ref([])

const actionRegisterFinish = async () => {
	const participantFinish = participants.value.find(
		(p) => p.race_number === form.value.number
	)
	try {
		if (!participantFinish) {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: 'No se ha encontrado el participante',
				life: 3000,
			})
			return
		}

		await registerFinish(participantFinish.race_number, eventId.value)

		lastRegistrered.value = participantFinish

		toast.add({
			severity: 'success',
			summary: 'Registro exitoso',
			detail: 'Se ha registrado la llegada del participante',
			life: 3000,
		})
	} catch (error) {
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: error.message,
			life: 3000,
		})
	} finally {
		form.value.number = ''
	}
}

const finishRace = async () => {
	confirm.require({
		message: '¿Estás seguro de finalizar la carrera?',
		header: 'Finalizar carrera',
		icon: 'pi pi-exclamation-triangle',
		accept: async () => {
			await updateEvento({ id: eventId.value, status: 'finished' })
			toast.add({
				severity: 'success',
				summary: 'Carrera finalizada',
				detail: 'La carrera ha sido finalizada exitosamente',
				life: 3000,
			})
		},
		reject: () => {
			toast.add({
				severity: 'info',
				summary: 'Operación cancelada',
				detail: 'La carrera no ha sido finalizada',
				life: 3000,
			})
		},
	})
}

const tagStatus = [
	{
		label: 'Pendiente',
		severity: 'info',
		icon: 'pi pi-clock',
		status: 'pending',
	},
	{
		label: 'En Proceso',
		severity: 'warning',
		icon: 'pi pi-spinner',
		status: 'in_progress',
	},
	{
		label: 'Completado',
		severity: 'success',
		icon: 'pi pi-check',
		status: 'completed',
	},
]

const getStatusTag = (status) => {
	return tagStatus.find((tag) => tag.status === status) || tagStatus[0]
}

const fetchLiveRanking = async () => {
	console.log('Actualizando ranking...')
	const { data, error } = await supabase
		.from('live_ranking')
		.select('*')
		.eq('event_id', eventId.value)
		.eq('status', 'finished')
		.order('finish_time', { ascending: false, nullsFirst: false })
		.limit(5)
	if (error) {
		console.error('Error al obtener el ranking:', error)
	} else {
		console.log('Ranking actualizado:', data)
		recentFinishes.value = data
	}
}

const channel = supabase
	.channel('public-race-results')
	.on(
		'postgres_changes',
		{
			event: '*',
			schema: 'public',
			table: 'race_results',
		},
		(payload) => {
			console.log('¡Nuevo resultado detectado!', payload)

			fetchLiveRanking()
		}
	)
	.subscribe()
</script>
<template>
	<div>
		<div class="flex flex-col md:flex-row md:items-center justify-between">
			<h1 class="text-2xl font-bold text-primary">Registrar Llegadas</h1>
			<RouterLink
				:to="`/leaderboard/${eventId}`"
				class="font-semibold text-base p-4 md:p-2 flex flex-row items-center justify-center gap-2 text-primary mt-3 hover:text-primary-300 hover:bg-primary-900/90 rounded-md border border-primary-300/50 w-full md:w-auto"
			>
				<i class="pi pi-trophy"></i><span>Ver tabla de posiciones</span>
			</RouterLink>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-9">
			<Card class="border border-primary">
				<template #title>
					<div
						class="flex flex-col px-4 md:items-center md:flex-row md:justify-between gap-4 md:gap-0"
					>
						<div class="flex flex-row gap-3 md:flex-col md:gap-0">
							<span class="text-lg font-semibold text-primary">
								{{ event.name }}
							</span>
							<Tag
								:severity="getStatusTag(event.status).severity"
								:icon="getStatusTag(event.status).icon"
								:value="getStatusTag(event.status).label"
								rounded
							></Tag>
						</div>
						<Button
							severity="danger"
							label="Finalizar"
							@click="finishRace"
							icon="pi pi-check"
							size="small"
						/>
					</div>
				</template>
				<template #content>
					<div class="flex flex-col gap-4 mt-9 px-4">
						<div class="flex flex-col gap-1">
							<label for="number">Nro de dorsal</label>
							<InputNumber
								v-model="form.number"
								inputId="number"
								:useGrouping="false"
								fluid
							/>
						</div>
						<Button
							label="Registrar llegada"
							@click="actionRegisterFinish"
							:loading="loading.registerFinish"
							size="large"
							fluid
						/>
						<Message severity="success" v-if="lastRegistrered">
							<template #container>
								<div class="flex flex-col gap-4 p-2">
									<div class="font-semibold">
										<i class="pi pi-check"></i> <span>Último registro:</span>
									</div>
									<div class="flex flex-col gap-1">
										<span>Número: {{ lastRegistrered.race_number }}</span>
										<span>Nombre: {{ lastRegistrered.full_name }}</span>
									</div>
								</div>
							</template>
						</Message>
					</div>
				</template>
			</Card>
			<Card class="border border-primary">
				<template #title
					><div
						class="flex flex-col px-4 md:items-center md:flex-row md:justify-between gap-4 md:gap-0"
					>
						<span class="text-lg font-semibold text-primary"
							>Últimas llegadas</span
						>
					</div>
				</template>
				<template #content>
					<div>
						<DataView :value="recentFinishes">
							<template #list="slotProps">
								<div class="flex flex-col">
									<div v-for="(item, index) in slotProps.items" :key="index">
										<div
											class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
											:class="{
												'border-t border-surface-200 dark:border-surface-700':
													index !== 0,
											}"
										>
											<div
												class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6"
											>
												<div class="flex flex-col gap-2 w-full">
													<div>
														<div class="flex gap-2 items-center">
															<span
																class="font-bold text-2xl flex items-center gap-1"
																><i class="pi pi-check-circle"></i>
																{{ item.race_number }}</span
															>
															<span>{{ item.full_name }}</span>
														</div>
													</div>
													<Message severity="info">
														<span class="text-sm">{{
															`${item.start_group_name} (${item.category_name})`
														}}</span>
													</Message>
												</div>
												<div class="flex flex-row items-center gap-1">
													<i class="pi pi-clock"></i>
													<span class="text-base font-semibold">{{
														item.total_time_interval.split('.')[0]
													}}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</template>
						</DataView>
					</div>
				</template>
			</Card>
		</div>
	</div>
</template>
