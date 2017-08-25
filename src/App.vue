<template>
<div>
<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
  <router-link class="navbar-brand" to="/">Reach UI</router-link>
  <div class="collapse navbar-collapse" id="navbarsExampleDefault">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link class="nav-link" to="/about">About</router-link>
      </li>
    </ul>
  </div>
</nav>
<div class="container">
  <router-view></router-view>
</div>
</div>
</template>

<script>
export default {
  created() {
    this.agent = this.$parent.agent
  }
}
</script>

<style>
body {
  padding-top: 70px;
}
</style>
