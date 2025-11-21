<script setup>
import { inject } from 'vue'
import { useRace } from '@/composables/useRace'

const { loading } = useRace()
const dialogRef = inject('dialogRef')

const isUpdate = dialogRef.value.data.updateCategorie

const onCancel = () => dialogRef.value.close()
</script>
<template>
	<div class="flex justify-end gap-2">
		<Button label="Cancelar" @click="onCancel" severity="secondary" text />
		<Button
			label="Guardar"
			type="submit"
			form="form-categorie"
			severity="primary"
			:loading="isUpdate ? loading.editCategorie : loading.registerNewCategorie"
		/>
	</div>
</template>
