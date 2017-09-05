<template>
<b-dropdown id="ddown1" text="Transfer to agent" variant="outline-primary">
  <b-dropdown-item v-for="agent in agents" :key="agent.agent_id" @click="onUpdate(agent.agent_id)">{{ agent.login }}</b-dropdown-item>
</b-dropdown>
</template>

<script>
export default {
  name: 'transfer-agent',
  data () {
    return {
      agents: []
    }
  },
  methods: {
    query () {
      this.$agent.get_transfer_agents(Obj => this.agents = Obj.reply)
    },
    onUpdate (agent_id) {
      this.$agent.transfer_to_agent(agent_id)
    }
  },
  mounted () {
    this.query()
  }
}
</script>