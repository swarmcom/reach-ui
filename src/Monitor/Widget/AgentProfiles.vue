<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerProfiles" class="mt-2">
    <div class="row">
      <div class="col-2">
        <div class="row toggle-bar-custom">
          <div class="title">Profile Name</div>
        </div>
        <br></br>
        <label v-for="profileName in this.groups" :id=profileName.name class="col-12" style="height:27px; border-bottom: solid 1px;">{{ profileName.name }}</label>
      </div>
      <div class="col-10">
        <div class="row toggle-bar-custom" style="margin-left:1px">
          <div class="title">Agent States</div>
        </div>
        <b-table style="margin-top:10px" small striped hover
          :items="computedAgentsStats"
          :fields="fieldsStats">
        </b-table>
      </div>
    </div>
  </b-collapse>
</div>
</template>
<script>
export default {
  name: 'monitor-agents-profiles',
  storageName: 'agentManagerStates',
  widgetName: 'Agent Profiles',
  props: {
    agents: Array
  },
  data () {
    return {
      fieldsStats: {
        totalAgents: { label: 'Total Agents', sortable: false },
        released: { label: 'Released', sortable: false },
        idle: { label: 'Idle', sortable: false },
        ringing: { label: 'Ringing', sortable: false },
        insession: { label: 'In Session', sortable: false },
        wrapup: { label: 'Wrap-up', sortable: false },
        occup: { label: 'Occup', sortable: false },
        cpt: { label: 'CPT', sortable: false },
        calls: { label: 'Calls', sortable: false },
      },
      groups: [],
      showCollapse: true,
    }
  },
  methods: {
    query: async function() {
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get')
    }
  },
  created () {
    this.query()
    if (this.$agent.vm.storage_data.agentManagerStatesCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.agentManagerStatesCollapsed
  },
  computed: {
    computedAgentsStats () {
      let agents = []
      this.groups.forEach( (key) => {
        let object = { "totalAgents":0, "released": 0, "idle": 0, "ringing": 0, "insession": 0, "wrapup": 0 }
        object._cellVariants = {
          totalAgents: 'primary',
          released: 'primary',
          idle: 'warning',
          ringing: 'warning',
          insession: 'success',
          wrapup: 'warning',
          occup: 'primary',
          cpt: 'primary',
          calls: 'primary'
        }
        let selectedProfile = key.name
        this.agents.forEach( (key) => {
          if(key.agent.group != undefined && selectedProfile == key.agent.group.name) {
            object.totalAgents++
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
          }
        } )
        agents.push(object)
      } )
      return agents;
    }
  }
}
</script>