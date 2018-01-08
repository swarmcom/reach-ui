<template>
<div style="min-height: 100%; padding-top: 70px; padding-bottom: 60px">
<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
  <router-link class="navbar-brand" to="/">Reach UI</router-link>
  <div class="collapse navbar-collapse" id="navbars">
    <ul class="navbar-nav mr-auto">
      <b-nav-item-dropdown text="Instance">
        <b-dropdown-item to="/kam/nodes">Nodes</b-dropdown-item>
        <b-dropdown-item to="/kam/domains">Domains</b-dropdown-item>
        <b-dropdown-item to="/kam/registry">Registry</b-dropdown-item>
      </b-nav-item-dropdown>
    </ul>
    <span class="navbar-text" style="margin-right: 20px">{{ this.$agent.vm.agent.login }}</span>
    <button @click="logout" class="btn btn-sm btn-outline-danger">Logout</button>
  </div>
</nav>
<div class="container">
  <transition name="reach" mode="out-in">
    <router-view></router-view>
  </transition>
</div>

<footer class="footer">
  <div class="container">
    <div class="row justify-content-center">
      <small>
        &copy; 2018 eZuce
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
import Vue from 'vue'
import VueRouter from 'vue-router'

import Help from '@/Help'
import Kam from '@/Kam'
import KamRoutes from '@/routes/kam'

const router = new VueRouter({
  routes: [
    { path: '/kam', component: Kam, children: KamRoutes },
    { path: '/', component: Help }
  ]
})

export default {
  props: [ 'ref_ui', 'ref_backend' ],
  router,
  methods: {
    ref_ui_uri () {
      return `https://github.com/swarmcom/reach-ui/commit/${this.ref_ui}`
    },
    ref_backend_uri () {
      return `https://github.com/ezuce/reach3/commit/${this.ref_backend}`
    },
    logout () { this.$agent.logout() }
  },
}
</script>

<style lang="scss">
@import "./custom-bootstrap.scss";
@import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>
