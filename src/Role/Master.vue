<template>
  <div style="min-height: 100%; padding-bottom: 60px">
    <b-navbar class="navbar-custom fixed-top" toggleable="md" type="dark" variant="info">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand to="/">{{ this.$agent.vm.agent.name}}</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item-dropdown text="Instance">
            <b-dropdown-item to="/kam/nodes">Nodes</b-dropdown-item>
            <b-dropdown-item to="/kam/domains">Domains</b-dropdown-item>
            <b-dropdown-item to="/kam/registry">Registry</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item to="/params">Parameters</b-nav-item>
          <b-nav-item @click="logout">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container-fluid" style="margin-top: 20px">
      <transition name="reach" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="row justify-content-center">
          <small>
            Agent &copy; 2018 eZuce
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

import Main from '@/Role/Master/Main'
import Help from '@/Role/Master/Help'
import Kam from '@/Role/Master/Kam'
import KamRoutes from '@/routes/kam'
import Params from '@/Role/Master/Params'

const router = new VueRouter({
  routes: [
    { path: '/kam', component: Kam, children: KamRoutes },
    { path: '/params', component: Params },
    { path: '/help', component: Help, name: 'help' },
    { path: '/', component: Main }
  ]
})

export default {
  props: [ 'ref_ui', 'ref_backend' ],
  router
}
</script>

<style lang="scss">
@import "../../node_modules/bootstrap/scss/bootstrap.scss";
</style>
