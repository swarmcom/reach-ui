<template>
<b-dropdown text="Agent" variant="outline-primary">
  <b-dropdown-item v-for="agent in this.$agent.vm.transfer_agents" :key="agent.id" @click="onUpdate(agent.id)">{{ agent.login }}</b-dropdown-item>
</b-dropdown>
</template>

<script>
export default {
  name: 'transfer-agent',
  data () {
    return {}
  },
  methods: {
    onUpdate (agent_id) {
      this.$agent.transfer_to_agent(agent_id)
    }
  }
}
</script>
