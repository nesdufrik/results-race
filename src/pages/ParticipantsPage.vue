<script setup>
import { onMounted, defineAsyncComponent, markRaw, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRace } from '@/composables/useRace'
import { useDialog } from 'primevue/usedialog'
import { useConfirm } from 'primevue/useconfirm'

const ParticipantModalForm = defineAsyncComponent(() =>
	import('@/components/Participants/ParticipantModalForm.vue')
)
const ParticipantModalFooter = defineAsyncComponent(() =>
	import('@/components/Participants/ParticipantModalFooter.vue')
)
const ParticipantNumberModal = defineAsyncComponent(() =>
	import('@/components/Participants/ParticipantNumberModal.vue')
)

const route = useRoute()
const eventId = ref(route.params.idEvent)

const {
	event,
	participants,
	participant,
	loadEvent,
	loadParticipants,
	loadCategories,
	deleteParticipant,
} = useRace()
const dialog = useDialog()
const confirm = useConfirm()

onMounted(async () => {
	await loadEvent(eventId.value)
	await loadParticipants(eventId.value)
	await loadCategories(eventId.value)
})

const onCreateParticipant = () => {
	participant.value = {
		event_id: eventId.value,
	}
	const dialogRef = dialog.open(ParticipantModalForm, {
		props: {
			header: 'Nuevo Participante',
			style: { width: '50vw' },
			breakpoints: { '960px': '75vw', '640px': '90vw' },
			modal: true,
		},
		templates: {
			footer: markRaw(ParticipantModalFooter),
		},
		data: {
			updateParticipant: false,
		},
	})
}

const onEditParticipant = (participantId) => {
	const foundParticipant = participants.value.find(
		(p) => p.id === participantId
	)
	participant.value = { ...foundParticipant }

	if (
		participant.value.birth_date &&
		typeof participant.value.birth_date === 'string'
	) {
		const [year, month, day] = participant.value.birth_date
			.split('-')
			.map(Number)
		participant.value.birth_date = new Date(year, month - 1, day)
	}

	const dialogRef = dialog.open(ParticipantModalForm, {
		props: {
			header: 'Editar Participante',
			style: { width: '50vw' },
			breakpoints: { '960px': '75vw', '640px': '90vw' },
			modal: true,
		},
		templates: {
			footer: markRaw(ParticipantModalFooter),
		},
		data: {
			updateParticipant: true,
		},
	})
}

const onDeleteParticipant = (participantId) => {
	confirm.require({
		group: 'danger',
		header: 'Eliminar Participante',
		message: '¿Estás seguro de eliminar este participante?',
		icon: 'pi pi-exclamation-triangle',
		accept: () => {
			deleteParticipant(participantId)
				.then(() => {
					loadParticipants(eventId.value)
				})
				.catch((error) => console.error(error))
		},
		reject: () => {},
	})
}

const onAssignParticipantNumber = (participantId) => {
	const dialogRef = dialog.open(ParticipantNumberModal, {
		props: {
			header: 'Asignar Número',
			style: { width: '50vw' },
			breakpoints: { '960px': '75vw', '640px': '90vw' },
			modal: true,
		},
		data: {
			participantId,
			participantName: participants.value.find((p) => p.id === participantId)
				.full_name,
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
</script>
<template>
	<div>
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold text-primary">Gestionar Participantes</h1>
			<Button
				severity="secondary"
				icon="pi pi-plus"
				label="Agregar participante"
				@click="onCreateParticipant"
				size="small"
			/>
		</div>
		<div class="flex flex-col gap-4 mt-9">
			<Card class="border border-primary">
				<template #content>
					<div class="mt-4 flex flex-col gap-5">
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
							<RouterLink
								:to="`/arrivals/${eventId}`"
								class="font-semibold text-base p-4 md:p-2 md:w-80 flex flex-row items-center justify-center gap-2 text-primary mt-3 hover:text-primary-300 hover:bg-primary-900/90 rounded-md border border-primary-300/50"
							>
								<i class="pi pi-clock"></i><span>Registrar Llegadas</span>
							</RouterLink>
						</div>
						<DataTable :value="participants" class="text-sm">
							<template #empty>
								<div class="text-sm text-center italic p-4">
									<span>
										-- Aun no agrego ningun participante al evento --
									</span>
								</div>
							</template>
							<Column field="race_number" header="#"></Column>
							<Column
								field="full_name"
								header="Nombre"
								style="min-width: 16rem"
							></Column>
							<Column field="team" header="Club"></Column>
							<Column>
								<template #header>
									<div class="text-center font-semibold w-full">
										<span>Categoria</span>
									</div>
								</template>
								<template #body="{ data }">
									<div class="flex flex-col text-center">
										<span>{{ data.categories.start_groups.name }}</span>
										<span>{{ data.categories.name }}</span>
									</div>
								</template>
							</Column>
							<Column header="&nbsp;" style="min-width: 12rem">
								<template #body="{ data }">
									<div class="flex flex-col gap-2">
										<Button
											v-if="!data.race_number"
											label="Asignar Número"
											icon="pi pi-calendar"
											size="small"
											severity="primary"
											@click="onAssignParticipantNumber(data.id)"
										/>
										<ButtonGroup>
											<Button
												label="Editar"
												icon="pi pi-pencil"
												size="small"
												severity="secondary"
												@click="onEditParticipant(data.id)"
												class="w-full"
											/>
											<Button
												icon="pi pi-trash"
												size="small"
												severity="danger"
												@click="onDeleteParticipant(data.id)"
											/>
										</ButtonGroup>
									</div>
								</template>
							</Column>
						</DataTable>
					</div>
				</template>
			</Card>
		</div>
	</div>
</template>
