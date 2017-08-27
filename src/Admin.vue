<template>
<div>
<ul class="nav nav-tabs">
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/agents">Agents</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/profiles">Profiles</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/queues">Queues</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/groups">Groups</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/params">Params</router-link>
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