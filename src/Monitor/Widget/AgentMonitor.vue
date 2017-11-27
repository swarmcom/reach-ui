<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerAgents" class="mt-2">
    <b-row>
      <b-col cols="2">
        <b-row class="toggle-bar-custom">
          <div class="title">Filter</div>
        </b-row>
        <b-form-input size="sm" v-model="filter" placeholder="Search..." style="margin-top:10px" />
        <b-form-select class="pointer" size="sm" v-model="selectedProfile" style="margin-top:10px">
          <option v-for="group in this.groups" :value=group.name>{{group.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedCustomer" style="margin-top:10px">
          <option v-for="client in this.clients" :value=client.name>{{client.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedState" style="margin-top:10px">
          <option v-for="state in this.states" :value=state.name>{{state.name}}</option>
        </b-form-select>
      </b-col>
      <b-col cols="10">
        <b-table style="margin-top:10px" small bordered
          :items="computedAgents"
          :fields="fields"
          :filter="filter"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          @sort-changed="onSortingChanged">
          <template slot="agentDetail" slot-scope="data">
            <b-row>
              <b-col cols="1">
                <button type="button" class="btn btn-sm pointer" v-if="data.item._showDetails" @click="data.item._showDetails = false">
                  <icon name="minus" scale="0.5"></icon>
                </button>
                <button type="button" class="btn btn-sm pointer" v-if="!data.item._showDetails" @click="data.item._showDetails = true">
                    <icon name="plus" scale="0.5"></icon>
                </button>
              </b-col>
              <b-col>
                <div class="agent-state-text"><b>{{data.item.agentName+' '}}</b> {{data.item.agentLogin}}</div>
                <div class="agent-state-text"><b>Profile: </b>{{data.item.agentGroup}}</div>
                <div class="agent-state-text"><b>Phone: </b>{{data.item.agentPhone}}</div>
                <div class="agent-state-text"><b>Skills: </b>{{data.item.agentSkills}}</div>
                <div class="agent-state-text"><b>Customer: </b>{{data.item.agentClient}}</div>
              </b-col>
            </b-row>
          </template>
          <template slot="row-details" slot-scope="data">
            <b-row class="text-center">
            <b-col>
            <b-dropdown size="sm" class="agent-release-dropdown" text="Select Action" variant="outline-secondary">
              <b-dropdown-item v-if="data.item.state == 'release'" @click="available(data.item)">Available</b-dropdown-item>
              <b-dropdown-item v-else @click="release(data.item)">Release</b-dropdown-item>
              <b-dropdown-item @click="stop(data.item)">Kill</b-dropdown-item>
            </b-dropdown>
            </b-col>
            </b-row>
          </template>
          <template slot="state" slot-scope="data">
            <div v-if="data.item.state == 'available'">
              <icon  name="circle-o" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'release'">
              <icon name="stop" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'ringing'">
              <icon  name="wifi" scale="2" style="transform: rotate(270deg);"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'outgoing'">
              <icon  name="wifi" scale="2" style="transform: rotate(90deg);"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'oncall'">
              <icon  name="phone" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'conference'">
              <icon  name="phone" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'inconference'">
              <icon  name="phone" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'test'">
              <icon  name="phone" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'hold'">
              <icon  name="pause" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'wrapup'">
              <icon  name="pause" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div class="agent-state-text">{{msToHms(Math.round(data.item.time).toString())}}</div>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import Common from '@/Admin/Common'
export default {
  name: 'monitor-agents-manager',
  storageName: 'agentManagerMonitor',
  widgetName: 'Agents',
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
        state: { label: 'State', sortable: true }
      },
      clients: [],
      states: [
        {name: "Any State"},
        {name: "release"},
        {name: "available"},
        {name: "ringing"},
        {name: "outgoing"},
        {name: "oncall"},
        {name: "conference"},
        {name: "inconference"},
        {name: "hold"},
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
  computed: {
    computedAgents () {
      let agents = this.agents.slice(0)
      let compAgents = []
      agents.forEach( (key) => {
        //key._cellVariants = { agentDetail: 'secondary', agentOccup: 'secondary', agentMyCpt: 'secondary', agentCalls: 'secondary', timeComputed: 'secondary' }
        key._cellVariants = {}
        switch(key.state) {
          case "release": {
            key._cellVariants.state = "primary"
            break
          }
          case "ringing":
          case "outgoing":
          case "oncall":
          case "conference":
          case "inconference":
          case "hold":
          case "test":
          {
            key._cellVariants.state = "success"
            break
          }
          case "available":
          case "wrapup": {
            key._cellVariants.state = "warning"
            break
          }
          default: key._cellVariants.state = "primary"
        }
        /*key.timeComputed = this.msToHms(Math.round(key.time).toString())*/
        key.agentName = key.agent.name
        key.agentLogin = key.agent.login
        key.agentPhone = key.agent.uri
        key.agentSkills = (Object.keys(key.agent.skills)).toString()

        if(key.agent.line.client != undefined) {
          key.agentClient = key.agent.line.client.name
          if(this.selectedCustomer != key.agent.line.client.name && this.selectedCustomer != 'Any Customers')
            return
        }
        else if(this.selectedCustomer != 'Any Customers')
          return

        if(key.agent.group != undefined){
          key.agentGroup = key.agent.group.name
          if(this.selectedProfile != key.agent.group.name && this.selectedProfile != 'Any Profile')
            return
        }
        else if(this.selectedProfile != 'Any Profile')
          return
        if(this.selectedState != key.state && this.selectedState != 'Any State')
          return

        compAgents.push(key);
      } )
      return compAgents;
    }
  }
}
</script>
