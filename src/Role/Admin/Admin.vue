<template>
<div>
<ul class="nav nav-tabs">

  <b-nav-item-dropdown text="Agents">
    <b-dropdown-item to="/agents">Agents</b-dropdown-item>
    <b-dropdown-item to="/agent_groups">Groups</b-dropdown-item>
    <b-dropdown-item to="/agent/persistent">Persistent</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Queues">
    <b-dropdown-item to="/queues">Queues</b-dropdown-item>
    <b-dropdown-item to="/queue_groups">Groups</b-dropdown-item>
    <b-dropdown-item to="/recipes">Recipes</b-dropdown-item>
  </b-nav-item-dropdown>

  <li class="nav-item">
    <router-link class="nav-link" to="/clients">Clients</router-link>
  </li>

  <b-nav-item-dropdown text="Config">
    <b-dropdown-item to="/luas">Lua actions</b-dropdown-item>
    <b-dropdown-item to="/tags">Skills</b-dropdown-item>
    <b-dropdown-item to="/roles">Roles</b-dropdown-item>
    <b-dropdown-item to="/acls">Access lists</b-dropdown-item>
    <b-dropdown-item to="/releases">Release Groups</b-dropdown-item>
    <b-dropdown-item to="/dispositions">Disposition Groups</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Sounds">
    <b-dropdown-item to="/prompts">Prompts</b-dropdown-item>
    <b-dropdown-item to="/mohs">MOHs</b-dropdown-item>
  </b-nav-item-dropdown>

  <b-nav-item-dropdown text="Lines">
    <b-dropdown-item to="/dialplan">Inbound routing</b-dropdown-item>
    <b-dropdown-item to="/line_ins">Lines In</b-dropdown-item>
    <b-dropdown-item to="/line_outs">Lines Out</b-dropdown-item>
  </b-nav-item-dropdown>

  <li class="nav-item">
    <router-link class="nav-link" to="/params">Params</router-link>
  </li>

  <li class="nav-item">
    <router-link class="nav-link" to="/license">License</router-link>
  </li>

</ul>
<transition name="reach" mode="out-in">
  <router-view style="margin-top: 20px"></router-view>
</transition>
</div>
</template>

<script>
export default {
  data () {
    return {}
  },
}
</script>

<style>
</style>
