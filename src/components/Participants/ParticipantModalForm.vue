<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { inject, ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRace } from '@/composables/useRace'
import { useRoute } from 'vue-router'

const {
	participant,
	categories,
	registerNewParticipant,
	editParticipant,
	loadParticipants,
} = useRace()

const toast = useToast()
const dialogRef = inject('dialogRef')
const route = useRoute()
const isUpdate = dialogRef.value.data.updateParticipant

const resolver = zodResolver(
	z.object({
		full_name: z
			.string('El nombre es obligatorio')
			.min(3, 'El nombre debe tener al menos 3 caracteres'),
		gender: z.enum(
			['male', 'female'],
			'El genero debe ser Masculino o Femenino'
		),
		birth_date: z.date('La fecha de nacimiento es obligatoria'),
		category_id: z
			.string('La categoria es obligatoria')
			.min(3, 'La categoria debe tener al menos 3 caracteres'),
	})
)

const onFormSubmit = ({ valid }) => {
	if (valid) {
		if (isUpdate) {
			editParticipant(participant.value)
				.then(() => {
					toast.add({
						severity: 'success',
						summary: 'Éxito',
						detail: 'Participante editado correctamente',
						life: 3000,
					})
				})
				.catch((error) => {
					console.error('Error editing participant:', error)
					toast.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo editar el participante',
						life: 3000,
					})
				})
				.finally(() => {
					participant.value = {}
					dialogRef.value.close()
					loadParticipants(route.params.idEvent)
				})
		} else {
			registerNewParticipant(participant.value)
				.then(() => {
					toast.add({
						severity: 'success',
						summary: 'Éxito',
						detail: 'Participante creado correctamente',
						life: 3000,
					})
				})
				.catch((error) => {
					console.error('Error creating participant:', error)
					toast.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo crear el participante',
						life: 3000,
					})
				})
				.finally(() => {
					participant.value = {}
					dialogRef.value.close()
					loadParticipants(route.params.idEvent)
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
])

const categoriesSelect = computed(() => {
	if (!participant.value.birth_date || !participant.value.gender) return []
	const birthDateParticipant = new Date(participant.value.birth_date)
	const ageParticipant =
		new Date().getFullYear() - birthDateParticipant.getFullYear()

	const newCategories = categories.value.filter((category) => {
		return (
			(category.gender === participant.value.gender ||
				category.gender === 'mixed') &&
			category.min_age <= ageParticipant &&
			category.max_age >= ageParticipant
		)
	})

	return newCategories
})
</script>
<template>
	<Form
		:resolver="resolver"
		@submit="onFormSubmit"
		class="flex flex-col gap-4 w-full"
		id="form-participant"
	>
		<FormField
			v-slot="$field"
			name="full_name"
			:initialValue="participant.full_name"
			class="flex flex-col gap-1"
		>
			<InputText
				type="text"
				placeholder="Nombre completo"
				v-model="participant.full_name"
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
			:initialValue="participant.gender"
			class="flex flex-col gap-1"
		>
			<Select
				:options="genders"
				optionLabel="name"
				optionValue="value"
				v-model="participant.gender"
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
		<FormField
			v-slot="$field"
			name="birth_date"
			:initialValue="participant.birth_date"
			class="flex flex-col gap-1"
		>
			<DatePicker
				placeholder="Fecha de nacimiento"
				v-model="participant.birth_date"
				fluid
				showIcon
				iconDisplay="input"
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
			name="category_id"
			:initialValue="participant.category_id"
			class="flex flex-col gap-1"
		>
			<Select
				v-model="participant.category_id"
				:options="isUpdate ? categories : categoriesSelect"
				optionValue="category_id"
				:optionLabel="
					(option) => `${option.start_group_name} (${option.category_name})`
				"
				placeholder="Categoria"
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
			name="team"
			:initialValue="participant.team"
			class="flex flex-col gap-1"
		>
			<InputText type="text" placeholder="Equipo" v-model="participant.team" />
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
			name="email"
			:initialValue="participant.email"
			class="flex flex-col gap-1"
		>
			<InputText
				type="email"
				placeholder="Correo"
				v-model="participant.email"
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
			name="phone"
			:initialValue="participant.phone || '+591'"
			class="flex flex-col gap-1"
		>
			<InputText
				type="text"
				placeholder="Telefono"
				v-model="participant.phone"
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
