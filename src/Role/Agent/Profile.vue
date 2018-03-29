<template>
<div v-access:profile-ui class="form" v-bind:class="classObject">
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <router-link class="nav-link" to="/profile/properties">Properties</router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" to="/profile/permissions">Permissions</router-link>
    </li>
  </ul>
  <transition name="reach" mode="out-in">
    <router-view style="margin-top: 20px"></router-view>
  </transition>
</div>
</template>

<script>
export default {
  name: 'agent-profile',
  data () {
    return {
    }
  },
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenProfile"] = this.$agent.vm.isNarrowLayout.profile
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.profile,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.profile
      }
    }
  }
}
</script>
