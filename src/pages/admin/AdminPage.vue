<template>
	<div class="flex items-center justify-center">
		<div class="max-w-4xl xl:max-w-7xl w-full flex flex-col gap-5 px-2">
			<Menubar :model="items">
				<template #item="{ item, props, hasSubmenu }">
					<router-link
						v-if="item.route"
						v-slot="{ href, navigate }"
						:to="item.route"
						custom
					>
						<a v-ripple :href="href" v-bind="props.action" @click="navigate">
							<span :class="item.icon" />
							<span>{{ item.label }}</span>
						</a>
					</router-link>
					<a
						v-else
						v-ripple
						:href="item.url"
						:target="item.target"
						v-bind="props.action"
					>
						<span :class="item.icon" />
						<span>{{ item.label }}</span>
						<span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
					</a>
				</template>
				<template #end>
					<Button
						label="Cerrar sesión"
						icon="pi pi-sign-in"
						size="small"
						text
						@click="logout"
					/>
				</template>
			</Menubar>
			<RouterView />
		</div>
	</div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()

const items = ref([
	{
		label: 'Inicio',
		icon: 'pi pi-home',
		route: '/admin',
	},
	{
		label: 'Leaderboard',
		icon: 'pi pi-chart-bar',
		route: '/admin/leaderboard',
	},
])
</script>
