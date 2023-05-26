import * as VueRouter from 'vue-router'
import Login from '../views/PageLogin.vue'
import Search from '../views/PageSearch.vue'
import Backend from '../views/PageBackEnd.vue'

const routes = [
	{
		path: '/',
		name: 'Search',
		component: Search,
		meta: {
			title: 'Search',
			keepAlive: true,
			requireAuth: false
		}
	},
	{
		path: '/Login',
		name: 'Login',
		component: Login,
		meta: {
			title: 'Login',
			keepAlive: true,
			requireAuth: false
		}
	},
	{
		path: '/backend',
		name: 'Backend',
		component: Backend,
		meta: {
			title: 'Backend',
			keepAlive: true,
			requireAuth: false
		}
	},
]

const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes,
})

export default router