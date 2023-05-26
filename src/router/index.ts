import * as VueRouter from 'vue-router'
import About from '../components/HelloWorld.vue'
import Home from '../App.vue'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: {
			title: 'Main',
			keepAlive: true,
			requireAuth: false
		}
	},
	{
		path: '/about',
		name: 'about',
		component: About,
		meta: {
			title: 'About',
			keepAlive: true,
			requireAuth: false
		}
		// 动态加载
		// component: () => import(/* webpackChunkName: "about" */ '../views/about.vue')
	}
]

const router = VueRouter.createRouter({
	history: VueRouter.createWebHashHistory(),
	routes,
})

export default router