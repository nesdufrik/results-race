<template>
	<RouterView />
	<Toast />
	<DynamicDialog />
	<ConfirmDialog></ConfirmDialog>
	<ConfirmDialog group="danger">
		<template #container="{ message, acceptCallback, rejectCallback }">
			<div class="flex flex-col items-center p-8 rounded">
				<div
					class="rounded-full bg-red-400 text-primary-contrast inline-flex justify-center items-center h-24 w-24 -mt-20"
				>
					<i :class="message.icon" class="text-6xl!"></i>
				</div>
				<span class="font-bold text-2xl block mb-2 mt-6">{{
					message.header
				}}</span>
				<p class="mb-0">{{ message.message }}</p>
				<div class="flex items-center gap-2 mt-6">
					<Button label="Sí" @click="acceptCallback" severity="danger"></Button>
					<Button
						label="No"
						@click="rejectCallback"
						severity="secondary"
					></Button>
				</div>
			</div>
		</template>
	</ConfirmDialog>
</template>
