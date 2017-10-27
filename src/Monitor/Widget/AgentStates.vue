<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerStates" class="mt-2">

    <div class="row toggle-bar-custom">
      <div class="title">Agent States</div>
    </div>

    <b-table style="margin-top:10px" small striped hover
      :items="computedAgentsStats"
      :fields="fieldsStats">
    </b-table>
  </b-collapse>
</div>
</template>
<script>
import ToggleBar from '../../Widget/ToggleBar'
import Common from '../../Admin/Common'
export default {
  name: 'monitor-agents-states',
  storageName: 'agentManagerStates',
  widgetName: 'AGENT STATES',
  mixins: [Common],
  data () {
    return {
      fieldsStats: {
        total_agents: { label: 'Total Agents', sortable: false },
        released: { label: 'Released', sortable: false },
        idle: { label: 'Idle', sortable: false },
        ringing: { label: 'Ringing', sortable: false },
        insession: { label: 'In Session', sortable: false },
        wrapup: { label: 'Wrap-up', sortable: false }
      },
      agents: [],
      showCollapse: true
    }
  },
  methods: {
    handleState ({ tag, info }) {
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
    },
    query: async function() {
      this.agents = await this.$agent.p_mfa('ws_admin', 'agents', ['all'])
    }
  },
  created () {
    this.query()
    this.$bus.$on('agents_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('agents_state', this.handleState)
  },
  components: {
    toggleBar: ToggleBar
  },
  computed: {
    computedAgents () {
      let agents = this.agents
      let compAgents = []
      agents.forEach( (key) => {
        compAgents.push(key);
        key._cellVariants = { agent_detail: 'primary', timeComputed: 'primary', state: 'primary', actions: 'primary' }
        key.timeComputed = this.msToHms(Math.round(key.time).toString())
        key.agent_name = key.agent.name
        key.agent_login = key.agent.login
        key.agent_phone = key.agent.uri
        key.agent_skills = (Object.keys(key.agent.skills)).toString()

        if(key.agent.line.client != undefined) {
          key.agent_client = key.agent.line.client.name
          if(this.selectedCustomer != key.agent.line.client.name && this.selectedCustomer != 'Any Customers'){
            compAgents.pop(key) //object.splice(index, 1)
            }
        }
        else if(this.selectedCustomer != 'Any Customers'){
          compAgents.pop(key)
        }

        if(key.agent.group != undefined){
          key.agent_group = key.agent.group.name
          if(this.selectedProfile != key.agent.group.name && this.selectedProfile != 'Any Profile')
            compAgents.pop(key)
        }
        else if(this.selectedProfile != 'Any Profile'){
          compAgents.pop(key)
        }

        if(this.selectedState != key.state && this.selectedState != 'Any State')
          compAgents.pop(key)

      } )
      return compAgents;
    },
    computedAgentsStats () {
      let agents = []
      let object = { "total_agents":0, "released": 0, "idle": 0, "ringing": 0, "insession": 0, "wrapup": 0}
      object.total_agents = this.agents.length
      this.agents.forEach( (key) => {
        switch (key.state){
          case "release":
            object.released++
            break;
          case "available":
            object.idle++
            break;
          case "ringing":
            object.ringing++
            break;
          case "oncall":
            object.insession++
            break;
          case "wrapup":
            object.wrapup++
            break;
        }
      } )
      agents.push(object)
      return agents;
    }
  }
}
</script>