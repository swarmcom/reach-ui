<template>
<div>
<nav v-if="auth" class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
  <router-link class="navbar-brand" to="/">Reach UI</router-link>
  <div class="collapse navbar-collapse" id="navbars">
    <ul class="navbar-nav mr-auto">

      <li class="nav-item">
        <router-link class="nav-link" to="/profile">Profile</router-link>
      </li>

      <li v-access:admin-ui class="nav-item">
        <router-link class="nav-link" to="/admin/agents">Admin</router-link>
      </li>

      <b-nav-item-dropdown v-access:supervisor-ui text="Sessions">
        <b-dropdown-item to="/stats/inqueue">Inqueues</b-dropdown-item>
        <b-dropdown-item to="/stats/agent">Agents</b-dropdown-item>
      </b-nav-item-dropdown>

      <li v-access:supervisor-ui class="nav-item">
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

<footer class="footer">
  <div class="container">
    <div class="row  justify-content-center">
      <span class="text-muted">
        &copy; 2017 eZuce
        UI: <a :href="ref_ui_uri()">{{ ref_ui }}</a>
      </span>
    </div>
  </div>
</footer>

<notifications position="bottom right" :speed="500" :duration="1000"/>

</div>
</template>

<script>
export default {
  data () {
    return {
      ref_ui: '',
      ref_backend: '',
      auth: false
    }
  },
  methods: {
    ref_ui_uri () {
      return `https://github.com/swarmcom/reach-ui/commit/${this.ref_ui}`
    },
    ref_backend_uri () {
      return `https://github.com/ezuce/reach3/commit/${this.ref_backend}`
    }

  },
  created () {
    this.ref_ui = window.version.ui
    this.$bus.$on('agent-auth', (Auth) => this.auth = Auth)
  }
}
</script>

<style>
#navbars > span {
  color: white;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #f5f5f5;
}
.footer > .container {
  padding-right: 15px;
  padding-left: 15px;
}
</style>
