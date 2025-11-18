<script setup>
import { defineAsyncComponent, markRaw, ref } from 'vue'
import { useRace } from '@/composables/useRace'
import { useDialog } from 'primevue/usedialog'

const EventCreateForm = defineAsyncComponent(() =>
	import('@/components/Events/CreateForm.vue')
)
const EventCreateFooter = defineAsyncComponent(() =>
	import('@/components/Events/CreateFooter.vue')
)

const { events, loading, loadEvents, registerStart } = useRace()
const dialog = useDialog()
const selectedGroups = ref([])

const onCreateEvent = () => {
	const dialogRef = dialog.open(EventCreateForm, {
		props: {
			header: 'Crear evento',
			style: { width: '50vw' },
			breakpoints: { '960px': '75vw', '640px': '90vw' },
			modal: true,
		},
		templates: {
			footer: markRaw(EventCreateFooter),
		},
	})
}

const startCategorySelection = (eventoId) => {
	const ids = selectedGroups.value
	registerStart({
		event_id: eventoId,
		start_groups: ids,
	})
		.then(() => {
			selectedGroups.value = []
			loadEvents()
		})
		.catch((error) => {
			console.error('Error starting category selection:', error)
		})
}

const getTime = (time) => {
	if (!time) return '--:--'
	return new Date(time).toLocaleTimeString()
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
					<DataTable :value="event.start_groups">
						<template #header>
							<div class="flex justify-between items-center mb-6">
								<div class="flex items-center gap-1">
									<span class="text-lg font-semibold text-primary">
										{{ event.name }}
									</span>
									<Button
										icon="pi pi-trash"
										severity="danger"
										rounded
										text
										size="small"
									/>
								</div>
								<Button
									label="Iniciar Seleccionados"
									icon="pi pi-clock"
									@click="startCategorySelection(event.id)"
									class="w-80"
									:disabled="selectedGroups.length === 0"
									:loading="loading"
									:severity="
										selectedGroups.length === 0 ? 'secondary' : 'primary'
									"
									size="small"
									:outlined="selectedGroups.length === 0"
								/>
							</div>
						</template>
						<Column field="name" header="Nombre" />
						<Column header="Iniciado">
							<template #body="{ data }">
								{{ getTime(data.start_time) }}
							</template>
						</Column>
						<Column header="Seleccionar" class="flex justify-center">
							<template #body="{ data }">
								<Checkbox
									:input-id="`cb-${data.id}`"
									:value="data.id"
									v-model="selectedGroups"
									:disabled="data.start_time !== null"
								/>
							</template>
						</Column>
					</DataTable>
				</template>
				<template #footer>
					<RouterLink
						:to="`participants/${event.id}`"
						class="font-semibold text-base flex flex-row items-center justify-center gap-2 text-primary mt-3 hover:text-primary-300 hover:bg-primary-900/90 rounded-md p-2 border border-primary-300/50"
					>
						<i class="pi pi-users"></i><span>Gestionar participantes</span>
					</RouterLink>
				</template>
			</Card>
		</div>
	</div>
</template>
