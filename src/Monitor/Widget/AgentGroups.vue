<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerProfiles" class="mt-2">
    <b-row>
      <b-col cols="12" md="12" lg="2" xl="2">
        <b-row class="toggle-bar-custom">
          <div class="titlenocollapse">Groups</div>
        </b-row>
        <b-table style="margin-top:10px" small hover
          :items="groups"
          :fields="fieldNames">
        </b-table>
      </b-col>
      <b-col cols="12" md="12" lg="10" xl="7">
        <b-row class="toggle-bar-custom" style="margin-left:1px">
          <div class="titlenocollapse">Agent States</div>
        </b-row>
        <b-table style="margin-top:10px; min-width:620px;" small striped bordered hover
          :items="computedAgentsStats"
          :fields="fieldsStates">
          <template slot="ringing" slot-scope="data">
            <b-row class="text-center">
              <b-col>
                {{data.item.ringing.inbound + ' / ' + data.item.ringing.outbound}}
              </b-col>
            </b-row>
          </template>
          <template slot="insession" slot-scope="data">
            <b-row class="text-center">
              <b-col>
                {{data.item.insession.inbound + ' / ' + data.item.insession.outbound}}
              </b-col>
            </b-row>
          </template>
        </b-table>
      </b-col>
      <b-col cols="12" md="12" lg="12" xl="3">
        <group-stats :groups="groups"></group-stats>
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
    agents: Array,
    groups: Array,
  },
  data () {
    return {
      fieldsStates: {
        totalAgents: { label: 'Total Agents', sortable: false, variant: "primary", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        released: { label: 'Released', sortable: false, variant: "primary", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        suspended: { label: 'Suspend', sortable: false, variant: "primary", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        idle: { label: 'Idle', sortable: false, variant: "warning", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        ringing: { label: 'Ringing In/Out', sortable: false, variant: "warning", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        outgoing: { label: 'Outgoing', sortable: false, variant: "warning", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        insession: { label: 'In Session In/Out', sortable: false, variant: "success", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        conference: { label: 'Conference', sortable: false, variant: "success", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        wrapup: { label: 'Wrap-up', sortable: false, variant: "warning", thClass:"table-header-text-center", tdClass:"table-body-text-center" }
      },
      fieldNames: {
        name: { label: 'Name', sortable: false, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
      },
      showCollapse: true,
    }
  },
  created () {
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
          "suspended": 0,
          "idle": 0,
          "ringing": { inbound: 0, outbound: 0 },
          "outgoing": 0,
          "insession": { inbound: 0, outbound: 0 },
          "conference": 0,
          "wrapup": 0
        }
        let selectedProfile = key.name
        this.agents.forEach( (key) => {
          if(selectedProfile == key.agent.group.name) {
            object.totalAgents++
            switch (key.state){
              case "release":
                object.released++
                break
              case "available":
                object.idle++
                break
              case "suspended":
                object.suspended++
                break
              case "ringing":
                if(key.call_vars != undefined && key.call_vars['Call-Direction'] == 'inbound')
                  object.ringing.inbound++
                else if(key.call_vars != undefined && key.call_vars['Call-Direction'] == 'outbound')
                  object.ringing.outbound++
                break
              case "outgoing":
                object.outgoing++
                break
              case "conference":
              case "inconference":
                object.conference++
                break
              case "oncall":
                if(key.call_vars != undefined && key.call_vars['Call-Direction'] == 'inbound')
                  object.insession.inbound++
                else if(key.call_vars != undefined && key.call_vars['Call-Direction'] == 'outbound')
                  object.insession.outbound++
                break
              case "wrapup":
                object.wrapup++
                break
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