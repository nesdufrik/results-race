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
							@click="registerFinish"
							:loading="loading"
						/>
						<Message severity="success" v-if="lastRegistrered">
							<template #container>
								<div class="flex flex-col gap-4 p-2">
									<div class="font-semibold">
										<i class="pi pi-check"></i> <span>Último registro:</span>
									</div>
									<div class="flex flex-col gap-1">
										<span>Número: {{ lastRegistrered.number }}</span>
										<span>Nombre: {{ lastRegistrered.name }}</span>
										<span>Tiempo: {{ formatTime(lastRegistrered) }}</span>
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
														#{{ item.number }} {{ item.name }}
													</div>
												</div>
												<div
													class="bg-surface-100 p-1"
													style="border-radius: 30px"
												>
													{{ getCategoryName(item.categoryId) }}
												</div>
											</div>
											<div class="flex flex-col md:items-end gap-8">
												<span class="text-xl font-semibold">{{
													new Date(item.finishTime).toLocaleTimeString()
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
import { useRace } from '@/composables/useRace'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const route = useRoute()
const toast = useToast()
const confirm = useConfirm()
const eventoId = ref(route.params.id)

const {
	events,
	participants,
	getParticipants,
	updateParticipante,
	loading,
	updateEvento,
} = useRace()
const race = computed(() =>
	events.value.find((e) => e.identificador === eventoId.value)
)
const form = ref({ number: '' })
const lastRegistrered = ref(null)

const recentFinishes = computed(() => {
	return [...participants.value]
		.filter((p) => p.finishTime)
		.sort((a, b) => new Date(b.finishTime) - new Date(a.finishTime))
		.slice(0, 10)
})
const getCategoryName = (categoryId) => {
	const category = race.value?.categories.find((c) => c.id === categoryId)
	return category ? category.name : ''
}
const formatTime = (participant) => {
	if (!participant.startTime || !participant.finishTime) return '--:--'

	const start = new Date(participant.startTime)
	const finish = new Date(participant.finishTime)
	const diff = finish - start

	const minutes = Math.floor(diff / 60000)
	const seconds = ((diff % 60000) / 1000).toFixed(0)
	return `${minutes}:${seconds.padStart(2, '0')}`
}

const registerFinish = async () => {
	const participant = getParticipants.value.find(
		(p) => p.number === form.value.number
	)
	if (!participant) {
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: 'No se encontró un participante con ese número',
			life: 3000,
		})
		return
	}

	if (!participant.startTime) {
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: 'El participante no ha iniciado la carrera',
			life: 3000,
		})
		return
	}

	if (participant.finishTime) {
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: 'El participante ya ha finalizado la carrera',
			life: 3000,
		})
		return
	}

	participant.finishTime = new Date().toISOString()
	lastRegistrered.value = participant
	form.value.number = ''
	await updateParticipante(participant)
	participants.value.forEach((p) => {
		if (p.number === participant.number) {
			p.finishTime = participant.finishTime
		}
	})
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
</script>
