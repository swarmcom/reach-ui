<template>
<div>
<ul class="nav nav-tabs">

  <b-nav-item-dropdown text="Agents">
    <b-dropdown-item to="/admin/agents">Agents</b-dropdown-item>
    <b-dropdown-item to="/admin/agent_groups">Groups</b-dropdown-item>
    <b-dropdown-item to="/admin/agent/persistent">Persistent</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Queues">
    <b-dropdown-item to="/admin/queues">Queues</b-dropdown-item>
    <b-dropdown-item to="/admin/queue_groups">Groups</b-dropdown-item>
    <b-dropdown-item to="/admin/recipes">Recipes</b-dropdown-item>
  </b-nav-item-dropdown>

  <li class="nav-item">
    <router-link class="nav-link" to="/admin/clients">Clients</router-link>
  </li>

  <b-nav-item-dropdown text="Config">
    <b-dropdown-item to="/admin/luas">Lua actions</b-dropdown-item>
    <b-dropdown-item to="/admin/releases">Releases</b-dropdown-item>
    <b-dropdown-item to="/admin/dispositions">Dispositions</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Sounds">
    <b-dropdown-item to="/admin/prompts">Prompts</b-dropdown-item>
    <b-dropdown-item to="/admin/mohs">MOHs</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Lines">
    <b-dropdown-item to="/admin/dialplan">Dialplan</b-dropdown-item>
    <b-dropdown-item to="/admin/line_ins">Lines In</b-dropdown-item>
    <b-dropdown-item to="/admin/line_outs">Lines Out</b-dropdown-item>
  </b-nav-item-dropdown>

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
