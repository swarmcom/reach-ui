<template>
<div v-bind:class="classObject">
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
    <b-dropdown-item to="/admin/tag_groups">Skill groups</b-dropdown-item>
    <b-dropdown-item to="/admin/tags">Skills</b-dropdown-item>
    <b-dropdown-item to="/admin/roles">Roles</b-dropdown-item>
    <b-dropdown-item to="/admin/releases">Release Types</b-dropdown-item>
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
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenAdmin"] = this.$agent.vm.isNarrowLayout.admin
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.admin,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.admin
      }
    }
  },
}
</script>

<style>
</style>
