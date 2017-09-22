<template>
<div>
<ul class="nav nav-tabs">
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/agents">Agents</router-link>
  </li>
  <li class="nav-item greenColor">
    <router-link class="nav-link" to="/admin/agent_groups">Agent Groups</router-link>
  </li>
  <li class="nav-item greenColor">
    <router-link class="nav-link" to="/admin/queues">Queues</router-link>
  </li>
  <li class="nav-item greenColor">
    <router-link class="nav-link" to="/admin/groups">Groups</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/params">Params</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/releases">Releases</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/clients">Clients</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/line_ins">Line In</router-link>
  </li>
  <li class="nav-item">
    <router-link class="nav-link" to="/admin/line_outs">Line Out</router-link>
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