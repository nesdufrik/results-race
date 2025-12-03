import { createRouter, createWebHistory } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'
import LoginPage from '@/pages/LoginPage.vue'
import CompleteProfilePage from '@/pages/CompleteProfilePage.vue'
import BasePage from '@/pages/BasePage.vue'

import EventsPage from '@/pages/EventsPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import ParticipantsPage from '@/pages/ParticipantsPage.vue'
import ArrivalsPage from '@/pages/ArrivalsPage.vue'
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
		path: '/complete-profile',
		name: 'complete-profile',
		meta: {
			requireAuth: true,
			title: 'Completar Perfil',
		},
		component: CompleteProfilePage,
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
				path: '/events',
				name: 'events',
				component: EventsPage,
			},
			{
				path: '/participants/:idEvent',
				name: 'participants-event',
				component: ParticipantsPage,
			},
			{
				path: '/arrivals/:idEvent',
				name: 'arrivals-participants',
				component: ArrivalsPage,
			},
			{
				path: '/leaderboard/:idEvent',
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
			return next({ name: 'login' })
		}

		const userMetadata = data.session.user.user_metadata
		const hasFullName = userMetadata && userMetadata.full_name

		if (!hasFullName && to.name !== 'complete-profile') {
			return next({ name: 'complete-profile' })
		}

		if (hasFullName && to.name === 'complete-profile') {
			return next({ name: 'dashboard' })
		}

		return next()
	} else if (data.session && to.name === 'login') {
		return next({ name: 'dashboard' })
	}
	return next()
})

export default router
