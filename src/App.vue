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
    <b-nav-item to="/main">MAIN</b-nav-item>
    <b-nav-item v-access:supervisor-ui to="/profile">PROFILE</b-nav-item>
    <b-nav-item-dropdown text="Sessions">
      <b-dropdown-item to="/stats/inqueue">Inqueues</b-dropdown-item>
      <b-dropdown-item to="/stats/agent">Agents</b-dropdown-item>
    </b-nav-item-dropdown>
    <b-nav-item v-access:supervisor-ui to="/monitor">MONITOR </b-nav-item>
    <b-nav-item v-access:supervisor-ui to="/recordings">RECORDINGS </b-nav-item>
    <b-nav-item to="/reports">REPORTS</b-nav-item>
    <button @click="onPin" class="btn ml-auto pointer">
      <icon label="No Pined">
        <icon name="eyedropper" scale="1.0"></icon>
        <icon v-if="!isPinned" style="color:red" name="ban" scale="1.0"></icon>
      </icon>
    </button>
  </b-nav>
  <div class="container" v-bind:class="{ 'pin-container': (isPinned && auth) }">
    <router-view></router-view>
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
    loadDataStorage(name) {
      if(localStorage.getItem(name)) {
        this.$agent.vm.storage_data = JSON.parse(localStorage.getItem(name));
        if (this.$agent.vm.storage_data.navBarPinned != undefined)
          this.isPinned = this.$agent.vm.storage_data.navBarPinned
      }
    }
  },
  created: async function() {
    this.ref_ui = window.version.ui == 'REF_UI'? 'HEAD' : window.version.ui
    this.$bus.$on('agent-auth', this.handleAuth)
    this.date = new Date()
    setInterval(() => this.date = new Date, 1000)
    this.loadDataStorage("reach-ui")
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
</style>

