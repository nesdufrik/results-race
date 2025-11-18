<script setup>
import { useSupabase } from '@/composables/useSupabase'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { supabase } = useSupabase()
const router = useRouter()

const items = ref([
	{
		label: 'Dashboard',
		icon: 'pi pi-home',
		route: '/',
	},
	{
		label: 'Eventos',
		icon: 'pi pi-calendar',
		route: '/events',
	},
	{
		label: 'Leaderboard',
		icon: 'pi pi-chart-bar',
		route: '/leaderboard',
	},
])

async function signOut() {
	try {
		const { error } = await supabase.auth.signOut()
		if (error) throw error
		router.push('/login')
	} catch (error) {
		console.error('Error signing out: ' + error.message)
	}
}
</script>
<template>
	<header class="container mx-auto px-4 pb-6">
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
					icon="pi pi-sign-out"
					size="small"
					severity="danger"
					text
					@click="signOut"
				/>
			</template>
		</Menubar>
	</header>
</template>
