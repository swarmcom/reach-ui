import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'select2/dist/css/select2.css'

import VueCodeMirror from 'vue-codemirror'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import Notifications from 'vue-notification'

import AgentAPI from '@/agent-api-plugin'

import Help from '@/Help'
import Login from '@/Login'
import Agent from '@/Agent'
import Profile from '@/Profile'
import Admin from '@/Admin'
import Monitor from '@/Monitor'
import Stats from '@/Stats'
import Report from '@/Report'

import StatsRoutes from '@/routes/stats'
import AdminRoutes from '@/routes/admin'
import ReportRoutes from '@/routes/report'

import '@/widgets'

Vue.component('icon', Icon)

Vue.use(VueRouter)
Vue.use(AgentAPI)
Vue.use(Notifications)
Vue.use(BootstrapVue)
Vue.use(VueCodeMirror)

Vue.directive('access', {
  bind (el, binding, vnode) {
    let Rights = vnode.context.$agent.vm.agent.permissions
    if (! Rights[binding.arg]) {
      el.style.display = "none"
    }
  }
})

const router = new VueRouter({
  routes: [
    { path: '/admin', component: Admin, children: AdminRoutes },
    { path: '/stats', component: Stats, children: StatsRoutes },
    { path: '/help', component: Help },
    { path: '/login', component: Login },
    { path: '/monitor', component: Monitor },
    { path: '/profile', component: Profile },
    { path: '/report', component: Report, children: ReportRoutes },
    { path: '/', component: Agent }
  ]
})

function guard (self, to, from, next) {
  if (to.path === '/login') {
    return next()
  }
  if (self.$agent.isAuth()) {
    self.initial_path = to.path
    next()
  } else {
    next('/login')
  }
}

function handleAuth (R, Auth) {
  if (Auth) {
    if (R.initial_path == '/login') {
      R.$router.replace('/')
    } else {
      R.$router.replace(R.initial_path)
    }
  } else {
    R.$router.replace('/login')
  }
}

const app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  created () {
    this.$router.beforeEach((to, from, next) => guard(this, to, from, next))
    if (!this.$agent.isAuth()) {
      this.initial_path = this.$router.currentRoute.path
      this.$router.replace('/login')
    }
    this.$bus.$on('agent-auth', (Auth) => handleAuth(this, Auth))
  }
})
