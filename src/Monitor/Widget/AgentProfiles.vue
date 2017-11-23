<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerProfiles" class="mt-2">
    <b-row>
      <b-col cols="2">
        <b-row class="toggle-bar-custom">
          <div class="title">Profile Name</div>
        </b-row>
        <br></br>
        <label v-for="profileName in this.groups" :id=profileName.name class="col-12" style="height:27px; border-bottom: solid 1px;">{{ profileName.name }}</label>
      </b-col>
      <b-col cols="7">
        <b-row class="toggle-bar-custom" style="margin-left:1px">
          <div class="title">Agent States</div>
        </b-row>
        <b-table style="margin-top:10px" small striped bordered hover
          :items="computedAgentsStats"
          :fields="fieldsStates">
        </b-table>
      </b-col>
      <b-col cols="3">
        <b-form-select style="margin-top:8px" class="pointer" size="sm" v-model="period.value" @change="set_period">
          <option v-for="period in periods" :value="period.value">{{period.name}}</option>
        </b-form-select>
        <b-table style="margin-top:10px" small striped bordered hover
          :items="computedAgentsStats"
          :fields="fieldsStats">
        </b-table>
      </b-col>
    </b-row>
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
      fieldsStates: {
        totalAgents: { label: 'Total Agents', sortable: false },
        released: { label: 'Released', sortable: false },
        idle: { label: 'Idle', sortable: false },
        ringing: { label: 'Ringing', sortable: false },
        insession: { label: 'In Session', sortable: false },
        wrapup: { label: 'Wrap-up', sortable: false }
      },
      fieldsStats: {
        occup: { label: 'Occup', sortable: false },
        cpt: { label: 'CPT', sortable: false },
        calls: { label: 'Calls', sortable: false }
      },
      groups: [],
      periods: [
        { value:"15m", name:"Last 15 minutes"},
        { value:"30m", name:"Last 30 minutes"},
        { value:"1h", name:"Last Hour"},
        { value:"1d", name:"Today" },
        { value:"1w", name:"This Week" },
        { value:"1m", name:"This Month" }
      ],
      period: { value: "15m", name: "Last 15 minutes"},
      showCollapse: true,
    }
  },
  methods: {
    query: async function() {
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get')
    },
    set_period (value) {
      this.period.value = value
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
          "insession": 0,
          "wrapup": 0,
          "occup": "-",
          "cpt": "-",
          "calls": "-"
        }
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