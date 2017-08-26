import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Help from './Help.vue'
import Login from './Login.vue'
import Agent from './Agent.vue'
import Admin from './Admin.vue'
import Monitor from './Monitor.vue'
import AgentWs from './agent.js'
import AdminAgent from './Admin/Agent.vue'
import AdminAgents from './Admin/Agents.vue'
import AdminQueue from './Admin/Queue.vue'
import AdminQueues from './Admin/Queues.vue'
import AdminGroup from './Admin/Group.vue'
import AdminGroups from './Admin/Groups.vue'
import AdminProfile from './Admin/Profile.vue'
import AdminProfiles from './Admin/Profiles.vue'

import AdminParams from './Admin/Params.vue'

import { EventBus } from './event_bus.js'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'

// globally (in your main .js file)
Vue.component('icon', Icon)

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/admin', component: Admin, children: [
      { path: 'agents', component: AdminAgents },
      { path: 'queues', component: AdminQueues },
      { path: 'params', component: AdminParams },
      { path: 'groups', component: AdminGroups },
      { path: 'profiles', component: AdminProfiles },
      { path: 'agent', component: AdminAgent },
      { path: 'agent/:id', component: AdminAgent, props: true },
      { path: 'queue', component: AdminQueue },
      { path: 'queue/:id', component: AdminQueue, props: true },
      { path: 'profile', component: AdminProfile },
      { path: 'profile/:id', component: AdminProfile, props: true },
      { path: 'group', component: AdminGroup },
      { path: 'group/:id', component: AdminGroup, props: true }
    ] },
    { path: '/help', component: Help },
    { path: '/login', component: Login },
    { path: '/monitor', component: Monitor },
    { path: '/', component: Agent }
  ]
})

function guard (agent, to, from, next) {
  if (to.path === '/login') {
    return next()
  }
  if (agent.isAuth()) {
    next()
  } else {
    next('/login')
  }
}

function handleAuth (R, Auth) {
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
  created () {
    this.agent = new AgentWs()
    this.$router.beforeEach((to, from, next) => guard(this.agent, to, from, next))
    if (!this.agent.isAuth()) {
      this.$router.replace('/login')
    }
    EventBus.$on('agent_auth', Auth => handleAuth(this.$router, Auth))
  }
})
