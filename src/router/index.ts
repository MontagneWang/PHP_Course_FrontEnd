import * as VueRouter from 'vue-router'
import User from '../views/PageUser.vue'
import Login from '../views/AuthLogin.vue'
import Search from '../views/PageSearch.vue'
import Company from '../views/PageCompany.vue'
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
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			title: 'Login',
			keepAlive: true,
			requireAuth: false
		}
	},
	{
		path: '/user',
		name: 'User',
		component: User,
		meta: {
			title: 'User',
			keepAlive: true,
			requireAuth: true
		}
	},
	{
		path: '/company',
		name: 'Company',
		component: Company,
		meta: {
			title: 'Company',
			keepAlive: true,
			requireAuth: true
		}
	},
	{
		path: '/backend',
		name: 'Backend',
		component: Backend,
		meta: {
			title: 'Backend',
			keepAlive: true,
			requireAuth: true
		}
	},
]


const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes,
})
router.beforeEach((to, from, next) => {
	if (to.meta.requireAuth) {
		next('/login');
	} else {
		next();
	}
});
export default router