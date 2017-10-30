<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerProfiles" class="mt-2">
    <div class="row">
      <div class="col-2">
        <div class="row toggle-bar-custom">
          <div class="title">Filter</div>
        </div>
        <b-form-input size="sm" v-model="filter" placeholder="Search..." style="margin-top:10px" />
        <b-form-select size="sm" v-model="selectedProfile" style="margin-top:10px">
          <option v-for="group in this.groups" :value=group.name>{{group.name}}</option>
        </b-form-select>
        <b-form-select size="sm" v-model="selectedCustomer" style="margin-top:10px">
          <option v-for="client in this.clients" :value=client.name>{{client.name}}</option>
        </b-form-select>
        <b-form-select size="sm" v-model="selectedState" style="margin-top:10px">
          <option v-for="state in this.states" :value=state.name>{{state.name}}</option>
        </b-form-select>
      </div>
      <div class="col-10">
        <b-table style="margin-top:10px" small striped hover
          :items="computedAgents"
          :fields="fields"
          :filter="filter"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          @sort-changed="onSortingChanged">
          <template slot="agentDetail" slot-scope="data">
            <div class="agent-state-text">{{data.item.agentName + ' ' + data.item.agentLogin}}</div>
            <div class="agent-state-text"><b>Profile: </b>{{data.item.agentGroup}}</div>
            <div class="agent-state-text"><b>Phone: </b>{{data.item.agentPhone}}</div>
            <div class="agent-state-text"><b>Skills: </b>{{data.item.agentSkills}}</div>
            <div class="agent-state-text"><b>Customer: </b>{{data.item.agentClient}}</div>
          </template>
          <template slot="actions" slot-scope="data">
            <b-button v-if="data.item.state == 'release'" size="sm" variant="warning" @click="available(data.item)">Available</b-button>
            <b-button v-else size="sm" variant="primary" @click="release(data.item)">Release</b-button>
            <b-button size="sm" variant="danger" @click="stop(data.item)">Kill</b-button>
          </template>
        </b-table>
      </div>
    </div>
  </b-collapse>
</div>
</template>

<script>
import ToggleBar from '../../Widget/ToggleBar'
import Common from '../../Admin/Common'
export default {
  name: 'monitor-agents-manager',
  storageName: 'agentManagerMonitor',
  widgetName: 'AGENTS',
  mixins: [Common],
  props: {
    agents: Array,
    groups: Array
  },
  data () {
    return {
      fields: {
        agentDetail: { label: 'Agent Details' },
        agentOccup: { label: 'Occup' },
        agentMyCpt: { label: 'My CPT' },
        agentCalls: { label: 'Calls' },
        timeComputed: { label: 'Time logged in', sortable:true },
        state: { label: 'State', sortable: true },
        actions: { label: 'Actions' }
      },
      clients: [],
      states: [
        {name: "Any State"},
        {name: "release"},
        {name: "available"},
        {name: "ringing"},
        {name: "oncall"},
        {name: "wrapup"}
      ],
      selectedProfile: 'Any Profile',
      selectedCustomer: 'Any Customers',
      selectedState: 'Any State',
      updater: '',
      filter: null,
      sortBy: 'agent_id',
      sortDesc: false,
      showCollapse: true
    }
  },
  methods: {
    query: async function() {
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
      this.clients.unshift({ name:"Any Customers" })
    },
    onTimer () {
      this.agents.forEach((E, i, A) => {
        E.time = E.time + 1000
        A.splice(i, 1, E)
      })
    },
    release (agent) {
      this.$agent.mfa('ws_supervisor', 'release', [agent.agent_id])
    },
    onSortingChanged (ctx){
      this.$agent.vm.storage_data[this.$options.storageName+'SortBy'] = ctx.sortBy
      this.$agent.vm.storage_data[this.$options.storageName+'SortDesc'] = ctx.sortDesc
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    },
    available (agent) {
      this.$agent.mfa('ws_supervisor', 'available', [agent.agent_id])
    },
    stop (agent) {
      this.$agent.mfa('ws_supervisor', 'stop', [agent.agent_id])
    }
  },
  created () {
    this.query()
    this.updater = setInterval(this.onTimer, 1000)
    if (this.$agent.vm.storage_data.agentManagerMonitorCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.agentManagerMonitorCollapsed
    if (this.$agent.vm.storage_data.agentManagerMonitorSortBy != undefined)
      this.sortBy = this.$agent.vm.storage_data.agentManagerMonitorSortBy
    if (this.$agent.vm.storage_data.agentManagerMonitorSortDesc != undefined)
      this.sortDesc = this.$agent.vm.storage_data.agentManagerMonitorSortDesc
  },
  beforeDestroy () {
    clearInterval(this.updater)
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
        key._cellVariants = { agentDetail: 'primary', agentOccup: 'primary', agentMyCpt: 'primary', agentCalls: 'primary', timeComputed: 'primary', state: 'primary', actions: 'primary' }
        key.timeComputed = this.msToHms(Math.round(key.time).toString())
        key.agentName = key.agent.name
        key.agentLogin = key.agent.login
        key.agentPhone = key.agent.uri
        key.agentSkills = (Object.keys(key.agent.skills)).toString()

        if(key.agent.line.client != undefined) {
          key.agentClient = key.agent.line.client.name
          if(this.selectedCustomer != key.agent.line.client.name && this.selectedCustomer != 'Any Customers'){
            compAgents.pop(key)
            }
        }
        else if(this.selectedCustomer != 'Any Customers'){
          compAgents.pop(key)
        }

        if(key.agent.group != undefined){
          key.agentGroup = key.agent.group.name
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
    }
  }
}
</script>
