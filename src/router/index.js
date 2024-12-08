import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'

import pinia from '@/stores'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: HomePage,
		redirect: '/leaderboard',
	},
	{
		path: '/login',
		name: 'Login',
		meta: {
			title: 'Iniciar sesión',
		},
		component: LoginPage,
	},
	{
		path: '/leaderboard',
		name: 'Leaderboard',
		meta: {
			title: 'Resultados',
		},
		component: () => import('@/pages/LeaderboardPage.vue'),
	},
	{
		path: '/admin',
		name: 'Admin',
		meta: {
			requireAuth: true,
			title: 'Administrador',
		},
		component: () => import('@/pages/admin/AdminPage.vue'),
		redirect: '/admin/dashboard',
		children: [
			{
				path: 'dashboard',
				name: 'Dashboard',
				component: () => import('@/pages/admin/DashboardPage.vue'),
			},
			{
				path: 'evento/:id',
				children: [
					{
						path: 'participantes',
						name: 'Participantes',
						component: () => import('@/pages/admin/ParticipantesPage.vue'),
					},
					{
						path: 'finish',
						name: 'Llegadas',
						component: () => import('@/pages/admin/LlegadasPage.vue'),
					},
				],
			},
			{
				path: 'leaderboard',
				name: 'AdminLeaderboard',
				component: () => import('@/pages/admin/LeaderboardPage.vue'),
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
	const authStore = useAuthStore(pinia)
	const { user, isLogged } = storeToRefs(authStore)

	const token = localStorage.getItem('token')
	const requireAuth = to.matched.some((record) => record.meta.requireAuth)

	document.title = to.meta.title || 'Resultados de competencias'

	if (requireAuth) {
		if (!token) {
			next({ name: 'Login' })
			return
		}

		if (!isLogged.value) {
			try {
				await authStore.verifyToken()
			} catch (error) {
				console.log(error)
				next({ name: 'Login' })
				return
			}
		}
	}

	next()
})

export default router
