<template>
<div>
  <nav class="navbar navbar-expand-md fixed-top navbar-custom">
    <div v-if="auth" class="navbar-collapse collapse" id="navbarCustom">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/">HOME</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" v-on:click.native="logout" to="/">LOGOUT</router-link>
        </li>
      </ul>
      <span class="navbar-text">{{ date | filterDate }}</span>
    </div>
  </nav>
  <b-nav v-if="auth" class="custom-b-nav" tabs>
    <b-nav-item to="/">MAIN</b-nav-item>
    <b-nav-item to="/admin/agents">ADMIN</b-nav-item>
    <b-nav-item to="/monitor">MONITOR </b-nav-item>
    <b-nav-item to="/help">Help</b-nav-item>
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

