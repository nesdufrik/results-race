<template>
	<div class="flex flex-col gap-4">
		<div class="flex flex-row gap-4">
			<h1 class="text-primary font-semibold text-2xl">
				Gestionar Participantes
			</h1>
			<Button
				severity="primary"
				icon="pi pi-plus"
				label="Registrar participante"
				@click=""
				size="small"
				outlined
				:disabled="true"
			/>
		</div>
		<Card>
			<template #content>
				<div class="mt-4 flex flex-col gap-5">
					<div class="flex justify-between">
						<div></div>
						<Button
							label="Registrar Llegadas"
							@click="$router.push('finish')"
							class="w-80"
							severity="success"
							size="small"
						/>
					</div>
					<DataTable :value="participants">
						<Column field="number" header="Número"></Column>
						<Column field="name" header="Nombre"></Column>
						<Column field="team" header="Club"></Column>
						<Column header="Categoria">
							<template #body="{ data }">
								{{ getCategoryName(data.categoryId) }}
							</template>
						</Column>
						<Column header="Estado">
							<template #body="{ data }">
								<Tag
									class="text-xs"
									:value="getParticipantStatus(data)"
									:severity="getSeverityStatus(data)"
								/>
							</template>
						</Column>
					</DataTable>
				</div>
			</template>
		</Card>
	</div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRace } from '@/composables/useRace'

const route = useRoute()
const eventoId = ref(route.params.id)

const { events, participants, loadParticipantes, loading } = useRace()

const race = computed(() =>
	events.value.find((e) => e.identificador === eventoId.value)
)
const getCategoryName = (categoryId) => {
	const category = race.value.categories.find((c) => c.id === categoryId)
	return category ? category.name : ''
}
const getParticipantStatus = (participant) => {
	if (!participant.startTime) return 'No iniciado'
	if (!participant.finishTime) return 'En carrera'
	return 'Finalizado'
}
const getSeverityStatus = (participant) => {
	if (!participant.startTime) return 'warn'
	if (!participant.finishTime) return 'info'
	return 'success'
}
loadParticipantes(eventoId.value)
</script>
