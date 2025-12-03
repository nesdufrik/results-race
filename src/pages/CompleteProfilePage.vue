<template>
	<AuthCard
		title="Completar Registro"
		label="Guardar y Continuar"
		:loading="loading"
		formId="complete_profile_form"
	>
		<p class="text-center mb-4 text-gray-600">
			Por favor, completa tu información para continuar.
		</p>
		<Form
			id="complete_profile_form"
			:resolver
			@submit="onFormSubmit"
			class="flex flex-col gap-4"
		>
			<FormField
				v-slot="$field"
				as="section"
				name="fullName"
				initialValue=""
				class="flex flex-col gap-2 w-full"
			>
				<label
					for="fullName"
					class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
					>Nombre Completo</label
				>
				<InputText
					type="text"
					placeholder="Nombre Completo"
					v-model="fullName"
				/>
				<Message
					v-if="$field?.invalid"
					severity="error"
					size="small"
					variant="simple"
					>{{ $field.error?.message }}</Message
				>
			</FormField>
			<FormField
				v-slot="$field"
				as="section"
				name="password"
				initialValue=""
				class="flex flex-col gap-2 w-full"
			>
				<label
					for="password"
					class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
					>Nueva Contraseña</label
				>
				<Password
					type="text"
					placeholder="Nueva Contraseña"
					:feedback="false"
					:toggleMask="true"
					input-class="w-full!"
					v-model="password"
				/>
				<Message
					v-if="$field?.invalid"
					severity="error"
					size="small"
					variant="simple"
					>{{ $field.error?.message }}</Message
				>
			</FormField>
			<Message
				v-if="errorMessage"
				severity="error"
				size="small"
				variant="filled"
			>
				{{ errorMessage }}
			</Message>
		</Form>
	</AuthCard>
</template>
<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'
import AuthCard from '@/components/Auth/AuthCard.vue'

const loading = ref(false)
const fullName = ref('')
const password = ref('')
const errorMessage = ref('')
const { updateProfile } = useAuth()

const resolver = zodResolver(
	z.object({
		fullName: z.string().min(1, { message: 'Nombre completo es requerido.' }),
		password: z
			.string()
			.min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
	})
)

const onFormSubmit = ({ valid }) => {
	if (valid) {
		submitProfile()
	}
}

async function submitProfile() {
	try {
		loading.value = true
		await updateProfile({
			fullName: fullName.value,
			password: password.value,
		})
	} catch (error) {
		errorMessage.value = error.message || 'Error al actualizar el perfil.'
	} finally {
		loading.value = false
	}
}
</script>
