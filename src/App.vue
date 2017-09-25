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
      <span class="navbar-text" v-if="auth">{{ this.$agent.vm.agent.login }}</span>
    </div>
  </nav>
  <b-nav v-if="auth" style="background: #EFF1F1; font-weight: bold; color:#666" tabs>
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
export default {
  data () {
    return {
      auth: false
    }
  },
  methods: {
    logout () { this.$agent.logout() }
  },
  created () {
    this.$bus.$on('agent-auth', (Auth) => this.auth = Auth)
  }
}
</script>

<style>
body {
  padding-top: 45px;
}
.navbar-custom {
  height: 45px;
  background: rgb(46,143,177); /* Old browsers */
  background: -moz-linear-gradient(top,  rgba(46,143,177,1) 0%, rgba(33,134,169,1) 53%, rgba(13,119,153,1) 100%); /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(46,143,177,1)), color-stop(53%,rgba(33,134,169,1)), color-stop(100%,rgba(13,119,153,1))); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top,  rgba(46,143,177,1) 0%,rgba(33,134,169,1) 53%,rgba(13,119,153,1) 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top,  rgba(46,143,177,1) 0%,rgba(33,134,169,1) 53%,rgba(13,119,153,1) 100%); /* Opera 11.10+ */
  background: -ms-linear-gradient(top,  rgba(46,143,177,1) 0%,rgba(33,134,169,1) 53%,rgba(13,119,153,1) 100%); /* IE10+ */
  background: linear-gradient(top,  rgba(46,143,177,1) 0%,rgba(33,134,169,1) 53%,rgba(13,119,153,1) 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#2e8fb1', endColorstr='#0d7799',GradientType=0 ); /* IE6-9 */
}
/* change the brand and text color */
.navbar-custom .navbar-text {
    color: rgba(255,255,255,.8);
}
.navbar-custom .navbar-nav .nav-link {
    color: rgba(255,255,255,.5);
}
/* change the color of active or hovered links */
.navbar-custom .nav-item.active .nav-link,
.navbar-custom .nav-item:hover .nav-link {
    color: #ffffff;
}

#navbars > span {
  color: white;
}
</style>
