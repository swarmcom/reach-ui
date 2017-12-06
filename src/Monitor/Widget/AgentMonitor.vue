<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerAgents" class="mt-2">
    <b-row>
      <b-col cols="2">
        <b-row class="toggle-bar-custom">
          <div class="titlenocollapse">Filter</div>
        </b-row>
        <b-form-input class="customInput" size="sm" v-model="filter" placeholder="Search..." style="margin-top:10px" />
        <b-form-select class="pointer" size="sm" v-model="selectedProfile" style="margin-top:10px">
          <option v-for="group in this.groups" :value=group.name>{{group.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedCustomer" style="margin-top:10px">
          <option v-for="client in this.clients" :value=client.name>{{client.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedState" style="margin-top:10px">
          <option v-for="state in this.states" :value=state.name>{{state.name}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="selectedSkill" style="margin-top:10px">
          <option v-for="skill in this.tags" :value=skill>{{skill}}</option>
        </b-form-select>
        <b-form-select class="pointer" size="sm" v-model="period.value" @change="set_period" style="margin-top:10px">
          <option v-for="period in periods" :value="period.value">{{period.name}}</option>
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
                <button type="button" class="btn btn-sm pointer" v-if="data.item._showDetails" @click="data.toggleDetails">
                  <icon name="minus" scale="0.5"></icon>
                </button>
                <button type="button" class="btn btn-sm pointer" v-if="!data.item._showDetails" @click="data.toggleDetails">
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
              <b-dropdown size="sm" text="Select Action" variant="outline-secondary">
                <b-dropdown-item v-if="data.item.state == 'release'" @click="available(data.item)">Available</b-dropdown-item>
                <b-dropdown-item v-else @click="release(data.item)">Release</b-dropdown-item>
                <b-dropdown-item @click="stop(data.item)">Kill</b-dropdown-item>
              </b-dropdown>
              <b-dropdown v-if="data.item.state == 'barge'" size="sm" text="Mode" variant="outline-secondary">
                <b-dropdown-item v-for="mode in modes" :key="mode" @click="setMode(mode)">{{ mode }}</b-dropdown-item>
              </b-dropdown>
              <b-button v-if="data.item.state == 'barge'" size="sm" variant="outline-secondary" class="pointer" @click="cancelSpy()">
                Cancel Spy
              </b-button>
            </b-col>

            </b-row>
          </template>
          <template slot="state" slot-scope="data">
            <div v-if="data.item.state == 'available'" class='agent-state-color'>
              <icon  name="circle-o" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'release'" class='agent-state-color'>
              <icon name="stop" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'ringing'" class='agent-state-color'>
              <icon  name="wifi" scale="2" style="transform: rotate(270deg);"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'outgoing'" class='agent-state-color'>
              <icon  name="wifi" scale="2" style="transform: rotate(90deg);"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'oncall'" class='agent-state-color'>
              <icon  name="phone" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
              <icon name="handshake-o" scale="2"></icon>
            </div>
            <div v-if="data.item.state == 'conference'" class='agent-state-color'>
              <icon  name="phone" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
              <icon name="handshake-o" scale="2"></icon>
            </div>
            <div v-if="data.item.state == 'inconference'" class='agent-state-color'>
              <icon  name="phone" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
              <icon name="handshake-o" scale="2"></icon>
            </div>
            <div v-if="data.item.state == 'test'" class='agent-state-color'>
              <icon  name="phone" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'hold'" class='agent-state-color'>
              <icon  name="pause" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
              <icon name="handshake-o" scale="2"></icon>
            </div>
            <div v-if="data.item.state == 'wrapup'" class='agent-state-color'>
              <icon  name="pause" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
            </div>
            <div v-if="data.item.state == 'barge'" class='agent-state-color'>
              <icon  name="phone" scale="2"></icon>
              <div class="agent-state-text">{{data.item.state}}</div>
              <icon name="handshake-o" scale="2"></icon>
            </div>
          </template>
          <template slot="media" slot-scope="data">
            <b-row>
              <b-col cols="1" v-if="data.item.state=='oncall' || data.item.state=='ringing' || data.item.state=='hold'">
                <icon name="mobile" scale="2" class='agent-state-color'></icon>
              </b-col>
              <b-col>
                <div class="agent-state-text" style="margin-top: 10px;">{{msToHms(Math.round(data.item.time).toString())}}</div>
              </b-col>
            </b-row>
            <b-row v-if="data.item.state=='oncall' || data.item.state=='ringing' || data.item.state=='hold' || data.item.state=='barge'">
              <b-col cols="12">
                <div class="agent-state-text">{{data.item.call_vars['Call-Direction']}}</div>
              </b-col>
              <b-col cols="12">
                <div class="agent-state-text">{{data.item.call_vars['Caller-Orig-Caller-ID-Number']}}</div>
              </b-col>
              <b-col cols="12">
                <div class="agent-state-text">{{data.item.call_vars['Caller-Caller-ID-Number']}}</div>
              </b-col>
              <b-col cols="12">
                <div class="agent-state-text">{{data.item.call_vars['Caller-Destination-Number']}}</div>
              </b-col>
            </b-row>
            <b-row v-if="data.item.state=='release'">
              <b-col cols="12">
                <div class="agent-state-text">{{data.item.release.name ? data.item.release.name : 'default'}}</div>
              </b-col>
            </b-row>
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
        agentDetail: { label: 'Agent Details', thClass:"table-header-text-center" },
        agentOccup: { label: 'Occup', sortable:true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        agentMyCpt: { label: 'My CPT', sortable:true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        agentCalls: { label: 'Calls', sortable:true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        timeComputed: { label: 'Time logged in', sortable:true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        state: { label: 'State', sortable: true, thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        media: { label: 'Media', sortable: false, thClass:"table-header-text-center" }
      },
      clients: [],
      states: [
        {name: "Any State"},
        {name: "release"},
        {name: "available"},
        {name: "ringing"},
        {name: "outgoing"},
        {name: "oncall"},
        {name: "barge"},
        {name: "conference"},
        {name: "inconference"},
        {name: "hold"},
        {name: "wrapup"}
      ],
      periods: [
        { value:{ last: '15m' }, name:"Last 15 minutes"},
        { value:{ last: '30m' }, name:"Last 30 minutes"},
        { value:{ last: '1h' }, name:"Last Hour"},
        { value:{ last: '1d' }, name:"Today" },
        { value:{ last: '1w' }, name:"This Week" },
        { value:{ last: '1M' }, name:"This Month" }
      ],
      modes: ['spy', 'barge', 'agent', 'caller'],
      stats: [],
      tags: [],
      period: { value: { last: '15m' }, name: "Last 15 minutes"},
      selectedProfile: 'Any Profile',
      selectedCustomer: 'Any Customers',
      selectedState: 'Any State',
      selectedSkill: 'Any Skill',
      updater: '',
      filter: null,
      sortBy: 'agent_id',
      sortDesc: false,
      showCollapse: true
    }
  },
  methods: {
    handleState ({ tag, info }) {
      if(tag == "change")
        this.updateStats()
    },
    query: async function() {
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
      this.clients.unshift({ name:"Any Customers" })
      this.tags = await this.$agent.p_mfa('ws_db_tag', 'get')
      this.tags.unshift("Any Skill")
    },
    updateStats: async function() {
      this.stats = await this.$agent.p_mfa('ws_stats', 'agents', [this.period.value])
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
    },
    cancelSpy () {
      this.$agent.mfa('ws_supervisor', 'cancel', [])
    },
    setMode (mode) {
      this.$agent.mfa('ws_supervisor', 'set_barge_mode', [mode])
    },
    set_period (value) {
      this.period.value = value
      this.updateStats()
    },
    percent (value) {
      if (value > 0) {
        return `${(value*100).toFixed(2)}%`
      } else {
        return "0%"
      }
    },
    time (value) {
      if (value > 0) {
        return `${(value/1000).toFixed(1)}s`
      } else {
        return "0s"
      }
    }
  },
  created () {
    this.query()
    this.updateStats()
    this.$bus.$on('agents_state', this.handleState)
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
    this.$bus.$off('agents_state', this.handleState)
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
            key._cellVariants.media = "primary"
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
            key._cellVariants.media = "success"
            break
          }
          case "available":
          case "wrapup": {
            key._cellVariants.state = "warning"
            key._cellVariants.media = "warning"
            break
          }
          case "barge": {
            key._cellVariants.state = "danger"
            key._cellVariants.media = "danger"
            break
          }
          default: {
            key._cellVariants.state = "primary"
            key._cellVariants.media = "primary"
          }
        }
        /*key.timeComputed = this.msToHms(Math.round(key.time).toString())*/
        key.agentName = key.agent.name
        key.agentLogin = key.agent.login
        key.agentPhone = key.agent.uri
        key.agentSkills = (Object.keys(key.agent.skills)).toString()

        let i = this.stats.findIndex(E => E.agent_id === key.agent_id)
        if(i >= 0) {
          if(Object.keys(this.stats[i].occupancy).length > 0 && this.stats[i].occupancy.states.ratio.oncall > 0)
            key.agentOccup = this.percent(this.stats[i].occupancy.states.ratio.oncall)
          else
            key.agentOccup = '0%'
          if(Object.keys(this.stats[i].cpt).length > 0 && this.stats[i].cpt.avg.oncall > 0)
            key.agentMyCpt = this.time(this.stats[i].cpt.avg.oncall)
          else
            key.agentMyCpt = '0s'
        }

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

        if(key.agentSkills != undefined && this.selectedSkill != 'Any Skill') {
          let skills = key.agentSkills.split(",")
          if(!skills.includes(this.selectedSkill)){
            return
          }
        }

        compAgents.push(key);
      } )
      return compAgents;
    }
  }
}
</script>
