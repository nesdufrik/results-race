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
							@click="$router.push('/llegadas/' + eventoId)"
							class="w-80"
							severity="success"
							size="small"
						/>
					</div>
					<DataTable :value="participants">
						<Column field="race_number" header="Número"></Column>
						<Column field="full_name" header="Nombre"></Column>
						<Column field="team" header="Club"></Column>
						<Column field="categories.name" header="Categoria"></Column>
						<Column header="Estado"> </Column>
					</DataTable>
				</div>
			</template>
		</Card>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRace } from '@/composables/useRace'

const route = useRoute()
const eventoId = ref(route.params.idEvento)

const { participants, loadParticipantes } = useRace()

loadParticipantes(eventoId.value)
</script>
