<template>
<b-dropdown id="ddown1" text="Conference to agent" variant="outline-primary">
  <b-dropdown-item v-for="agent in agents" :key="agent.agent_id" @click="onUpdate(agent.agent_id)">{{ agent.login }}</b-dropdown-item>
</b-dropdown>
</template>

<script>
export default {
  name: 'conference-agent',
  data () {
    return {
      agents: []
    }
  },
  methods: {
    query: async function () {
      this.agents = await this.$agent.p_call('get_transfer_agents')
    },
    onUpdate (agent_id) {
      this.$agent.conference_to_agent(agent_id)
    }
  },
  mounted () {
    this.query()
  }
}
</script>