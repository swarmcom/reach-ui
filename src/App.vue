<template>
<div style="min-height: 100%; padding-bottom: 60px">
  <b-navbar class="navbar-custom fixed-top" toggleable="md" type="dark" variant="info">
    <b-nav-toggle v-if="auth" target="nav_collapse"></b-nav-toggle>
    <b-navbar-brand v-if="auth" to="/main">HOME</b-navbar-brand>
    <b-collapse v-if="auth" is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item @click="logout">LOGOUT</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <span class="navbar-text">{{ date | filterDate }}</span>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <b-nav v-if="auth" class="custom-b-nav" v-bind:class="{ 'pin-nav': isPinned }" tabs>
    <b-nav-item v-access:admin-ui to="/admin/agents">ADMIN</b-nav-item>
    <b-nav-item-dropdown v-access:supervisor-ui>
      <b-dropdown-header>Options for Admin tab</b-dropdown-header>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item v-if="!$agent.vm.isNarrowLayout.admin" @click="$agent.vm.isNarrowLayout.admin = true">Switch to Narrow layout</b-dropdown-item>
      <b-dropdown-item v-if="$agent.vm.isNarrowLayout.admin" @click="$agent.vm.isNarrowLayout.admin = false">Switch to Wide layout</b-dropdown-item>
    </b-nav-item-dropdown>
    <b-nav-item to="/main">MAIN</b-nav-item>
    <b-nav-item-dropdown>
      <b-dropdown-header>Options for Main tab</b-dropdown-header>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item v-if="!$agent.vm.isNarrowLayout.main" @click="$agent.vm.isNarrowLayout.main = true">Switch to Narrow layout</b-dropdown-item>
      <b-dropdown-item v-if="$agent.vm.isNarrowLayout.main" @click="$agent.vm.isNarrowLayout.main = false">Switch to Wide layout</b-dropdown-item>
      <b-dropdown-item v-if="!$agent.vm.layoutSM.isActiveMS" @click="onWidgetMSChange(true)">Add My Statistics</b-dropdown-item>
      <b-dropdown-item v-if="$agent.vm.layoutSM.isActiveMS" @click="onWidgetMSChange(false)">Remove My Statistics</b-dropdown-item>
      <b-dropdown-item v-access:supervisor-ui v-if="!$agent.vm.layoutSM.isActiveAM" @click="onWidgetAMChange(true)">Add Agent Manager</b-dropdown-item>
      <b-dropdown-item v-access:supervisor-ui v-if="$agent.vm.layoutSM.isActiveAM" @click="onWidgetAMChange(false)">Remove Agent Manager</b-dropdown-item>
      <b-dropdown-item v-access:supervisor-ui v-if="!$agent.vm.layoutSM.isActiveQM" @click="onWidgetQMChange(true)">Add Queue Manager</b-dropdown-item>
      <b-dropdown-item v-access:supervisor-ui v-if="$agent.vm.layoutSM.isActiveQM" @click="onWidgetQMChange(false)">Remove Queue Manager</b-dropdown-item>
    </b-nav-item-dropdown>
    <b-nav-item v-access:supervisor-ui to="/profile">PROFILE</b-nav-item>
    <b-nav-item-dropdown v-access:supervisor-ui>
      <b-dropdown-header>Options for Profile tab</b-dropdown-header>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item v-if="!$agent.vm.isNarrowLayout.profile" @click="$agent.vm.isNarrowLayout.profile = true">Switch to Narrow layout</b-dropdown-item>
      <b-dropdown-item v-if="$agent.vm.isNarrowLayout.profile" @click="$agent.vm.isNarrowLayout.profile = false">Switch to Wide layout</b-dropdown-item>
    </b-nav-item-dropdown>
    <b-nav-item v-access:supervisor-ui to="/monitor">MONITOR </b-nav-item>
    <b-nav-item-dropdown v-access:supervisor-ui>
      <b-dropdown-header>Options for Monitor tab</b-dropdown-header>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item v-if="!$agent.vm.isNarrowLayout.monitor" @click="$agent.vm.isNarrowLayout.monitor = true">Switch to Narrow layout</b-dropdown-item>
      <b-dropdown-item v-if="$agent.vm.isNarrowLayout.monitor" @click="$agent.vm.isNarrowLayout.monitor = false">Switch to Wide layout</b-dropdown-item>
    </b-nav-item-dropdown>
    <b-nav-item v-access:supervisor-ui to="/recordings">RECORDINGS </b-nav-item>
    <b-nav-item-dropdown v-access:supervisor-ui>
      <b-dropdown-header>Options for Recordings tab</b-dropdown-header>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item v-if="!$agent.vm.isNarrowLayout.recordings" @click="$agent.vm.isNarrowLayout.recordings = true">Switch to Narrow layout</b-dropdown-item>
      <b-dropdown-item v-if="$agent.vm.isNarrowLayout.recordings" @click="$agent.vm.isNarrowLayout.recordings = false">Switch to Wide layout</b-dropdown-item>
    </b-nav-item-dropdown>
    <b-nav-item-dropdown v-access:supervisor-ui text="REPORTS">
      <b-dropdown-item to="/report/agents/states">Agents man-hours</b-dropdown-item>
      <b-dropdown-item to="/report/agents/unique">Unique agents</b-dropdown-item>
      <b-dropdown-item to="/report/agents/avg">Agents averages</b-dropdown-item>
      <b-dropdown-item to="/report/measures/avg">Measures averages</b-dropdown-item>
      <b-dropdown-item to="/report/sessions/inqueue">Call sessions</b-dropdown-item>
      <b-dropdown-item to="/report/sessions/agent">Agent sessions</b-dropdown-item>
    </b-nav-item-dropdown>
    <b-nav-item-dropdown v-access:supervisor-ui text="INSTANCE">
      <b-dropdown-item to="/kam/nodes">Nodes</b-dropdown-item>
      <b-dropdown-item to="/kam/domains">Domains</b-dropdown-item>
      <b-dropdown-item to="/kam/registry">Registry</b-dropdown-item>
    </b-nav-item-dropdown>
    <button @click="onPin" class="btn ml-auto pointer">
      <icon label="No Pined">
        <icon name="eyedropper" scale="1.0"></icon>
        <icon v-if="!isPinned" style="color:red" name="ban" scale="1.0"></icon>
      </icon>
    </button>
  </b-nav><!--container-fluid-->
  <div class="container-fluid" v-bind:class="{ 'pin-container': (isPinned && auth) }">
    <transition name="reach" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>

  <footer class="footer">
    <div class="container">
      <div class="row  justify-content-center">
        <small>
          &copy; 2017 eZuce
          UI: <a target="_blank" :href="ref_ui_uri()">{{ ref_ui }}</a>
          Backend: <a target="_blank" :href="ref_backend_uri()">{{ ref_backend }}</a>
        </small>
      </div>
    </div>
  </footer>

  <notifications position="bottom right" :speed="500" :duration="1000"/>
