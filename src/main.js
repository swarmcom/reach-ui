import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '@/App'
import Master from '@/Master'
import Login from '@/Login'

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

const app = new Vue({
  el: '#app',
  data: {
    ref_ui: 'HEAD',
    ref_backend: 'HEAD',
    app: 'app',
  },
  components: {
    app: App,
    master: Master,
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
      console.log("choose app", this.$agent.isAuth())
      if (!this.$agent.isAuth()) {
        this.app = 'login'
      } else {
        switch (this.$agent.role()) {
          case 'master':
            this.app = 'master'
            break
          default:
            this.app = 'app'
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
