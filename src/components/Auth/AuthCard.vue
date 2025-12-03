<script setup>
defineProps({
	loading: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		default: 'Sign In',
	},
	formId: {
		type: String,
		default: null,
	},
	title: {
		type: String,
		default: 'Bienvenido de Nuevo',
	},
})

const emit = defineEmits(['submit'])

const onSubmit = () => {
	emit('submit')
}
</script>
<template>
	<div
		class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-20 lg:px-80 min-h-screen flex items-center justify-center"
	>
		<div
			class="bg-surface-0 dark:bg-surface-900 p-8 md:p-12 shadow-sm rounded-2xl w-full max-w-sm mx-auto flex flex-col gap-8"
		>
			<div class="flex flex-col items-center gap-4">
				<div class="flex flex-col items-center justify-center p-4">
					<img src="@/assets/img/logo.png" class="h-15" alt="Logo" />
					<span class="text-xs font-bold text-orange-400"
						>Manchachis &copy; {{ new Date().getFullYear() }}</span
					>
				</div>
				<div class="flex flex-col items-center gap-2 w-full">
					<div
						class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight text-center w-full"
					>
						{{ title }}
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-6 w-full">
				<slot />
			</div>
			<Button
				:label="label"
				icon="pi pi-user"
				class="w-full py-2 rounded-lg flex justify-center items-center gap-2"
				@click="!formId && onSubmit()"
				:loading="loading"
				:type="formId ? 'submit' : 'button'"
				:form="formId"
			>
				<template #icon>
					<i class="pi pi-user text-base! leading-normal!" />
				</template>
			</Button>
		</div>
	</div>
</template>
