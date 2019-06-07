<template>
  <div style="min-height: 100%; padding-bottom: 60px">
    <b-navbar
      class="navbar-custom fixed-top"
      toggleable="md"
      type="dark"
      variant="info"
    >
      <b-nav-toggle target="nav_collapse" />
      <b-navbar-brand to="/main">
        {{ this.$agent.vm.agent.name }}
      </b-navbar-brand>
      <b-collapse
        id="nav_collapse"
        is-nav
      >
        <b-navbar-nav>
          <b-nav-item
            v-access:profile-ui
            to="/profile"
          >
            Profile
          </b-nav-item>
          <b-nav-item
            v-access:monitor-ui
            to="/live"
          >
            Monitor
          </b-nav-item>
          <b-nav-item
            v-access:reports-ui
            to="/reports"
          >
            Reports
          </b-nav-item>
          <b-nav-item to="/help">
            Help
          </b-nav-item>
          <b-nav-item @click="logout">
            Logout
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item>
            <span>
              {{ date | filterDate }}
            </span>
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
              <template v-if="isMain()">
                <template v-if="canMyStat()">
                  <b-dropdown-item
                    v-if="isMyStat()"
                    @click="changeWidget('isActiveMS')"
                  >
                    Remove My Stats
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-else
                    @click="changeWidget('isActiveMS')"
                  >
                    Add My Stats
                  </b-dropdown-item>
                </template>
                <template v-if="canCallDetails()">
                  <b-dropdown-item
                    v-if="isCallDetails()"
                    @click="changeWidget('isActiveCD')"
                  >
                    Remove Call Details
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-else
                    @click="changeWidget('isActiveCD')"
                  >
                    Add Call Details
                  </b-dropdown-item>
                </template>
                <template v-if="canAgentManager()">
                  <b-dropdown-item
                    v-if="isAgentManager()"
                    @click="changeWidget('isActiveAM')"
                  >
                    Remove Agent Manager
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-else
                    @click="changeWidget('isActiveAM')"
                  >
                    Add Agent Manager
                  </b-dropdown-item>
                </template>
                <template v-if="canQueueManager()">
                  <b-dropdown-item
                    v-if="isQueueManager()"
                    @click="changeWidget('isActiveQM')"
                  >
                    Remove Queue Manager
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-else
                    @click="changeWidget('isActiveQM')"
                  >
                    Add Queue Manager
                  </b-dropdown-item>
                </template>
              </template>
            </b-nav-item-dropdown>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal
      ref="loggedout"
      hide-footer
      title="Logged out"
      @hidden="cancel()"
    >
      You have been logged out by the system. Another user has logged in with the same credentials
    </b-modal>
    <div :class="maybeWide()">
      <transition
        name="reach"
        mode="out-in"
      >
        <router-view />
      </transition>
    </div>
    <footer class="footer">
      <b-container>
        <b-row class="justify-content-center">
          <small>
            Supervisor &copy; 2019 eZuce
            UI: <a
              target="_blank"
              :href="ref_ui_uri()"
            >{{ refui }}</a>
            Backend: <a
              target="_blank"
              :href="ref_backend_uri()"
            >{{ refbackend }}</a>
          </small>
        </b-row>
      </b-container>
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

import Help from '@/Role/Supervisor/Help'
import Main from '@/Role/Supervisor/Main'
import Profile from '@/Role/Agent/Profile'
import Reports from '@/Role/Supervisor/Reports'

import ProfileRoutes from '@/routes/profile'
import ReportRoutes from '@/routes/report'
import Layout from '@/Role/Layout'
import Live from '@/Role/Supervisor/Live'
import LiveRoutes from '@/routes/live'

const scrollBehavior = (to, from, savedPosition) => {
  return { x: 0, y: 0 }
}

const router = new VueRouter({
  scrollBehavior,
  routes: [
    { path: '/main', component: Main },
    { path: '/profile', component: Profile, children: ProfileRoutes },
    { path: '/help', component: Help },
    { path: '/live', component: Live, children: LiveRoutes },
    { path: '/reports', component: Reports, children: ReportRoutes },
    { path: '/', redirect: 'main' }
  ]
})

export default {
  mixins: [Layout],
  props: {
    'refui': {
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
      path: '/main'
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
    },
  },
}
</script>

<style lang="scss">
//
@import "../../node_modules/bootstrap/scss/bootstrap.scss";
</style>

