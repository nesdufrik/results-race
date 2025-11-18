<template>
	<div class="min-h-screen flex items-center justify-center">
		<div class="max-w-md w-full">
			<Card>
				<template #title>Autenticación de usuario</template>
				<template #content>
					<Form :resolver @submit="onFormSubmit" class="flex flex-col gap-4">
						<FormField
							v-slot="$field"
							as="section"
							name="email"
							initialValue=""
							class="flex flex-col gap-2"
						>
							<InputText
								type="email"
								placeholder="Correo electrónico"
								v-model="email"
							/>
							<Message
								v-if="$field?.invalid"
								severity="error"
								size="small"
								variant="simple"
								>{{ $field.error?.message }}</Message
							>
						</FormField>
						<FormField v-slot="$field" asChild name="password" initialValue="">
							<section class="flex flex-col gap-2">
								<Password
									type="text"
									placeholder="Contraseña"
									:feedback="false"
									toggleMask
									fluid
									v-model="password"
								/>
								<Message
									v-if="$field?.invalid"
									severity="error"
									size="small"
									variant="simple"
									>{{ $field.error?.message }}</Message
								>
							</section>
						</FormField>
						<Message
							v-if="errorMessage"
							severity="error"
							size="small"
							variant="filled"
						>
							{{ errorMessage }}
						</Message>
						<Button
							type="submit"
							severity="primary"
							fluid
							icon="pi pi-sign-in"
							label="Ingresar"
							:loading="loading"
						/>
					</Form>
				</template>
			</Card>
		</div>
	</div>
</template>
<script setup>
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/composables/useAuth'
import { ref } from 'vue'

const loading = ref(false)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const { loginWithPassw } = useAuth()

const resolver = zodResolver(
	z.object({
		email: z
			.string()
			.min(1, { message: 'Correo electrónico es requerido.' })
			.email({ message: 'El correo electrónico no es válido.' }),
		password: z.string().min(1, { message: 'La contraseña es requerida.' }),
	})
)

const onFormSubmit = ({ valid }) => {
	if (valid) {
		login()
	}
}

async function login() {
	try {
		loading.value = true
		await loginWithPassw({
			email: email.value,
			password: password.value,
		})
	} catch (error) {
		errorMessage.value = error.message || 'Error al iniciar sesión.'
	} finally {
		loading.value = false
	}
}
</script>
