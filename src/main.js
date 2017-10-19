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
import AdminReleaseGroup from './Admin/Release/Group.vue'
import AdminReleases from './Admin/Releases.vue'
import AdminReleaseEntries from './Admin/Release/Entries.vue'
import AdminDispositionGroup from './Admin/Disposition/Group.vue'
import AdminDispositionEntries from './Admin/Disposition/Entries.vue'
import AdminDispositions from './Admin/Dispositions.vue'
import AdminLineIn from './Admin/LineIn.vue'
import AdminLineIns from './Admin/LineIns.vue'
import AdminLineOut from './Admin/LineOut.vue'
import AdminLineOuts from './Admin/LineOuts.vue'
import AdminClient from './Admin/Client.vue'
import AdminClients from './Admin/Clients.vue'
import AdminPrompt from './Admin/Prompt.vue'
import AdminPrompts from './Admin/Prompts.vue'
import AdminMOH from './Admin/MOH.vue'
import AdminMOHs from './Admin/MOHs.vue'
import AdminDialplan from './Admin/Dialplan.vue'
import AdminRecipe from './Admin/Recipe.vue'
import AdminRecipeEntries from './Admin/Recipe/Entries.vue'
import AdminRecipes from './Admin/Recipes.vue'

import AdminParams from './Admin/Params.vue'

import FormText from './Widget/FormText.vue'
import FormBool from './Widget/FormBool.vue'
import AgentGroups from './Widget/Agent/Groups.vue'
import Skills from './Widget/Skills.vue'
import Lines from './Widget/Lines.vue'
import MOHs from './Widget/MOHs.vue'
import FormSelectBool from './Widget/FormSelectBool.vue'
import Prompts from './Widget/Prompts.vue'
import Queues from './Widget/Queues.vue'
import QueueGroups from './Widget/Queue/Groups.vue'
import Clients from './Widget/Clients.vue'
import DispositionGroups from './Widget/DispositionGroups.vue'
import ReleaseGroups from './Widget/ReleaseGroups.vue'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'
import Notifications from 'vue-notification'

Vue.component('icon', Icon)

Vue.component('form-text', FormText)
Vue.component('form-bool', FormBool)
Vue.component('form-select-bool', FormSelectBool)
Vue.component('agent-groups', AgentGroups)
Vue.component('skills', Skills)
Vue.component('lines', Lines)
Vue.component('mohs', MOHs)
Vue.component('prompts', Prompts)
Vue.component('clients', Clients)
Vue.component('queues', Queues)
Vue.component('queue-groups', QueueGroups)
Vue.component('disposition-groups', DispositionGroups)
Vue.component('release-groups', ReleaseGroups)

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
      { path: 'dispositions', component: AdminDispositions },
      { path: 'clients', component: AdminClients },
      { path: 'line_ins', component: AdminLineIns },
      { path: 'line_outs', component: AdminLineOuts },
      { path: 'prompts', component: AdminPrompts },
      { path: 'mohs', component: AdminMOHs },
      { path: 'recipes', component: AdminRecipes },
      { path: 'agent', component: AdminAgent },
      { path: 'dialplan', component: AdminDialplan },
      { path: 'agent/:id', component: AdminAgent, props: true },
      { path: 'queue', component: AdminQueue },
      { path: 'queue/:id', component: AdminQueue, props: true },
      { path: 'agent_group', component: AdminAgentGroup },
      { path: 'agent_group/:id', component: AdminAgentGroup, props: true },
      { path: 'queue_group', component: AdminQueueGroup },
      { path: 'queue_group/:id', component: AdminQueueGroup, props: true },
      { path: 'release', component: AdminReleaseGroup },
      { path: 'release/:id', component: AdminReleaseGroup, props: true },
      { path: 'release/:id/entries', component: AdminReleaseEntries, props: true },
      { path: 'disposition', component: AdminDispositionGroup },
      { path: 'disposition/:id', component: AdminDispositionGroup, props: true },
      { path: 'disposition/:id/entries', component: AdminDispositionEntries, props: true },
      { path: 'prompt', component: AdminPrompt },
      { path: 'prompt/:id', component: AdminPrompt, props: true },
      { path: 'moh', component: AdminMOH },
      { path: 'moh/:id', component: AdminMOH, props: true },
      { path: 'client', component: AdminClient },
      { path: 'client/:id', component: AdminClient, props: true },
      { path: 'line_in', component: AdminLineIn },
      { path: 'line_in/:id', component: AdminLineIn, props: true },
      { path: 'line_out', component: AdminLineOut },
      { path: 'line_out/:id', component: AdminLineOut, props: true },
      { path: 'recipe', component: AdminRecipe },
      { path: 'recipe/:id', component: AdminRecipe, props: true },
      { path: 'recipe/:id/entries', component: AdminRecipeEntries, props: true },
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
