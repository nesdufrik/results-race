<script setup>
import { useSupabase } from '@/composables/useSupabase'
import { FilterMatchMode } from '@primevue/core/api'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRace } from '@/composables/useRace'

const { supabase } = useSupabase()
const { loadEvent, event } = useRace()
const route = useRoute()
const currentEventId = ref(route.params.idEvent)
const liveRanking = ref([])

const selectedStartGroup = ref(null)
const categories = computed(() => {
	// De selectedStartGroup.categories solo quiero que me devuelva un array de name
	const result = selectedStartGroup.value?.categories.map(
		(category) => category.name
	)
	console.log('Categories:', result)
	return result
})

const fetchLiveRanking = async () => {
	console.log('Actualizando ranking...')
	const { data, error } = await supabase
		.from('live_ranking')
		.select('*')
		.eq('event_id', currentEventId.value)
		.neq('status', null)
		.order('position_in_category', { ascending: true, nullsFirst: false })
	if (error) {
		console.error('Error al obtener el ranking:', error)
	} else {
		console.log('Ranking actualizado:', data)
		liveRanking.value = data
	}
}
const initFilters = () => {
	filters.value = {
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		full_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
		start_group_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
		category_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
	}
}
const filters = ref({
	global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	full_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
	start_group_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
	category_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const clearFilter = () => {
	selectedStartGroup.value = null
	initFilters()
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

onMounted(() => {
	loadEvent(currentEventId.value)
	fetchLiveRanking()
})
</script>
<template>
	<div>
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold text-primary">Clasificación en Vivo</h1>
		</div>
		<div class="flex flex-col gap-4 mt-9">
			<Card class="border border-primary">
				<template #title>
					<div class="flex items-center gap-2 text-primary mb-4">
						<span class="relative flex h-2 w-2">
							<span
								class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
							></span>
							<span
								class="relative inline-flex rounded-full h-2 w-2 bg-primary"
							></span>
						</span>
						<p class="text-sm font-bold">EN VIVO</p>
					</div>
				</template>
				<template #content>
					<DataTable
						v-model:filters="filters"
						:value="liveRanking"
						dataKey="id"
						filterDisplay="menu"
						class="text-sm"
						size="small"
						:globalFilterFields="[
							'full_name',
							'start_group_name',
							'category_name',
						]"
					>
						<template #header>
							<div class="flex flex-col md:flex-row gap-2 mb-4">
								<IconField>
									<InputIcon class="pi pi-search" />
									<InputText
										v-model="filters['global'].value"
										placeholder="Buscar por palabra clave"
										fluid
									/>
								</IconField>
								<Select
									v-model="selectedStartGroup"
									:options="event.start_groups"
									optionLabel="name"
									placeholder="Seleccionar grupo"
								/>
								<Select
									v-model="filters['category_name'].value"
									:options="categories"
									placeholder="Seleccionar categoría"
								/>
								<Button
									type="button"
									icon="pi pi-filter-slash"
									label="Limpiar"
									variant="outlined"
									@click="clearFilter()"
								/>
							</div>
						</template>
						<template #empty> Aun no hay resultados. </template>
						<Column field="race_number" header="Nro">
							<template #body="{ data }">
								{{ data.race_number }}
							</template>
						</Column>
						<Column
							field="full_name"
							header="Nombre completo"
							style="min-width: 14rem"
						>
							<template #body="{ data }">
								{{ data.full_name }}
							</template>
							<template #filter="{ filterModel, filterCallback }">
								<InputText
									v-model="filterModel.value"
									type="text"
									@input="filterCallback()"
									placeholder="Search by full name"
								/>
							</template>
						</Column>
						<Column field="team" header="Equipo" style="min-width: 10rem">
							<template #body="{ data }">
								{{ data.team }}
							</template>
						</Column>
						<Column field="category_name" header="Categoría">
							<template #body="{ data }">
								<div class="flex flex-col xl:flex-row xl:gap-1">
									<span>{{ data.start_group_name }}</span>
									<span>{{ data.category_name }}</span>
								</div>
							</template>
							<template #filter="{ filterModel, filterCallback }">
								<InputText
									v-model="filterModel.value"
									type="text"
									@input="filterCallback()"
									placeholder="Search by category name"
								/>
							</template>
						</Column>
						<Column field="start_time" header="Inicio">
							<template #body="{ data }">
								{{
									new Date(data.start_time).toLocaleTimeString('es-ES', {
										hour12: false,
									})
								}}
							</template>
						</Column>
						<Column field="finish_time" header="Finalización">
							<template #body="{ data }">
								{{
									new Date(data.finish_time).toLocaleTimeString('es-ES', {
										hour12: false,
									})
								}}
							</template>
						</Column>
						<Column field="total_time_interval" header="Total">
							<template #body="{ data }">
								{{
									data.total_time_interval
										? data.total_time_interval.split('.')[0]
										: ''
								}}
							</template>
						</Column>
						<Column field="position_in_category" header="Categoría">
							<template #body="{ data }">
								{{ data.position_in_category }}
								<i
									:class="`${
										data.position_in_category === 1 ||
										data.position_in_category === 2 ||
										data.position_in_category === 3
											? 'pi pi-trophy'
											: ''
									}
						
						${
							data.position_in_category === 1
								? ' text-yellow-500 font-bold'
								: data.position_in_category === 2
								? ' text-gray-500'
								: data.position_in_category === 3
								? ' text-amber-800'
								: ''
						}`"
								></i>
							</template>
						</Column>
						<Column field="position_overall" header="General">
							<template #body="{ data }">
								{{ data.position_overall }}
								<i
									:class="`${
										data.position_overall === 1 ||
										data.position_overall === 2 ||
										data.position_overall === 3
											? 'pi pi-crown'
											: ''
									}
						
						${
							data.position_overall === 1
								? ' text-yellow-500 font-bold'
								: data.position_overall === 2
								? ' text-gray-500'
								: data.position_overall === 3
								? ' text-amber-800'
								: ''
						}`"
								></i>
							</template>
						</Column>
					</DataTable>
				</template>
			</Card>
		</div>
	</div>
</template>
