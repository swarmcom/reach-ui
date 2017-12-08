<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentManager" class="mt-2">
    <agent-groups :agents="agents"></agent-groups>
    <agent-monitor :agents="agents" :groups="groups"></agent-monitor>
  </b-collapse>
</div>
</template>

<script>
import AgentGroups from '@/Monitor/Widget/AgentGroups'
import AgentMonitor from '@/Monitor/Widget/AgentMonitor'
export default {
  name: 'monitor-agents',
  storageName: 'agentManager',
  widgetName: 'AGENT MANAGER',
  data () {
    return {
      agents: [],
      groups: [],
      showCollapse: true
    }
  },
  methods: {
    handleState ( {tag, info} ) {
      if(info != 'undefined' ) {
        if (tag === 'ws_login') {
          let i = this.agents.findIndex(E => E.agent_id === info.agent_id)
          if (i >= 0) {
            this.agents.splice(i, 1, info)
          } else {
            this.agents.push(info)
          }
        }
        else if (info.state === 'terminate') {
          let i = this.agents.findIndex(E => E.agent_id === info.agent_id)
          if (i >= 0) {
            this.agents.splice(i, 1)
          }
        }
        else {
          let i = this.agents.findIndex(E => E.agent_id === info.agent_id)
          if (i >= 0) {
            this.agents.splice(i, 1, info)
          }
        }
      }
    },
    query: async function() {
      this.agents = await this.$agent.p_mfa('ws_admin', 'agents', ['all'])
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get')
      this.groups.unshift({ name:"Any Profile" })
    }
  },
  created () {
    this.query()
    this.$bus.$on('agents_state', this.handleState)
    this.$agent.subscribe('agents')
    if (this.$agent.vm.storage_data.agentManagerCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.agentManagerCollapsed
  },
  beforeDestroy () {
    this.$bus.$off('agents_state', this.handleState)
  },
  components: {
    'agent-groups': AgentGroups,
    'agent-monitor': AgentMonitor
  }
}
</script>
