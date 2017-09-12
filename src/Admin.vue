<template>
<div>
<ul class="nav nav-tabs">
  <li class="nav-item">
    <router-link class="nav-link" style="color:#42b983" to="/admin/agents">Agents</router-link>
  </li>
  <li class="nav-item greenColor">
    <router-link class="nav-link" style="color:#42b983" to="/admin/profiles">Profiles</router-link>
  </li>
  <li class="nav-item greenColor">
    <router-link class="nav-link" style="color:#42b983" to="/admin/queues">Queues</router-link>
  </li>
  <li class="nav-item greenColor">
    <router-link class="nav-link" style="color:#42b983" to="/admin/groups">Groups</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" style="color:#42b983" to="/admin/params">Params</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" style="color:#42b983" to="/admin/releases">Releases</router-link>
  </li>
</ul>
<router-view style="margin-top: 20px"></router-view>
</div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>