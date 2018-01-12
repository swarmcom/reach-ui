import Vue from 'vue'
import VueRouter from 'vue-router'

import Agent from '@/Role/Agent'
import Admin from '@/Role/Admin'
import Supervisor from '@/Role/Supervisor'
import Master from '@/Role/Master'
import Login from '@/Login'
import Agentdev from '@/Role/dev/Agent'
import Admindev from '@/Role/dev/Admin'
import Supervisordev from '@/Role/dev/Supervisor'
import Masterdev from '@/Role/dev/Master'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import Notifications from 'vue-notification'

import AgentAPI from '@/agent-api-plugin'

import '@/widgets'

Vue.component('icon', Icon)

Vue.use(AgentAPI)
Vue.use(Notifications)
Vue.use(BootstrapVue)
Vue.use(VueRouter)

Vue.directive('access', {
  bind (el, binding, vnode) {
    let Rights = vnode.context.$agent.vm.agent.permissions
    if (! Rights[binding.arg]) {
      el.style.display = "none"
    }
  },
  update (el, binding, vnode) {
    let Rights = vnode.context.$agent.vm.agent.permissions
    if (! Rights[binding.arg]) {
        el.style.display = "none"
    }
    else {
        el.style.display = ""
    }
  }
})

Vue.mixin({
  methods: {
    ref_ui_uri () {
      return `https://github.com/swarmcom/reach-ui/commit/${this.ref_ui}`
    },
    ref_backend_uri () {
      return `https://github.com/ezuce/reach3/commit/${this.ref_backend}`
    },
    logout () { this.$agent.logout() }
  }
})

const app = new Vue({
  el: '#app',
  data: {
    ref_ui: 'HEAD',
    ref_backend: 'HEAD',
    ui: 'reach',
    app: undefined
  },
  components: {
    agent: Agent,
    agentdev: Agentdev,
    admin: Admin,
    admindev: Admindev,
    supervisor: Supervisor,
    supervisordev: Supervisordev,
    master: Master,
    masterdev: Masterdev,
    login: Login
  },
  methods: {
    handleAuth: async function (Auth) {
      if (Auth) {
        let backend = await this.$agent.p_mfa('ws_misc', 'version', [])
        this.ref_backend = backend.version
      }
      this.chooseApp()
    },
    chooseApp () {
      if (!this.$agent.isAuth()) {
        this.app = 'login'
      } else {
        switch (this.$agent.role()) {
          case 'master':
            if (this.ui === 'reach')
              this.app = 'master'
            else
              this.app = 'masterdev'
            break
          case 'supervisor':
            if (this.ui === 'reach')
              this.app = 'supervisor'
            else
                this.app = 'supervisordev'
            break
          case 'admin':
            if (this.ui === 'reach')
              this.app = 'admin'
            else
                this.app = 'admindev'
            break
          default:
            if (this.ui === 'reach')
              this.app = 'agent'
            else
              this.app = 'agentdev'
        }
      }
    }
  },
  created: async function () {
    this.ref_ui = window.version.ui == 'REF_UI'? 'HEAD' : window.version.ui
    this.$bus.$on('agent-auth', this.handleAuth)
    this.chooseApp()
  }
})
