<script setup>
import { inject, ref, onMounted } from 'vue'
import { useRace } from '@/composables/useRace'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'

const { loadParticipants, verifyPayment } = useRace()
const dialogRef = inject('dialogRef')
const toast = useToast()
const route = useRoute()
const { supabase } = useSupabase()

const participantId = dialogRef.value.data.participantId
const participantName = dialogRef.value.data.participantName
const participantReceipt = dialogRef.value.data.participantReceipt
const signedReceiptUrl = ref(null)

const onClose = () => {
	dialogRef.value.close()
}

const onSubmit = () => {
	verifyPayment(participantId)
		.then(() => {
			toast.add({
				severity: 'success',
				summary: 'Asignado',
				detail: 'Pago verificado correctamente',
				life: 3000,
			})
		})
		.catch((error) => {
			console.error('Error al asignar número', error)
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: error.message,
				life: 3000,
			})
		})
		.finally(() => {
			dialogRef.value.close()
			loadParticipants(route.params.idEvent)
		})
}

function extractFilePath(fullUrl) {
	const match = fullUrl.match(/\/receipts\/(.*)$/)
	return match ? match[1] : null
}

async function getReceiptUrl(receiptPath) {
	const bucketName = 'receipts'
	const oneHour = 60 * 60 // Duración de la URL firmada en segundos (ejemplo: 1 hora)

	try {
		const { data, error } = await supabase.storage
			.from(bucketName)
			.createSignedUrl(receiptPath, oneHour)

		if (error) {
			throw error
		}

		return data.signedUrl
	} catch (error) {
		console.error('Error al generar la URL firmada:', error.message)
		return null
	}
}

async function loadSignedUrl() {
	const filePath = extractFilePath(participantReceipt)
	if (filePath) {
		signedReceiptUrl.value = await getReceiptUrl(filePath)
	}
}

onMounted(() => {
	loadSignedUrl()
})
</script>
<template>
	<div class="flex flex-col gap-4 text-center p-4 items-center">
		<h3>Verificar Pago</h3>
		<p class="font-bold italic text-lg">{{ participantName }}</p>
		<Image :src="signedReceiptUrl" alt="Image" width="250" preview />
		<div class="flex flex-row gap-4 justify-center">
			<Button
				label="Cancelar"
				@click="onClose"
				icon="pi pi-times"
				text
				severity="danger"
			/>
			<Button
				label="Verificar Pago"
				@click="onSubmit"
				icon="pi pi-check"
				text
				severity="success"
			/>
		</div>
	</div>
</template>
