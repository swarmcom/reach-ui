<template>
  <div style="min-height: 100%; padding-bottom: 60px">
    <b-navbar
      class="navbar-custom fixed-top"
      toggleable="md"
      type="dark"
      variant="info"
    >
      <b-nav-toggle target="nav_collapse" />
      <b-navbar-brand to="/">
        {{ this.$agent.vm.agent.name }}
      </b-navbar-brand>
      <b-collapse
        id="nav_collapse"
        is-nav
      >
        <b-navbar-nav>
          <b-nav-item to="/help">
            Help
          </b-nav-item>
          <b-nav-item @click="logout">
            Logout
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item>
            <span>{{ date | filterDate }}</span>
          </b-nav-item>
          <b-nav-form>
            <b-nav-item-dropdown right>
              <b-dropdown-item
                v-if="isNarrow()"
                @click="changeWide()"
              >
                Wide
              </b-dropdown-item>
              <b-dropdown-item
                v-else
                @click="changeWide()"
              >
                Narrow
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div :class="maybeWide()">
      <transition
        name="reach"
        mode="out-in"
      >
        <router-view />
      </transition>
    </div>

    <b-modal
      ref="loggedout"
      hide-footer
      title="Logged out"
      @hidden="cancel()"
    >
      You have been logged out by the system. Another user has logged in with the same credentials
    </b-modal>

    <footer class="footer">
      <div class="container">
        <div class="row  justify-content-center">
          <small>
            Admin &copy; 2018 eZuce
            UI: <a
              target="_blank"
              :href="ref_ui_uri()"
            >{{ refui }}</a>
            Backend: <a
              target="_blank"
              :href="ref_backend_uri()"
            >{{ refbackend }}</a>
          </small>
        </div>
      </div>
    </footer>

    <notifications
      position="bottom right"
      :speed="500"
      :duration="1000"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from '@/Role/Admin/Admin'
import AdminRoutes from '@/routes/admin'
import Help from '@/Role/Admin/Help'
import Layout from '@/Role/Layout'

const router = new VueRouter({
  routes: [
    { path: '/', component: Admin, children: AdminRoutes },
    { path: '/help', component: Help },
    { path: '*', redirect: '/' }
  ]
})

export default {
  mixins: [Layout],
  props: {
    refui: {
      type: String,
      default: ''
    },
    refbackend: {
      type: String,
      default: ''
    }
  },
  storageName: 'navBar',
  router,
  data () {
    return {
      date: null,
      path: '/'
    }
  },
  mounted () {
    this.$bus.$on('takeover', this.handleTakeOver)
  },
  beforeDestroy () {
    this.$bus.$off('takeover', this.handleTakeOver)
  },
  methods: {
    cancel () {
      this.$agent.vm.canLogout = true
      this.$agent.onDisconnect()
    },
    handleTakeOver(S) {
      this.$refs.loggedout.show()
    }
  }
}
</script>

<style lang="scss">
@import "../../node_modules/bootstrap/scss/bootstrap.scss";
</style>
