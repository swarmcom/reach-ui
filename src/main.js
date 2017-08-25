import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import About from './About.vue'
import Login from './Login.vue'
import Agent from './Agent.vue'
import Admin from './Admin.vue'
import AgentWs from './agent.js'

import { EventBus } from './event_bus.js';

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{ path: '/admin', component: Admin },
		{ path: '/about', component: About },
		{ path: '/login', component: Login },
		{ path: '/', component: Agent }
	]
})

function guard(agent, to, from, next) {
	if (to.path === '/login') {
		return next()
	}
	if(agent.isAuth()) {
		next();
	} else {
		next('/login')
	}
}

function handleAuth(R, Auth) {
	if (Auth) {
		R.replace('/')
	} else {
		R.replace('/login')
	}
}

const app = new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App },
	created() {
		this.agent = new AgentWs()
		this.$router.beforeEach((to, from, next) => guard(this.agent, to, from, next))
		if (!this.agent.isAuth()) {
			this.$router.replace('/login')
		}
		EventBus.$on('agent-auth', Auth => handleAuth(this.$router, Auth))
	}
})
