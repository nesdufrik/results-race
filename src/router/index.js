import { createRouter, createWebHistory } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'
import LoginPage from '@/pages/LoginPage.vue'
import BasePage from '@/pages/BasePage.vue'

import EventosPage from '@/pages/EventosPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import ParticipantesPage from '@/pages/ParticipantesPage.vue'
import LlegadasPage from '@/pages/LlegadasPage.vue'
import LeaderboardPage from '@/pages/LeaderboardPage.vue'

const { supabase } = useSupabase()

const routes = [
	{
		path: '/login',
		name: 'login',
		meta: {
			title: 'Iniciar sesión',
		},
		component: LoginPage,
	},
	{
		path: '/',
		name: 'base',
		meta: {
			requireAuth: true,
			title: 'Sistema de administración',
		},
		component: BasePage,
		redirect: '/dashboard',
		children: [
			{
				path: '/dashboard',
				name: 'dashboard',
				component: DashboardPage,
			},
			{
				path: '/eventos',
				name: 'eventos',
				component: EventosPage,
			},
			{
				path: '/participantes/:idEvento',
				name: 'participantes-evento',
				component: ParticipantesPage,
			},
			{
				path: '/llegadas/:idEvento',
				name: 'llegadas-evento',
				component: LlegadasPage,
			},
			{
				path: '/leaderboard',
				name: 'leaderboard',
				component: LeaderboardPage,
			},
		],
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: '/',
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async (to, from, next) => {
	const { data } = await supabase.auth.getSession()
	const requireAuth = to.matched.some((record) => record.meta.requireAuth)

	if (to.meta.title) {
		document.title = to.meta.title
	}

	if (requireAuth) {
		if (!data.session) {
			return next({ name: 'Login' })
		}
		return next()
	}
	return next()
})

export default router
