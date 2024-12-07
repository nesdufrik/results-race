<template>
	<div class="min-h-screen flex items-center justify-center">
		<div class="max-w-md w-full">
			<Card>
				<template #title>Autenticación de usuario</template>
				<template #content>
					<Form
						:resolver="resolver"
						@submit="onFormSubmit"
						class="flex flex-col gap-4"
					>
						<FormField
							v-slot="$field"
							as="section"
							name="username"
							initialValue=""
							class="flex flex-col gap-2"
						>
							<InputText type="text" placeholder="Nombre de usuario" />
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
									placeholder="Contraseña de usuario"
									:feedback="false"
									toggleMask
									fluid
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

const { login, loading, errorMessage } = useAuth()

const resolver = zodResolver(
	z.object({
		username: z.string().min(1, { message: 'Nombre de usuario es requerido.' }),
		password: z.string().min(1, { message: 'La contraseña es requerida.' }),
	})
)

const onFormSubmit = (obj) => {
	const { valid, values } = obj
	if (valid) {
		const { username, password } = values
		login(username, password)
	}
}
</script>
