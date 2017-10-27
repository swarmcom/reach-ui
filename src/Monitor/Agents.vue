<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseAgentManager" class="mt-2">

    <div class="row toggle-bar-custom">
      <div class="title">Agent States</div>
    </div>

    <b-table style="margin-top:10px" small striped hover
      :items="computedAgentsStats"
      :fields="fieldsStats">
    </b-table>

    <div class="row toggle-bar-custom">
      <div class="title">Agents</div>
    </div>
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
          <template slot="agent_detail" slot-scope="data">
            <div class="agent-state-text">{{data.item.agent_name + ' ' + data.item.agent_login}}</div>
            <div class="agent-state-text"><b>Profile: </b>{{data.item.agent_group}}</div>
            <div class="agent-state-text"><b>Phone: </b>{{data.item.agent_phone}}</div>
            <div class="agent-state-text"><b>Skills: </b>{{data.item.agent_skills}}</div>
            <div class="agent-state-text"><b>Customer: </b>{{data.item.agent_client}}</div>
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
import Btable from '../Widget/Btable'
import ToggleBar from '../Widget/ToggleBar'
import Common from '../Admin/Common'
export default {
  name: 'monitor-agents',
  storageName: 'agentManager',
  widgetName: 'AGENT MANAGER',
  mixins: [Common],
  data () {
    return {
      fields: {
        agent_detail: { label: 'Agent Details' },
        timeComputed: { label: 'Time logged in', sortable:true },
        state: { label: 'State', sortable: true },
        actions: { label: 'Actions' }
      },
      fieldsStats: {
        total_agents: { label: 'Total Agents', sortable: false },
        released: { label: 'Released', sortable: false },
        idle: { label: 'Idle', sortable: false },
        ringing: { label: 'Ringing', sortable: false },
        insession: { label: 'In Session', sortable: false },
        wrapup: { label: 'Wrap-up', sortable: false }
      },
      agents: [],
      groups: [],
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
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
      this.clients.unshift({ name:"Any Customers" })
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get')
      this.groups.unshift({ name:"Any Profile" })
    },
    onTimer () {
      this.agents.forEach((E, i, A) => {
        E.time = E.time + 1000
        A.splice(i, 1, E)
      })
    },
    onClick (data) {
      this.$router.push(`/admin/agent/${data.agent_id}`)
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
    this.$agent.subscribe('agents')
    this.$bus.$on('agents_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
    if (this.$agent.vm.storage_data.agentManagerCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.agentManagerCollapsed
    if (this.$agent.vm.storage_data.agentManagerSortBy != undefined)
      this.sortBy = this.$agent.vm.storage_data.agentManagerSortBy
    if (this.$agent.vm.storage_data.agentManagerSortDesc != undefined)
      this.sortDesc = this.$agent.vm.storage_data.agentManagerSortDesc
  },
  beforeDestroy () {
    this.$bus.$off('agents_state', this.handleState)
    clearInterval(this.updater)
  },
  components: {
    btable: Btable,
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
