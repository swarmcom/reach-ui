<template>
  <div style="min-height: 100%; padding-top: 70px; padding-bottom: 60px">
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <router-link class="navbar-brand" to="/">Reach UI</router-link>
      <div class="collapse navbar-collapse" id="navbars">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/help">Help</router-link>
          </li>
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
  import Help from '@/Role/Supervisor/Help'
  import Admin from '@/Role/Supervisor/Admin'
  import AdminRoutes from '@/routes/admin'
  const router = new VueRouter({
    routes: [
      { path: '/', component: Admin, children: AdminRoutes },
      { path: '/help', component: Help },
      { path: '*', redirect: '/' }
    ]
  })
  export default {
    props: [ 'ref_ui', 'ref_backend' ],
    router
  }
</script>

<style lang="scss">
  @import "../../../custom-bootstrap.scss";
  @import "../../../node_modules/bootstrap/scss/bootstrap.scss";
</style>