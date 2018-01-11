<template>
  <div style="min-height: 100%; padding-bottom: 60px">
    <b-navbar class="navbar-custom fixed-top" toggleable="md" type="dark" variant="info">
      <b-nav-toggle target="nav_collapse"></b-nav-toggle>
      <b-navbar-brand to="/">HOME</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item @click="logout">LOGOUT</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <span class="navbar-text">{{ date | filterDate }}</span>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-nav class="custom-b-nav" v-bind:class="{ 'pin-nav': isPinned }" tabs>
      <b-nav-item to="/">ADMIN</b-nav-item>
      <b-nav-item-dropdown>
        <b-dropdown-header>Options for Admin tab</b-dropdown-header>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item v-if="!$agent.vm.isNarrowLayout.admin" @click="$agent.vm.isNarrowLayout.admin = true">Switch to Narrow layout</b-dropdown-item>
        <b-dropdown-item v-if="$agent.vm.isNarrowLayout.admin" @click="$agent.vm.isNarrowLayout.admin = false">Switch to Wide layout</b-dropdown-item>
      </b-nav-item-dropdown>
      <button @click="onPin" class="btn ml-auto pointer">
        <icon label="No Pined">
          <icon name="eyedropper" scale="1.0"></icon>
          <icon v-if="!isPinned" style="color:red" name="ban" scale="1.0"></icon>
        </icon>
      </button>
    </b-nav><!--container-fluid-->
    <div class="container-fluid" v-bind:class="{ 'pin-container': (isPinned) }">
      <transition name="reach" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="row  justify-content-center">
          <small>
            Supervisor &copy; 2018 eZuce
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

    import Admin from '@/Role/Supervisor/Admin'

    import AdminRoutes from '@/routes/admin'
    import moment from 'moment'

    const router = new VueRouter({
      routes: [
        { path: '/', component: Admin, children: AdminRoutes },
      ]
    })

    export default {
        props: [ 'ref_ui', 'ref_backend' ],
        storageName: 'navBar',
        router,
        data () {
          return {
            date: null,
            isPinned: false
          }
        },
        methods: {
          onPin () {
            this.isPinned = !this.isPinned
            this.$agent.vm.storage_data[this.$options.storageName+'Pinned'] = this.isPinned
            localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
          },
        },
        created: async function() {
          this.date = new Date()
          setInterval(() => this.date = new Date, 1000)
          if (this.$agent.vm.storage_data.navBarPinned != undefined)
            this.isPinned = this.$agent.vm.storage_data.navBarPinned
        },
        filters: {
          filterDate: function (date) {
            return moment(date).format('ddd[,] Do MMM YYYY[,] HH:mm:ss');
          }
        }
    }
</script>

<style lang="scss">
  //@import "../../custom-bootstrap.scss";
  @import "../../node_modules/bootstrap/scss/bootstrap.scss";
</style>

