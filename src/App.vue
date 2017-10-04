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
  <b-nav v-if="auth" class="custom-b-nav" tabs>
    <b-nav-item to="/admin/agents">ADMIN</b-nav-item>
    <b-nav-item to="/main">MAIN</b-nav-item>
    <b-nav-item to="/monitor">MONITOR </b-nav-item>
    <b-nav-item to="/reports">REPORTS</b-nav-item>
  </b-nav>
  <div class="container">
    <router-view></router-view>
  </div>
  <notifications position="bottom right" :speed="500" :duration="1000"/>
</div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      auth: false,
      date: null
    }
  },
  methods: {
    logout () { this.$agent.logout() }
  },
  created () {
    this.$bus.$on('agent-auth', (Auth) => this.auth = Auth)
    this.date = new Date()
    setInterval(() => this.date = new Date, 1000)
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

