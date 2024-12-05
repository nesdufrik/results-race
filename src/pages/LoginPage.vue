<template>
	<div class="px-6 py-20 md:px-12 lg:px-20">
		<div class="w-full md:w-96 mx-auto">
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
						<Button
							type="submit"
							severity="primary"
							fluid
							icon="pi pi-sign-in"
							label="Ingresar"
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

const resolver = zodResolver(
	z.object({
		username: z.string().min(1, { message: 'Nombre de usuario es requerido.' }),
		password: z.string().min(1, { message: 'La contraseña es requerida.' }),
	})
)

const onFormSubmit = (obj) => {
	const { valid, values } = obj
	if (valid) {
	}
}
</script>
