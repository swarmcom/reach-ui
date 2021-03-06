import Vue from 'vue'
import VueRouter from 'vue-router'
import JsonCSV from 'vue-json-csv'

import Agent from '@/Role/Agent'
import Admin from '@/Role/Admin'
import Supervisor from '@/Role/Supervisor'
import Master from '@/Role/Master'
import Login from '@/Login'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import Notifications from 'vue-notification'

import AgentAPI from '@/agent-api-plugin'

import '@/widgets'

Vue.component('icon', Icon)
Vue.component('downloadCsv', JsonCSV)

Vue.use(AgentAPI)
Vue.use(Notifications)
Vue.use(BootstrapVue)
Vue.use(VueRouter)

Vue.directive('access', {
  bind (el, binding, vnode) {
    let Rights = vnode.context.$agent.vm.agent.permissions
    if (! Rights[binding.arg]) {
      
      const comment = document.createComment(' ');
      Object.defineProperty(comment, 'setAttribute', {
        value: () => undefined,
      });
      vnode.elm = comment;

      if (vnode.componentInstance) {
        vnode.componentInstance.$el = comment;
      }

      if (el.parentNode) {
        el.parentNode.replaceChild(comment, el);
      }
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
  components: {
    agent: Agent,
    admin: Admin,
    supervisor: Supervisor,
    master: Master,
    login: Login
  },
  data: {
    ref_ui: 'HEAD',
    ref_backend: 'HEAD',
    app: undefined
  },
  created: async function () {
    this.ref_ui = window.version.ui == 'REF_UI'? 'HEAD' : window.version.ui
    this.$bus.$on('agent-auth', this.handleAuth)
    this.chooseApp()
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
            this.app = 'master'
            break
          case 'supervisor':
            this.app = 'supervisor'
            break
          case 'admin':
            this.app = 'admin'
            break
          default:
            this.app = 'agent'
        }
      }
    }
  }
})
