<script setup>
import { defineProps, defineAsyncComponent, markRaw, ref } from 'vue'
import { useRace } from '@/composables/useRace'
import { useDialog } from 'primevue/usedialog'
import { useConfirm } from 'primevue/useconfirm'

const StartGroupModalForm = defineAsyncComponent(() =>
	import('@/components/Groups/StartGroupModalForm.vue')
)
const StartGroupModalFooter = defineAsyncComponent(() =>
	import('@/components/Groups/StartGroupModalFooter.vue')
)
const CategorieModalForm = defineAsyncComponent(() =>
	import('@/components/Categories/CategorieModalForm.vue')
)
const CategorieModalFooter = defineAsyncComponent(() =>
	import('@/components/Categories/CategorieModalFooter.vue')
)

const props = defineProps({
	event: {
		type: Object,
		required: true,
	},
})

const {
	startGroups,
	categorie,
	loading,
	registerStart,
	deleteStartGroup,
	deleteCategorie,
	loadEvents,
} = useRace()
const dialog = useDialog()
const confirm = useConfirm()
const selectedGroups = ref([])

const onCreateStartGroup = (idEvent) => {
	startGroups.value.event_id = idEvent
	const dialogRef = dialog.open(StartGroupModalForm, {
		props: {
			header: 'Nuevo Grupo de Inicio',
			style: { width: '50vw' },
			breakpoints: { '960px': '75vw', '640px': '90vw' },
			modal: true,
		},
		templates: {
			footer: markRaw(StartGroupModalFooter),
		},
	})
}

const onDeleteStartGroup = (idEvent, idStartGroup) => {
	confirm.require({
		group: 'danger',
		header: 'Eliminar grupo',
		message: `¿Estás seguro de que deseas eliminar el grupo?`,
		icon: 'pi pi-exclamation-triangle',
		accept: () => {
			deleteStartGroup(idEvent, idStartGroup)
		},
		reject: () => {},
	})
}

const onCreateCategories = (idStartGroup) => {
	categorie.value.start_group_id = idStartGroup
	const dialogRef = dialog.open(CategorieModalForm, {
		props: {
			header: 'Nueva Categoria',
			style: { width: '50vw' },
			breakpoints: { '960px': '75vw', '640px': '90vw' },
			modal: true,
		},
		templates: {
			footer: markRaw(CategorieModalFooter),
		},
		data: {
			updateCategorie: false,
		},
	})
}

const onDeleteCategory = (idCategorie) => {
	confirm.require({
		group: 'danger',
		header: 'Eliminar categoria',
		message: `¿Estás seguro de que deseas eliminar la categoria?`,
		icon: 'pi pi-exclamation-triangle',
		accept: () => {
			deleteCategorie(idCategorie)
				.then(() => loadEvents())
				.catch((error) => console.error(error))
		},
		reject: () => {},
	})
}

const onEditCategory = (categorieEdit) => {
	categorie.value = categorieEdit
	const dialogRef = dialog.open(CategorieModalForm, {
		props: {
			header: 'Editar Categoria',
			style: { width: '50vw' },
			breakpoints: { '960px': '75vw', '640px': '90vw' },
			modal: true,
		},
		templates: {
			footer: markRaw(CategorieModalFooter),
		},
		data: {
			updateCategorie: true,
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

const expandedRows = ref([])
</script>
<template>
	<DataTable
		:value="event.start_groups"
		scrollable
		v-model:expandedRows="expandedRows"
		dataKey="id"
	>
		<template #empty>
			<div class="text-sm text-center italic p-4">
				<span> -- Aun no agrego ninguna categoria y sub-categoria -- </span>
			</div>
		</template>
		<template #header>
			<div
				class="flex flex-col gap-6 md:flex-row md:justify-between mb-3 md:mb-6"
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
				<ButtonGroup class="justify-end">
					<Button
						label="Iniciar Seleccionados"
						icon="pi pi-clock"
						@click="startCategorySelection(event.id)"
						:disabled="selectedGroups.length === 0"
						:loading="loading.registerStart"
						:severity="selectedGroups.length === 0 ? 'secondary' : 'primary'"
						size="small"
						:outlined="selectedGroups.length === 0"
					/>
					<Button
						label="Agregar Grupo"
						icon="pi pi-plus"
						severity="secondary"
						size="small"
						@click="onCreateStartGroup(event.id)"
					/>
				</ButtonGroup>
			</div>
		</template>
		<Column expander />
		<Column header="&nbsp">
			<template #body="{ data }">
				<Checkbox
					:input-id="`cb-${data.id}`"
					:value="data.id"
					v-model="selectedGroups"
					:disabled="data.start_time !== null"
				/>
			</template>
		</Column>
		<Column field="name" header="Grupo" style="min-width: 195px" />
		<Column header="Inicio" style="min-width: 125px">
			<template #body="{ data }">
				{{ getTime(data.start_time) }}
			</template>
		</Column>
		<Column
			header="&nbsp"
			style="min-width: 100px; justify-items: center; text-align: center"
		>
			<template #body="{ data }">
				<ButtonGroup>
					<Button
						label="Categorias"
						icon="pi pi-plus"
						severity="secondary"
						size="small"
						@click="onCreateCategories(data.id)"
					/>
					<Button
						icon="pi pi-trash"
						severity="danger"
						size="small"
						@click="onDeleteStartGroup(event.id, data.id)"
					/>
				</ButtonGroup>
			</template>
		</Column>
		<template #expansion="{ data }">
			<div class="p-1">
				<DataTable :value="data.categories" size="small" class="text-sm">
					<template #empty>
						<div class="italic text-xs text-center">
							-- Aun no hay categorias --
						</div>
					</template>
					<Column field="name" header="Categoria" />
					<Column field="min_age" header="Edad Minima" />
					<Column field="max_age" header="Edad Maxima" />
					<Column field="gender" header="Genero" />
					<Column header="&nbsp">
						<template #body="{ data }">
							<ButtonGroup>
								<Button
									label="Editar"
									icon="pi pi-pencil"
									severity="secondary"
									size="small"
									@click="onEditCategory(data)"
									text
								/>
								<Button
									icon="pi pi-trash"
									severity="danger"
									size="small"
									@click="onDeleteCategory(data.id)"
									text
								/>
							</ButtonGroup>
						</template>
					</Column>
				</DataTable>
			</div>
		</template>
	</DataTable>
</template>
