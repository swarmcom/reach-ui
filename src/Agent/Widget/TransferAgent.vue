<template>
<b-dropdown size="sm" text="Agent" variant="outline-primary" :disabled=disable() :title=hover_message @mouseover.native="mouseOver">
  <b-dropdown-item v-for="agent in this.$agent.vm.transfer_agents" :key="agent.id" @click="onUpdate(agent.id)">{{ agent.login }}</b-dropdown-item>
</b-dropdown>
</template>

<script>
export default {
  name: 'transfer-agent',
  data () {
    return {
      hover_message: '',
      active: false
    }
  },
  methods: {
    onUpdate (agent_id) {
      this.$agent.transfer_to_agent(agent_id)
    },
    mouseOver: function(){
      if (this.$agent.vm.transfer_agents.length > 0)
        this.hover_message = ''
      else
        this.hover_message = 'No Other Agents'
    },
    disable: function () {
      if (this.$agent.vm.transfer_agents.length > 0)
        return false
      else {
        return true
      }
    }
  }
}
</script>
