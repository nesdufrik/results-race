<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from 'primevue/usetoast'
import { inject } from 'vue'
import { useRace } from '@/composables/useRace'

const { event, registerNewEvent } = useRace()

const toast = useToast()
const dialogRef = inject('dialogRef')

const resolver = zodResolver(
	z.object({
		name_event: z
			.string()
			.min(3, 'El nombre del evento debe tener al menos 3 caracteres'),
		date_event: z.date('La fecha del evento es obligatoria'),
		location_event: z
			.string()
			.min(3, 'El lugar del evento debe tener al menos 3 caracteres'),
	})
)

const onFormSubmit = ({ valid }) => {
	if (valid) {
		registerNewEvent(event.value)
			.then(() => {
				toast.add({
					severity: 'success',
					summary: 'Éxito',
					detail: 'Evento creado correctamente',
					life: 3000,
				})
			})
			.catch((error) => {
				console.error('Error creating event:', error)
				toast.add({
					severity: 'error',
					summary: 'Error',
					detail: 'No se pudo crear el evento',
					life: 3000,
				})
			})
			.finally(() => {
				event.value = {}
				dialogRef.value.close()
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
		:resolver
		@submit="onFormSubmit"
		class="flex flex-col gap-4 w-full"
		id="form-event"
	>
		<FormField
			v-slot="$field"
			name="name_event"
			initialValue=""
			class="flex flex-col gap-1"
		>
			<InputText
				type="text"
				placeholder="Nombre del evento"
				v-model="event.name"
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
			name="date_event"
			initialValue=""
			class="flex flex-col gap-1"
		>
			<DatePicker
				name="date_event"
				fluid
				placeholder="Fecha del evento"
				v-model="event.event_date"
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
			name="location_event"
			initialValue=""
			class="flex flex-col gap-1"
		>
			<InputText
				type="text"
				placeholder="Lugar del evento"
				v-model="event.location"
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