</div>
</template>

<script>
import moment from 'moment'
export default {
  storageName: 'navBar',
  data () {
    return {
      ref_ui: 'HEAD',
      ref_backend: 'HEAD',
      auth: false,
      date: null,
      isPinned: false
    }
  },
  methods: {
    ref_ui_uri () {
      return `https://github.com/swarmcom/reach-ui/commit/${this.ref_ui}`
    },
    logout () { this.$agent.logout() },
    onPin () {
      this.isPinned = !this.isPinned
      this.$agent.vm.storage_data[this.$options.storageName+'Pinned'] = this.isPinned
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    },
    ref_backend_uri () {
     return `https://github.com/ezuce/reach3/commit/${this.ref_backend}`
    },
    handleAuth: async function (Auth) {
     this.auth = Auth
     let backend = await this.$agent.p_mfa('ws_misc', 'version', [])
     this.ref_backend = backend.version
    },
    onWidgetMSChange( state) {
      this.$agent.vm.layoutSM.isActiveMS = state
      this.$agent.vm.storage_data.isActiveMS = state
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    },
    onWidgetAMChange( state) {
      this.$agent.vm.layoutSM.isActiveAM = state
      this.$agent.vm.storage_data.isActiveAM = state
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    },
    onWidgetQMChange( state) {
      this.$agent.vm.layoutSM.isActiveQM = state
      this.$agent.vm.storage_data.isActiveQM = state
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    }
  },
  created: async function() {
    this.ref_ui = window.version.ui == 'REF_UI'? 'HEAD' : window.version.ui
    this.$bus.$on('agent-auth', this.handleAuth)
    this.date = new Date()
    setInterval(() => this.date = new Date, 1000)
    if (this.$agent.vm.storage_data.navBarPinned != undefined)
      this.isPinned = this.$agent.vm.storage_data.navBarPinned
  },
  filters: {
    filterDate: function (date) {
      return moment(date).format('ddd[,] Do MMM YYYY[,] HH:mm:ss');
    }
  }
}
</script>

<style lang="scss">
  @import "custom.scss";
  //@import "./custom-bootstrap.scss";
  @import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>

