<template>
<div v-access:profile-ui v-bind:class="classObject">
  <b-row style="margin-top: 10px">
    <b-col cols=6>
      <b-row>
        <b-col cols=6>
          <h4>Available Tabs:</h4>
        </b-col>
      </b-row>
      <b-row v-for="(value, key, index) of isVisible(this.$agent.vm.agent.permissions, 'ui')" :key="index">
        <b-col>&nbsp;&nbsp;{{value}}</b-col>
      </b-row>
      <b-row style="margin-top: 15px">
        <b-col cols=6><h4>UI Features:</h4></b-col>
      </b-row>
      <b-row v-for="(value, key, index) of isVisible(this.$agent.vm.agent.permissions, 'agent-feature')" :key="index">
        <b-col>&nbsp;&nbsp;{{value}}</b-col>
      </b-row>
    </b-col>
    <b-col cols=6>
      <b-row>
        <b-col cols=6><h4>Available Widgets:</h4></b-col>
      </b-row>
      <b-row v-for="(value, key, index) of isVisible(this.$agent.vm.agent.permissions, 'widget')" :key="index">
        <b-col>&nbsp;&nbsp;{{value}}</b-col>
      </b-row>
      <b-row style="margin-top: 15px" v-if="this.$agent.role() == 'supervisor'">
        <b-col cols=6><h4>Call Features:</h4></b-col>
      </b-row>
      <b-row v-for="(value, key, index) of isVisible(this.$agent.vm.agent.permissions, 'supervisor-feature')" :key="index">
        <b-col>&nbsp;&nbsp;{{value}}</b-col>
      </b-row>
      <b-row style="margin-top: 15px">
        <b-col cols=6><h4>Agent Profile:</h4></b-col>
      </b-row>
      <b-row v-for="(value, key) of isVisible(this.$agent.vm.agent.permissions, 'agent-profile')" :key="key">
        <b-col>&nbsp;&nbsp;{{value}}</b-col>
      </b-row>
    </b-col>
  </b-row>
</div>
</template>

<script>
export default {
  name: 'agent-permissions',
  data () {
    return {
    }
  },
  methods: {
    isVisible: function (perm, type) {
      return Object.keys(perm).filter( Perm => Perm.includes(type) )
    }
  },
  computed: {
    classObject: function () {
      this.$agent.vm.storage_data["narrowScreenPermissions"] = this.$agent.vm.isNarrowLayout.permissions
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
      return {
        container: this.$agent.vm.isNarrowLayout.permissions,
        'padding-container-fluid': !this.$agent.vm.isNarrowLayout.permissions
      }
    }
  },
}
</script>
