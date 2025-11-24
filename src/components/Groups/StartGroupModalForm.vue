<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import { inject } from 'vue'
import { useRace } from '@/composables/useRace'

const { startGroups, registerNewStartGroup, loadEvents } = useRace()

const toast = useToast()
const dialogRef = inject('dialogRef')

const resolver = zodResolver(
	z.object({
		name_start_group: z
			.string()
			.min(3, 'El nombre del grupo debe tener al menos 3 caracteres'),
	})
)

const onFormSubmit = ({ valid }) => {
	if (valid) {
		registerNewStartGroup(startGroups.value)
			.then(() => {
				toast.add({
					severity: 'success',
					summary: 'Éxito',
					detail: 'Grupo creado correctamente',
					life: 3000,
				})
			})
			.catch((error) => {
				console.error('Error creating start group:', error)
				toast.add({
					severity: 'error',
					summary: 'Error',
					detail: 'Error al crear el grupo',
					life: 3000,
				})
			})
			.finally(() => {
				startGroups.value = {}
				dialogRef.value.close()
				loadEvents()
			})
	} else {
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: 'Por favor, corrige los errores en el formulario',
			life: 3000,
		})
	}
}
</script>
<template>
	<Form
		@submit="onFormSubmit"
		class="flex flex-col gap-4 w-full"
		id="form-start-group"
	>
		<FormField
			v-slot="$field"
			name="name_start_group"
			initialValue=""
			class="flex flex-col gap-1"
		>
			<label for="name_start_group" class="mb-2">Nombre del grupo</label>
			<InputText
				type="text"
				placeholder="Nombre del grupo"
				v-model="startGroups.name"
			/>
			<Message
				v-if="$field?.invalid"
				severity="error"
				size="small"
				variant="simple"
			>
				{{ $field?.error?.message }}
			</Message>
		</FormField>
	</Form>
</template>
