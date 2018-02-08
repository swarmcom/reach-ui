<!--suppress ALL -->
<template>
<div>
  <toggle-bar style="width:100%; background: #fff; border-bottom: 1px solid #fff;"/>
  <b-collapse v-model="showCollapse" id="collapseAgentManagerAgents" class="mt-2">
    <b-row>
      <b-col cols="12" md="12" lg="3" xl="2">
        <b-row class="toggle-bar-custom">
          <div class="titlenocollapse">Filter</div>
        </b-row>
        <b-form-input class="customInput" size="sm" :value="filter" v-on:input="onFilterUpdate" :state="filterState" placeholder="Search..." style="margin-top:10px" ></b-form-input>
        <b-form-select class="pointer" size="sm" v-model="selectedProfile" style="margin-top:10px">
          <option v-for="group in this.groups_select" :value=group.name>{{group.name}}</option>
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
      <b-col cols="12" md="12" lg="9" xl="10" style="min-width:700px;">
        <b-row>
          <b-col>
            <b-table style="margin-top:10px;" small bordered hover
                     :items="computedAgents"
                     :fields="fields"
                     :filter="filter"
                     :sort-by="sortBy"
                     :sort-desc="sortDesc"
                     @sort-changed="onSortingChanged">
              <template slot="actions" slot-scope="data">
                <b-row class="text-center">
                  <b-col>
                    <b-dropdown size="sm" text="Select Action" variant="outline-secondary">
                      <b-dropdown-item v-access:controlAgentState-feature v-if="data.item.state === 'release'"
                                       @click="available(data.item)">Available
                      </b-dropdown-item>
                      <b-dropdown-item v-access:controlAgentState-feature v-else @click="release(data.item)">Release
                      </b-dropdown-item>
                      <b-dropdown-item @click="stop(data.item)">Kill</b-dropdown-item>
                      <b-dropdown-item v-access:takeOver-feature v-if="allowTakeOver(data.item.state)"
                                       @click="takeover(data.item)">Take Over
                      </b-dropdown-item>
                      <b-dropdown-item v-access:monitor-feature v-if="allowSpy(data.item.state)"
                                       @click="spy(data.item)">Monitor
                      </b-dropdown-item>
                      <b-dropdown-item v-if="data.item.state === 'barge' && data.item.agent.id === $agent.vm.agent.id"
                                       @click="cancelSpy()">Stop Monitor
                      </b-dropdown-item>
                      <b-dropdown-header
                              v-if="data.item.state === 'barge' && data.item.agent.id === $agent.vm.agent.id">
                        Monitor actions
                      </b-dropdown-header>
                      <b-dropdown-item v-access:monitor-feature
                                       v-if="data.item.state === 'barge' && data.item.agent.id === $agent.vm.agent.id"
                                       @click="setMode('spy')">Spy
                      </b-dropdown-item>
                      <b-dropdown-item v-access:barge-feature
                                       v-if="data.item.state === 'barge' && data.item.agent.id === $agent.vm.agent.id"
                                       @click="setMode('barge')">Barge
                      </b-dropdown-item>
                      <b-dropdown-item v-access:whisper-feature
                                       v-if="data.item.state === 'barge' && data.item.agent.id === $agent.vm.agent.id"
                                       @click="setMode('agent')">Whisper
                      </b-dropdown-item>
                    </b-dropdown>
                  </b-col>
                </b-row>
              </template>
              <template slot="agentDetail" slot-scope="data">
                <b-row>
                  <b-col>
                    <div class="agent-state-text"><b>{{data.item.agentName + ' '}}</b> {{data.item.agentLogin}}</div>
                    <div class="agent-state-text"><b>Profile: </b>{{data.item.agentGroup}}</div>
                    <div class="agent-state-text"><b>Phone: </b>{{data.item.agentPhone}}</div>
                    <div class="agent-state-text"><b>Skills: </b>{{data.item.agentSkills}}</div>
                  </b-col>
                </b-row>
              </template>
              <template slot="state" slot-scope="data">
                <div v-if="data.item.state === 'available'" class='agent-state-color'>
                  <icon name="circle-o" scale="2"/>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Available</div>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'suspended'" class='agent-state-color'>
                  <icon name="hourglass-start" scale="2"/>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Suspend</div>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'release'" class='agent-state-color'>
                  <icon name="stop" scale="2"/>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Release</div>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'ringing'" class='agent-state-color'>
                  <icon name="wifi" scale="2" style="transform: rotate(270deg);"/>
                  <b-row v-if="data.item.call_vars">
                    <b-col cols="12">
                      <div class="agent-state-text">{{data.item.inqueue.record === 'outgoing' ? 'outbound' : 'inbound' }}</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Ringing</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-img v-if="existAvatar(data.item.inqueue)"
                             :src="$agent.avatar_uri(data.item.inqueue.line_in.client.avatar)"
                             style="width:32px;"></b-img>
                      <icon v-else name="handshake-o" scale="2"/>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'outgoing'" class='agent-state-color'>
                  <icon name="wifi" scale="2" style="transform: rotate(90deg);"/>
                  <b-row v-if="data.item.call_vars">
                    <b-col cols="12">
                      <div class="agent-state-text">{{data.item.call_vars['Call-Direction']}}</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Outgoing</div>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'oncall'" class='agent-state-color'>
                  <icon name="phone" scale="2"/>
                  <b-row v-if="data.item.call_vars">
                    <b-col cols="12">
                      <div class="agent-state-text">{{data.item.inqueue.record === 'outgoing' ? 'outbound' : 'inbound' }}</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">On Call</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-img v-if="existAvatar(data.item.inqueue)"
                             :src="$agent.avatar_uri(data.item.inqueue.line_in.client.avatar)"
                             style="width:32px;"></b-img>
                      <icon v-else name="handshake-o" scale="2"/>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'conference'" class='agent-state-color'>
                  <icon name="phone" scale="2"/>
                  <b-row v-if="data.item.call_vars">
                    <b-col cols="12">
                      <div class="agent-state-text">{{data.item.call_vars['Call-Direction']}}</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Conference</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-img v-if="existAvatar(data.item.inqueue)"
                             :src="$agent.avatar_uri(data.item.inqueue.line_in.client.avatar)"
                             style="width:32px;"></b-img>
                      <icon v-else name="handshake-o" scale="2"/>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'inconference'" class='agent-state-color'>
                  <icon name="phone" scale="2"/>
                  <b-row v-if="data.item.call_vars">
                    <b-col cols="12">
                      <div class="agent-state-text">{{data.item.call_vars['Call-Direction']}}</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">In Conference</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <icon name="handshake-o" scale="2"/>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'test'" class='agent-state-color'>
                  <icon name="phone" scale="2"/>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Test</div>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'hold'" class='agent-state-color'>
                  <icon name="pause" scale="2"/>
                  <b-row v-if="data.item.call_vars">
                    <b-col cols="12">
                      <div class="agent-state-text">{{data.item.call_vars['Call-Direction']}}</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Hold</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-img v-if="existAvatar(data.item.inqueue)"
                             :src="$agent.avatar_uri(data.item.inqueue.line_in.client.avatar)"
                             style="width:32px;"></b-img>
                      <icon v-else name="handshake-o" scale="2"/>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'wrapup'" class='agent-state-color'>
                  <icon name="pause" scale="2"/>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Wrap Up</div>
                    </b-col>
                  </b-row>
                </div>
                <div v-if="data.item.state === 'barge'" class='agent-state-color'>
                  <icon name="phone" scale="2"/>
                  <b-row v-if="data.item.call_vars">
                    <b-col cols="12">
                      <div class="agent-state-text">{{data.item.call_vars['Call-Direction']}}</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <div class="agent-state-text">Barge</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-img v-if="existAvatar(data.item.inqueue)"
                             :src="$agent.avatar_uri(data.item.inqueue.line_in.client.avatar)"
                             style="width:32px;"></b-img>
                      <icon v-else name="handshake-o" scale="2"/>
                    </b-col>
                  </b-row>
                </div>
              </template>
              <template slot="media" slot-scope="data">
                <b-row>
                  <b-col cols="1"
                         v-if="data.item.state==='oncall' || data.item.state==='ringing' || data.item.state==='hold'">
                    <icon name="mobile" scale="2" class='agent-state-color'/>
                  </b-col>
                  <b-col>
                    <div class="agent-state-text" style="margin-top: 10px;">
                      {{msToHms(Math.round(data.item.time).toString())}}
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="12">
                    <div v-if="existClient(data.item.inqueue)" class="agent-state-text">
                      {{data.item.inqueue.line_in.client.name}}
                    </div>
                  </b-col>
                </b-row>
                <b-row v-if="data.item.call_vars">
                  <b-col cols="12">
                    <div class="agent-state-text">
                      {{isDefined(data.item.call_vars['Caller-Caller-ID-Name']) + ' ' + isDefined(data.item.call_vars['Caller-Orig-Caller-ID-Number'])}}
                    </div>
                  </b-col>
                </b-row>
                <b-row v-if="data.item.call_vars">
                  <b-col cols="12" v-if="data.item.state==='barge'">
                    <div class="agent-state-text">
                      {{isDefined(data.item.call_vars['Caller-Caller-ID-Name']) + ' ' + isDefined(data.item.call_vars['Caller-Caller-ID-Number'])}}
                    </div>
                  </b-col>
                </b-row>
                <b-row v-if="data.item.state==='release'">
                  <b-col cols="12">
                    <div class="agent-state-text">{{data.item.release.name ? data.item.release.name : 'default'}}</div>
                  </b-col>
                </b-row>
                <b-row v-if="data.item.call_vars">
                  <b-col cols="12">
                    <div class="agent-state-text">{{isDefined(data.item.call_vars['Unique-ID'])}}</div>
                  </b-col>
                </b-row>
              </template>
            </b-table>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-btn size="sm" class="pointer" style="float:right" @click="refresh" variant="outline-secondary">Refresh</b-btn>
          </b-col>
        </b-row>
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
        actions: { label: 'Actions', thClass:"table-header-text-center" },
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
        {name: "suspended"},
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
      modes: [
        { value: 'spy', name: 'Spy' },
        { value: 'barge', name: 'Barge' },
        { value: 'agent', name: 'Whisper Agent' },
        { value: 'caller', name: 'Whisper Caller' }
      ],
      stats: [],
      tags: [],
      groups_select: [],
      period: { value: { last: '15m' }, name: "Last 15 minutes"},
      selectedProfile: 'Any Profile',
      selectedCustomer: 'Any Customers',
      selectedState: 'Any State',
      selectedSkill: 'Any Skill',
      updater: '',
      filter: null,
      filterState: null,
      sortBy: 'agent_id',
      sortDesc: false,
      showCollapse: true
    }
  },
  methods: {
    handleState ({ tag }) {
      if(tag === "change")
        this.updateStats()
    },
    query: async function() {
      this.clients = await this.$agent.p_mfa('ws_agent', 'clients')
      this.clients.unshift({ name:"Any Customers" })
      this.tags = await this.$agent.p_mfa('ws_agent', 'tags')
      this.tags.unshift("Any Skill")
      this.groups_select = this.groups.slice(0)
      this.groups_select.unshift({ name:"Any Profile" })
    },
    refresh () {
      this.updateStats()
    },
    updateStats: async function() {
      this.stats = await this.$agent.p_mfa('ws_stats', 'agent_manager_stats', [this.period.value.last, 'agent_id'])
    },
    onTimer () {
      this.agents.forEach((E, i, A) => {
        E.time = new Date() - E.date
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
    takeover ({inqueue}) {
      this.$agent.mfa('ws_supervisor', 'takeover', [inqueue.record, inqueue.uuid])
    },
    allowSpy (state) {
      return (state === 'oncall' || state === 'conference') &&
          (!this.$agent.is_onsession() && !this.$agent.is_barge());
    },
    allowTakeOver (state) {
      return (state === 'oncall') &&
          (!this.$agent.is_onsession() && !this.$agent.is_barge());
    },
    spy ({inqueue}) {
      this.$agent.mfa('ws_supervisor', 'spy', [inqueue.record, inqueue.uuid])
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
    existAvatar(data){
      return data && data.line_in !== undefined && data.line_in.client.avatar;
    },
    existClient(data){
      return data && data.line_in !== undefined;
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
    },
    onFilterUpdate (event){
      if (event.match(/[^\w\s]/gi)) {
        this.filter = event.replace(/[^\w\s]/gi, '')
        this.filterState = false
      }
      else {
        this.filter = event
        this.filterState = null
      }
    },
  },
  created () {
    this.query()
    this.updateStats()
    this.$bus.$on('agents_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
    if (this.$agent.vm.storage_data.agentManagerMonitorCollapsed !== undefined)
      this.showCollapse = this.$agent.vm.storage_data.agentManagerMonitorCollapsed
    if (this.$agent.vm.storage_data.agentManagerMonitorSortBy !== undefined)
      this.sortBy = this.$agent.vm.storage_data.agentManagerMonitorSortBy
    if (this.$agent.vm.storage_data.agentManagerMonitorSortDesc !== undefined)
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
        key._cellVariants = { actions: 'success', agentDetail: 'primary', agentOccup: 'primary', agentMyCpt: 'primary', agentCalls: 'primary', timeComputed: 'primary' }
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
          case "suspended":
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
        key.agentName = key.agent.name
        key.agentLogin = key.agent.login
        key.agentPhone = key.agent.uri
        key.agentSkills = (Object.keys(key.agent.skills)).toString()

        let stats = this.stats.find(item => item.agent_id === key.agent_id)
        if (stats !== undefined) {
          key.agentOccup = (stats.occupancy ? stats.occupancy + "%" : "0%")
          key.agentMyCpt = (stats.cpt ? this.msToMs(stats.cpt) : "--")
          key.agentCalls = (stats.calls ? stats.calls : "--")
          key.timeComputed = (stats.total_time ? this.msToHms(stats.total_time) : "--")
        }

        if (key.inqueue && key.inqueue.line_in !== undefined) {
          if(this.selectedCustomer !== key.inqueue.line_in.client.name && this.selectedCustomer !== 'Any Customers')
            return
        }
        else if(this.selectedCustomer !== 'Any Customers')
          return

        key.agentGroup = key.agent.group.name
        if((this.selectedProfile !== key.agent.group.name && this.selectedProfile !== 'Any Profile'))
          return

        let groups_perm = this.groups.findIndex(E => E.name === key.agent.group.name)
        if (this.selectedProfile === 'Any Profile' && groups_perm < 0 && key.agent.group.name !== undefined )
          return

        if(this.selectedState !== key.state && this.selectedState !== 'Any State')
          return

        if(this.selectedSkill !== 'Any Skill') {
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
