<script setup>
import { inject } from 'vue'
import { useRace } from '@/composables/useRace'

const { loading } = useRace()
const dialogRef = inject('dialogRef')

const onCancel = () => dialogRef.value.close()
</script>
<template>
	<div class="flex gap-2">
		<Button label="Cancelar" @click="onCancel" severity="secondary" text />
		<Button
			label="Guardar"
			type="submit"
			form="form-start-group"
			severity="primary"
			:loading="loading.registerNewStartGroup"
		/>
	</div>
</template>
