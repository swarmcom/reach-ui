<template>
<b-dropdown text="Agent" variant="outline-primary">
  <div v-if="this.$agent.vm.transfer_agents.length > 0">
    <b-dropdown-item v-for="agent in this.$agent.vm.transfer_agents" :key="agent.id" @click="onUpdate(agent.id)">{{ agent.login }}</b-dropdown-item>
  </div>
  <div v-else>
    <b-dropdown-item>No Other Agents</b-dropdown-item>
  </div>
</b-dropdown>
</template>

<script>
export default {
  name: 'conference-agent',
  data () {
    return {}
  },
  methods: {
    onUpdate (agent_id) {
      this.$agent.conference_to_agent(agent_id)
    }
  }
}
</script>
