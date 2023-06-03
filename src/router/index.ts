import * as VueRouter from 'vue-router'
import User from '../views/PageUser.vue'
import Login from '../views/AuthLogin.vue'
import Search from '../views/PageSearch.vue'
import Company from '../views/PageCompany.vue'
import Backend from '../views/PageBackEnd.vue'

import pinia from '../stores/store'
import {useCounterStore} from "../stores/"

const store = useCounterStore(pinia)

const routes = [
	{
		path: '/',
		name: 'Search',
		component: Search,
		meta: {
			title: 'Search',
			keepAlive: false,
			requireAuth: false
		}
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			title: 'Login',
			keepAlive: false,
			requireAuth: false
		}
	},
	{
		path: '/user',
		name: 'User',
		component: User,
		meta: {
			title: 'User',
			keepAlive: false,
			requireAuth: true,
			identityAuth: 0
		}
	},
	{
		path: '/company',
		name: 'Company',
		component: Company,
		meta: {
			title: 'Company',
			keepAlive: false,
			requireAuth: true,
			identityAuth: 1
		}
	},
	{
		path: '/backend',
		name: 'Backend',
		component: Backend,
		meta: {
			title: 'Backend',
			keepAlive: false,
			requireAuth: true,
			identityAuth: 2
		}
	},
]

//@ts-ignore
const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	//@ts-ignore
	if (!to.meta.requireAuth || store.LoginIdentity === to.meta.identityAuth) {
		next();
	} else if	(to.meta.requireAuth && store.LoginIdentity !== to.meta.identityAuth) {
		next({
			name: 'Login',
			query : {
				identity: to.meta.identityAuth
			}
		});
	}
});
export default router