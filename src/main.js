import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import AgentAPI from './agent-api-plugin.js'

import Reports from './Reports.vue'
import Login from './Login.vue'
import Agent from './Agent.vue'
import Admin from './Admin.vue'
import Monitor from './Monitor.vue'
import AdminAgent from './Admin/Agent.vue'
import AdminAgents from './Admin/Agents.vue'
import AdminQueue from './Admin/Queue.vue'
import AdminQueues from './Admin/Queues.vue'
import AdminQueueGroup from './Admin/Queue/Group.vue'
import AdminQueueGroups from './Admin/Queue/Groups.vue'
import AdminAgentGroup from './Admin/Agent/Group.vue'
import AdminAgentGroups from './Admin/Agent/Groups.vue'
import AdminRelease from './Admin/Release.vue'
import AdminReleases from './Admin/Releases.vue'
import AdminLineIn from './Admin/LineIn.vue'
import AdminLineIns from './Admin/LineIns.vue'
import AdminLineOut from './Admin/LineOut.vue'
import AdminLineOuts from './Admin/LineOuts.vue'
import AdminClient from './Admin/Client.vue'
import AdminClients from './Admin/Clients.vue'

import AdminParams from './Admin/Params.vue'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'
import Notifications from 'vue-notification'

Vue.component('icon', Icon)
Vue.use(VueRouter)
Vue.use(AgentAPI)
Vue.use(Notifications)
Vue.use(BootstrapVue)

const router = new VueRouter({
  routes: [
    { path: '/admin', component: Admin, children: [
      { path: 'agents', component: AdminAgents },
      { path: 'queues', component: AdminQueues },
      { path: 'params', component: AdminParams },
      { path: 'queue_groups', component: AdminQueueGroups },
      { path: 'agent_groups', component: AdminAgentGroups },
      { path: 'releases', component: AdminReleases },
      { path: 'clients', component: AdminClients },
      { path: 'line_ins', component: AdminLineIns },
      { path: 'line_outs', component: AdminLineOuts },
      { path: 'agent', component: AdminAgent },
      { path: 'agent/:id', component: AdminAgent, props: true },
      { path: 'queue', component: AdminQueue },
      { path: 'queue/:id', component: AdminQueue, props: true },
      { path: 'agent_group', component: AdminAgentGroup },
      { path: 'agent_group/:id', component: AdminAgentGroup, props: true },
      { path: 'queue_group', component: AdminQueueGroup },
      { path: 'queue_group/:id', component: AdminQueueGroup, props: true },
      { path: 'release', component: AdminRelease },
      { path: 'release/:id', component: AdminRelease, props: true },
      { path: 'client', component: AdminClient },
      { path: 'client/:id', component: AdminClient, props: true },
      { path: 'line_in', component: AdminLineIn },
      { path: 'line_in/:id', component: AdminLineIn, props: true },
      { path: 'line_out', component: AdminLineOut },
      { path: 'line_out/:id', component: AdminLineOut, props: true }
    ] },
    { path: '/reports', component: Reports },
    { path: '/login', component: Login },
    { path: '/monitor', component: Monitor },
    { path: '/main', component: Agent }
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
    R.replace('/main')
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
    this.$router.beforeEach((to, from, next) => guard(this.$agent, to, from, next))
    if (!this.$agent.isAuth()) {
      this.$router.replace('/login')
    }
    this.$bus.$on('agent-auth', Auth => handleAuth(this.$router, Auth))
  }
})
