<template>
<div>
  <b-navbar class="navbar-custom fixed-top" toggleable="md" type="dark" variant="info">
    <b-nav-toggle v-if="auth" target="nav_collapse"></b-nav-toggle>
    <b-navbar-brand v-if="auth" to="/main">HOME</b-navbar-brand>
    <b-collapse v-if="auth" is-nav id="nav_collapse">
      <b-nav is-nav-bar>
        <b-nav-item @click="logout">LOGOUT</b-nav-item>
      </b-nav>
      <!-- Right aligned nav items -->
      <b-nav is-nav-bar class="ml-auto">
        <span class="navbar-text">{{ date | filterDate }}</span>
      </b-nav>
    </b-collapse>
  </b-navbar>
  <b-nav v-if="auth" class="custom-b-nav" v-bind:class="{ 'pin-nav': isPinned }" tabs>
    <b-nav-item to="/admin/agents">ADMIN</b-nav-item>
    <b-nav-item to="/main">MAIN</b-nav-item>
    <b-nav-item to="/stats">STATS </b-nav-item>
    <b-nav-item to="/monitor">MONITOR </b-nav-item>
    <b-nav-item to="/reports">REPORTS</b-nav-item>
    <button @click="onPin" class="btn ml-auto">
      <icon label="No Pined">
        <icon name="eyedropper" scale="1.0"></icon>
        <icon v-if="!isPinned" style="color:red" name="ban" scale="1.0"></icon>
      </icon>
    </button>
  </b-nav>
  <div class="container" v-bind:class="{ 'pin-container': (isPinned && auth) }">
    <router-view></router-view>
  </div>
  <notifications position="bottom right" :speed="500" :duration="1000"/>
</div>
</template>

<script>
import moment from 'moment'
export default {
  storageName: 'navBar',
  data () {
    return {
      auth: false,
      date: null,
      isPinned: false
    }
  },
  methods: {
    logout () { this.$agent.logout() },
    onPin () {
      this.isPinned = !this.isPinned
      this.$agent.vm.storage_data[this.$options.storageName+'Pinned'] = this.isPinned
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    },
    loadDataStorage(name) {
      if(localStorage.getItem(name)) {
        this.$agent.vm.storage_data = JSON.parse(localStorage.getItem(name));
        if (this.$agent.vm.storage_data.navBarPinned != undefined)
          this.isPinned = this.$agent.vm.storage_data.navBarPinned
      }
    }
  },
  created () {
    this.$bus.$on('agent-auth', (Auth) => this.auth = Auth)
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

