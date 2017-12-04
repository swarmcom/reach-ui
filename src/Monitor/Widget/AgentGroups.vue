<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerProfiles" class="mt-2">
    <b-row>
      <b-col cols="2">
        <b-row class="toggle-bar-custom">
          <div class="titlenocollapse">Profile Name</div>
        </b-row>
        <b-table style="margin-top:10px" small responsive hover
          :items="groups"
          :fields="fieldNames">
        </b-table>
      </b-col>
      <b-col cols="7">
        <b-row class="toggle-bar-custom" style="margin-left:1px">
          <div class="titlenocollapse">Agent States</div>
        </b-row>
        <b-table style="margin-top:10px" small striped bordered hover
          :items="computedAgentsStats"
          :fields="fieldsStates">
        </b-table>
      </b-col>
      <b-col cols="3">
        <group-stats></group-stats>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>
<script>
import AgentGroupsStats from '@/Monitor/Widget/AgentGroupsStats'
export default {
  name: 'monitor-agents-groups',
  storageName: 'agentManagerStates',
  widgetName: 'Agent Groups',
  props: {
    agents: Array
  },
  data () {
    return {
      fieldsStates: {
        totalAgents: { label: 'Total Agents', sortable: false, variant: "primary", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        released: { label: 'Released', sortable: false, variant: "primary", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        idle: { label: 'Idle', sortable: false, variant: "warning", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        ringing: { label: 'Ringing', sortable: false, variant: "warning", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        outgoing: { label: 'Outgoing', sortable: false, variant: "warning", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        insession: { label: 'In Session', sortable: false, variant: "success", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        wrapup: { label: 'Wrap-up', sortable: false, variant: "warning", thClass:"table-header-text-center", tdClass:"table-body-text-center" }
      },
      fieldNames: {
        name: { label: 'Name', sortable: false, thClass:"table-header-text-center" },
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
        let object = {
          "totalAgents":0,
          "released": 0,
          "idle": 0,
          "ringing": 0,
          "outgoing": 0,
          "insession": 0,
          "wrapup": 0
        }
        let selectedProfile = key.id
        this.agents.forEach( (key) => {
          if(key.agent.group != undefined && selectedProfile == key.agent.group.id) {
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
              case "outgoing":
                object.outgoing++
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
  },
  components: {
    'group-stats': AgentGroupsStats
  }
}
</script>