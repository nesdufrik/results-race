<template>
	<div class="flex flex-col gap-4">
		<div class="flex flex-row gap-4">
			<h1 class="text-primary font-semibold text-2xl">
				Panel de Administración
			</h1>
			<Button
				severity="primary"
				icon="pi pi-plus"
				label="Crear evento"
				@click="onCreateEvent"
				size="small"
				outlined
				:disabled="true"
			/>
		</div>
		<Card v-for="evento in eventosWithGlobal" :key="evento.identificador">
			<template #title>
				<div class="flex justify-between">
					<div>{{ evento.name }}</div>
					<Tag
						:value="evento.status === 'pending' ? 'Pendiente' : evento.status"
						:severity="evento.status === 'pending' ? 'warn' : 'success'"
						class="text-xs"
					/>
				</div>
			</template>
			<template #content>
				<div class="mt-4 flex flex-col gap-5">
					<Button
						label="Iniciar seleccionados"
						icon="pi pi-clock"
						@click="startCategorySelection(evento.identificador)"
						class="w-80"
						:disabled="selectedEvents.length === 0"
						:loading="loading"
					/>
					<DataTable
						v-model:selection="selectedEvents"
						:value="
							Object.keys(evento.global).map((key, index) => ({
								name: key,
								startTime: evento.global[key][0].startTime,
								id: index + 1,
								ids: evento.global[key].map((item) => item.id),
							}))
						"
						dataKey="id"
					>
						<Column selectionMode="multiple" style="width: 3em" />
						<Column field="name" header="Nombre" />
						<Column header="Iniciado">
							<template #body="{ data }">
								{{ getTime(data.startTime) }}
							</template>
						</Column>
					</DataTable>
					<RouterLink
						:to="`evento/${evento.identificador}/participantes`"
						class="font-semibold text-base flex flex-row items-center gap-3 text-green-600"
					>
						<i class="pi pi-users"></i><span>Gestionar participantes</span>
					</RouterLink>
				</div>
			</template>
		</Card>
	</div>
</template>
<script setup>
import { computed, defineAsyncComponent, markRaw, onMounted, ref } from 'vue'
import { useRace } from '@/composables/useRace'
import { useDialog } from 'primevue/usedialog'

const EventoCreateForm = defineAsyncComponent(() =>
	import('@/components/Eventos/CreateForm.vue')
)
const EventoCreateFooter = defineAsyncComponent(() =>
	import('@/components/Eventos/CreateFooter.vue')
)

const { events, loadEventos, loading, updateEvento } = useRace()
const dialog = useDialog()
const selectedEvents = ref([])

const eventosWithGlobal = computed(() => {
	const eventos = events.value.map((evento) => {
		evento.global = Object.groupBy(evento.categories, (categorie) => {
			if (
				categorie.name.includes('Principiantes') &&
				categorie.name.includes('Damas')
			) {
				return 'Principiantes (Damas)'
			} else if (categorie.name.includes('Avanzadas')) {
				return 'Avanzadas (Damas)'
			} else if (
				categorie.name.includes('Elite') &&
				categorie.name.includes('Damas')
			) {
				return 'Elite (Damas)'
			} else if (
				categorie.name.includes('Principiantes') &&
				!categorie.name.includes('Damas')
			) {
				return 'Principiantes'
			} else if (categorie.name.includes('Promocionales')) {
				return 'Promocionales'
			} else if (categorie.name.includes('Avanzados')) {
				return 'Avanzados'
			} else if (
				categorie.name.includes('Elite') &&
				!categorie.name.includes('Damas')
			) {
				return 'Elite'
			} else {
				return 'Otras'
			}
		})
		return evento
	})
	return eventos
})

const onCreateEvent = () => {
	const dialogRef = dialog.open(EventoCreateForm, {
		props: {
			header: 'Crear evento',
			style: { width: '50vw' },
			breakpoints: { '960px': '75vw', '640px': '90vw' },
			modal: true,
		},
		templates: {
			footer: markRaw(EventoCreateFooter),
		},
	})
}

const startCategorySelection = (eventoId) => {
	const ids = selectedEvents.value.reduce((acc, item) => {
		return [...acc, ...item.ids]
	}, [])

	events.value
		.find((e) => e.identificador === eventoId)
		.categories.filter((c) => ids.includes(c.id))
		.forEach((c) => {
			c.startTime = new Date().toISOString()
		})

	updateEvento({
		id: eventoId,
		categories: events.value.find((e) => e.identificador === eventoId)
			.categories,
	})
}

const getTime = (time) => {
	if (!time) return '--:--'
	return new Date(time).toLocaleTimeString()
}

loadEventos()
</script>
