<script setup>
import { defineAsyncComponent, markRaw, ref } from 'vue'
import { useRace } from '@/composables/useRace'
import { useDialog } from 'primevue/usedialog'
import { useConfirm } from 'primevue/useconfirm'
import EventDataTable from '@/components/Events/EventDataTable.vue'

const EventModalForm = defineAsyncComponent(() =>
	import('@/components/Events/EventModalForm.vue')
)
const EventModalFooter = defineAsyncComponent(() =>
	import('@/components/Events/EventModalFooter.vue')
)

const { events, loading, loadEvents, deleteEvent } = useRace()
const dialog = useDialog()
const confirm = useConfirm()

const onCreateEvent = () => {
	const dialogRef = dialog.open(EventModalForm, {
		props: {
			header: 'Nuevo Evento',
			style: { width: '50vw' },
			breakpoints: { '960px': '75vw', '640px': '90vw' },
			modal: true,
		},
		templates: {
			footer: markRaw(EventModalFooter),
		},
	})
}

const onDeleteEvent = (idEvent, nameEvent) => {
	confirm.require({
		group: 'danger',
		header: 'Eliminar evento',
		message: `¿Estás seguro de que deseas eliminar el evento ${nameEvent}?`,
		icon: 'pi pi-exclamation-triangle',
		accept: () => {
			deleteEvent(idEvent)
		},
		reject: () => {},
	})
}

loadEvents()
</script>
<template>
	<div>
		<div class="flex items-center justify-between">
			<span class="text-2xl font-bold text-primary">Eventos Disponibles </span>
			<Button
				severity="secondary"
				icon="pi pi-plus"
				label="Crear evento"
				@click="onCreateEvent"
				size="small"
			/>
		</div>
		<div class="flex flex-col gap-4 mt-9">
			<Card
				v-for="event in events"
				:key="event.id"
				class="border border-primary mb-4"
			>
				<template #content>
					<EventDataTable :event="event"></EventDataTable>
				</template>
				<template #footer>
					<div
						class="flex flex-col md:items-center md:flex-row md:justify-between gap-4 md:gap-0"
					>
						<RouterLink
							:to="`participants/${event.id}`"
							class="font-semibold text-base p-4 md:p-2 flex flex-row items-center justify-center gap-2 text-primary mt-3 hover:text-primary-300 hover:bg-primary-900/90 rounded-md border border-primary-300/50"
						>
							<i class="pi pi-users"></i><span>Gestionar participantes</span>
						</RouterLink>
						<Button
							label="Eliminar evento"
							icon="pi pi-trash"
							severity="danger"
							rounded
							text
							size="small"
							@click="onDeleteEvent(event.id, event.name)"
							:loading="loading.deleteEvent"
							:disabled="event.status !== 'pending'"
						/>
					</div>
				</template>
			</Card>
		</div>
	</div>
</template>
