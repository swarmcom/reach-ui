<template>
<div>
<nav v-if="auth" class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
  <router-link class="navbar-brand" to="/">Reach UI</router-link>
  <div class="collapse navbar-collapse" id="navbars">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link class="nav-link" to="/admin/agents">Admin</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/monitor">Monitor</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/help">Help</router-link>
      </li>
    </ul>
    <span class="navbar-text" v-if="auth">{{ this.$agent.vm.agent.login }}</span>
    </li>
  </div>
</nav>
<div class="container">
  <router-view></router-view>
</div>
<notifications position="bottom right" :speed="500" :duration="1000"/>
</div>
</template>

<script>
export default {
  data () {
    return {
      auth: false
    }
  },
  created () {
    this.$bus.$on('agent-auth', (Auth) => this.auth = Auth)
  }
}
</script>

<style>
body {
  padding-top: 70px;
}
#navbars > span {
  color: white;
}
</style>
