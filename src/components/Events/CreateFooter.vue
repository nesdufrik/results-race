<template>
	<div class="flex gap-2">
		<Button label="Cancelar" @click="onCancel" severity="secondary" text />
		<Button label="Guardar" @click="onSave" severity="primary" />
	</div>
</template>
<script setup>
const onCancel = () => {
	console.log('Cancelar')
}

const onSave = () => {
	console.log('Guardar')
}
</script>
