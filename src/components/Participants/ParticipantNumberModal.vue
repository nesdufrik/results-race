<script setup>
import { inject, ref } from 'vue'
import { useRace } from '@/composables/useRace'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router'

const { assignParticipantNumber, loadParticipants } = useRace()
const dialogRef = inject('dialogRef')
const toast = useToast()
const route = useRoute()

const participantId = dialogRef.value.data.participantId
const participantName = dialogRef.value.data.participantName

const participantNumber = ref('')

const onSubmit = () => {
	assignParticipantNumber(participantId, participantNumber.value)
		.then(() => {
			toast.add({
				severity: 'success',
				summary: 'Asignado',
				detail: 'Número asignado correctamente',
				life: 3000,
			})
		})
		.catch((error) => {
			console.error('Error al asignar número', error)
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: 'Error al asignar número',
				life: 3000,
			})
		})
		.finally(() => {
			dialogRef.value.close()
			loadParticipants(route.params.idEvent)
		})
}
</script>
<template>
	<div class="flex flex-col gap-4 text-center p-4">
		<h3>Se asignara el numero a:</h3>
		<p class="font-bold italic text-lg">{{ participantName }}</p>
		<InputNumber
			v-model="participantNumber"
			inputId="withoutgrouping"
			:useGrouping="false"
			fluid
			showButtons
			buttonLayout="horizontal"
		>
			<template #incrementicon>
				<span class="pi pi-plus" />
			</template>
			<template #decrementicon>
				<span class="pi pi-minus" />
			</template>
		</InputNumber>
		<Button
			label="Asignar número"
			@click="onSubmit"
			icon="pi pi-check"
			text
			severity="success"
		/>
	</div>
</template>
