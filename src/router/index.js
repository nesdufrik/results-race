import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: HomePage,
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

router.beforeEach((to, from, next) => {
	document.title = to.meta.title || 'Resultados de competencias'
	if (to.meta.requireAuth && !localStorage.getItem('token')) {
		next({ name: 'Login' })
	} else {
		next()
	}
})

export default router
