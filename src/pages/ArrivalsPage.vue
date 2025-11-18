<template>
	<div class="flex flex-col gap-4">
		<div class="flex flex-row gap-4 justify-between">
			<h1 class="text-primary font-semibold text-2xl">
				Registrar Llegadas - {{ race?.name }}
			</h1>
			<div class="flex gap-1">
				<Tag
					:value="race?.status === 'pending' ? 'En curso' : 'Finalizada'"
					:severity="race?.status === 'pending' ? 'warn' : 'success'"
					class="text-xs"
				/>
				<Button
					severity="danger"
					label="Finalizar"
					@click="finishRace"
					size="small"
				/>
			</div>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
			<Card>
				<template #title>Registro de llegada</template>
				<template #content>
					<div class="flex flex-col gap-4">
						<div class="flex flex-col gap-1">
							<label for="number">Número de participante</label>
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
							:loading="loading"
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
			<Card>
				<template #title>Últimas llegadas</template>
				<template #content>
					<DataView :value="recentFinishes">
						<template #header>Datos de las últimas llegadas</template>
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
											<div
												class="flex flex-row md:flex-col justify-between items-start gap-2"
											>
												<div>
													<div class="text-lg font-medium mt-2">
														#{{ item.race_number }} {{ item.full_name }}
													</div>
												</div>
												<div
													class="bg-surface-100 p-1"
													style="border-radius: 30px"
												>
													{{ item.category_name }}
												</div>
											</div>
											<div class="flex flex-col md:items-end gap-8">
												<span class="text-xl font-semibold">{{
													item.total_time_interval
														? item.total_time_interval
														: '--:--'
												}}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</template>
					</DataView>
				</template>
			</Card>
		</div>
	</div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useRace } from '@/composables/useRace'
import { useSupabase } from '@/composables/useSupabase'

const { supabase } = useSupabase()
const route = useRoute()
const toast = useToast()
const confirm = useConfirm()
const eventoId = ref(route.params.idEvento)

const { events, participants, registerFinish, loading, updateEvento } =
	useRace()
const race = computed(() => events.value.find((e) => e.id === eventoId.value))
const form = ref({ number: '' })
const lastRegistrered = ref(null)

const recentFinishes = ref([])

const actionRegisterFinish = async () => {
	const participant = participants.value.find(
		(p) => p.race_number === form.value.number
	)

	lastRegistrered.value = participant
	form.value.number = ''
	await registerFinish(participant.race_number, eventoId.value)

	toast.add({
		severity: 'success',
		summary: 'Registro exitoso',
		detail: 'Se ha registrado la llegada del participante',
		life: 3000,
	})
}

const finishRace = async () => {
	confirm.require({
		message: '¿Estás seguro de finalizar la carrera?',
		header: 'Finalizar carrera',
		icon: 'pi pi-exclamation-triangle',
		accept: async () => {
			await updateEvento({ id: eventoId.value, status: 'finished' })
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

async function fetchLiveRanking() {
	const { data, error } = await supabase
		.from('live_ranking') // Consultamos la VISTA
		.select('*')
		.eq('event_id', eventoId.value) // Filtramos por el evento actual
		.order('position_in_category', { ascending: true, nullsFirst: false }) // Ordenamos

	if (error) {
		console.error('Error cargando el ranking:', error)
	} else {
		recentFinishes.value = data.slice(-5).reverse()
	}
}

const channel = supabase
	.channel('public-race-results')
	.on(
		'postgres_changes',
		{
			event: '*', // Escucha INSERT, UPDATE, DELETE
			schema: 'public',
			table: 'race_results', // Escucha cambios en la TABLA de resultados
		},
		(payload) => {
			// Cuando hay un cambio en los resultados,
			// volvemos a pedir el ranking ya calculado desde la VISTA.
			fetchLiveRanking()
		}
	)
	.subscribe()

fetchLiveRanking()
</script>
