<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { inject, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRace } from '@/composables/useRace'

const { categorie, registerNewCategorie, editCategorie, loadEvents } = useRace()

const toast = useToast()
const dialogRef = inject('dialogRef')

const resolver = zodResolver(
	z.object({
		name_categorie: z
			.string()
			.min(3, 'El nombre de la categoria debe tener al menos 3 caracteres'),
		min_age: z.number().min(1, 'La edad minima debe ser mayor a 0'),
		max_age: z.number().min(1, 'La edad maxima debe ser mayor a 0'),
		gender: z.enum(
			['male', 'female', 'mixed'],
			'El genero debe ser Masculino, Femenino o Mixto'
		),
	})
)

const onFormSubmit = ({ valid }) => {
	if (valid) {
		if (dialogRef.value.data.updateCategorie) {
			editCategorie(categorie.value)
				.then(() => {
					toast.add({
						severity: 'success',
						summary: 'Éxito',
						detail: 'Categoria editada correctamente',
						life: 3000,
					})
				})
				.catch((error) => {
					console.error('Error editing categorie:', error)
					toast.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo editar la categoria',
						life: 3000,
					})
				})
				.finally(() => {
					categorie.value = {}
					dialogRef.value.close()
					loadEvents()
				})
		} else {
			registerNewCategorie(categorie.value)
				.then(() => {
					toast.add({
						severity: 'success',
						summary: 'Éxito',
						detail: 'Categoria creada correctamente',
						life: 3000,
					})
				})
				.catch((error) => {
					console.error('Error creating categorie:', error)
					toast.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo crear la categoria',
						life: 3000,
					})
				})
				.finally(() => {
					categorie.value = {}
					dialogRef.value.close()
					loadEvents()
				})
		}
	} else {
		toast.add({
			severity: 'error',
			summary: 'Error',
			detail: 'Por favor, corrige los errores en el formulario',
			life: 3000,
		})
	}
}

const genders = ref([
	{ name: 'Masculino', value: 'male' },
	{ name: 'Femenino', value: 'female' },
	{ name: 'Mixto', value: 'mixed' },
])
</script>
<template>
	<Form
		:resolver="resolver"
		@submit="onFormSubmit"
		class="flex flex-col gap-4 w-full"
		id="form-categorie"
	>
		<FormField
			v-slot="$field"
			name="name_categorie"
			:initialValue="categorie.name"
			class="flex flex-col gap-1"
		>
			<InputText
				type="text"
				placeholder="Nombre de la categoria"
				v-model="categorie.name"
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
		<FormField
			v-slot="$field"
			name="min_age"
			:initialValue="categorie.min_age"
			class="flex flex-col gap-1"
		>
			<InputNumber
				v-model="categorie.min_age"
				mode="decimal"
				placeholder="Edad minima"
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
		<FormField
			v-slot="$field"
			name="max_age"
			:initialValue="categorie.max_age"
			class="flex flex-col gap-1"
		>
			<InputNumber
				v-model="categorie.max_age"
				mode="decimal"
				placeholder="Edad maxima"
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
		<FormField
			v-slot="$field"
			name="gender"
			:initialValue="categorie.gender"
			class="flex flex-col gap-1"
		>
			<Select
				:options="genders"
				optionLabel="name"
				optionValue="value"
				v-model="categorie.gender"
				placeholder="Genero"
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
