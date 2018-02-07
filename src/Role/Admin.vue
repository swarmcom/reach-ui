<template>
  <div style="min-height: 100%; padding-bottom: 60px">

  <b-navbar class="navbar-custom fixed-top" toggleable="md" type="dark" variant="info">
    <b-nav-toggle target="nav_collapse"></b-nav-toggle>
    <b-navbar-brand to="/">{{ this.$agent.vm.agent.name}}</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item to="/help">Help</b-nav-item>
      <b-nav-item @click="logout">Logout</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-nav-item>
        <span>{{ date | filterDate }}</span>
      </b-nav-item>
      <b-nav-form>
        <b-nav-item-dropdown right>
          <b-dropdown-item v-if="isNarrow()" @click="changeLayout()">Wide</b-dropdown-item>
          <b-dropdown-item v-else @click="changeLayout()">Narrow</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav-form>
    </b-navbar-nav>
  </b-navbar>

  <div class="container-fluid">
    <transition name="reach" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>

  <footer class="footer">
    <div class="container">
      <div class="row  justify-content-center">
        <small>
          Admin &copy; 2018 eZuce
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
import Admin from '@/Role/Admin/Admin'
import AdminRoutes from '@/routes/admin'
import Layout from '@/Role/Layout'

const router = new VueRouter({
  routes: [
    { path: '/', component: Admin, children: AdminRoutes },
  ]
})

export default {
  props: [ 'ref_ui', 'ref_backend' ],
  storageName: 'navBar',
  mixins: [Layout],
  router,
  data () {
    return {
      date: null,
      page: ''
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import "../../node_modules/bootstrap/scss/bootstrap.scss";
</style>
