<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseMyStatistics" class="mt-2">
    <b-row>
      <b-col cols="2">
        <b-form-select size="sm" v-model="period.value" @change="set_period">
          <option v-for="period in periods" :value="period.value">{{period.name}}</option>
        </b-form-select>
      </b-col>
      <div class="agent-state-text"><b>Profile: </b>{{ this.$agent.vm.agent.group.name }}</div>
    </b-row>
    <b-row>
      <b-col>
        <b-table style="margin-top:10px" small bordered
          :items="statistics"
          :fields="fields">
          <template slot="statesCounts" slot-scope="data">
            <div style="background-color: #dbeffa">
              <b-progress-bar variant="primary" :value=data.item.statesCounts.release :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Released</div></b-progress-bar>
            </div>
            <div style="margin-top:2px; background-color: #fbe7c3">
              <b-progress-bar variant="warning" :value="data.item.statesCounts.available" :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Available</div></b-progress-bar>
            </div>
            <div style="margin-top:2px; background-color: #fbe7c3">
              <b-progress-bar variant="warning" :value="data.item.statesCounts.ringing" :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Ringing</div></b-progress-bar>
            </div>
            <div style="margin-top:2px; background-color: #e2fada">
              <b-progress-bar variant="success" :value="data.item.statesCounts.oncall" :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Oncall</div></b-progress-bar>
            </div>
            <div style="margin-top:2px; background-color: #fbe7c3">
              <b-progress-bar variant="warning" :value="data.item.statesCounts.wrapup" :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Wrapup</div></b-progress-bar>
            </div>
          </template>
          <template slot="occup" slot-scope="data">
            <div class="session-state-text"><b>oncall: </b>{{data.item.occup.oncall}}</div>
            <div class="session-state-text"><b>available: </b>{{data.item.occup.available}}</div>
            <div class="session-state-text"><b>release: </b>{{data.item.occup.release}}</div>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
export default {
  widgetName: 'MY STATISTICS',
  storageName: 'myStatistics',
  data () {
    return {
      statistics: [{
        _cellVariants: {
          ciq: 'warning',
          agents: 'success',
          //statesCounts: 'danger',
          myCpt: 'primary',
          teamCpt: 'primary',
          occup: 'primary',
          asa: 'primary',
          longest: 'primary'
        },
        ciq: 0,
        agents: 0,
        statesCounts: {
          release: 0,
          available: 0,
          ringing: 0,
          oncall: 0,
          wrapup: 0
        },
        myCpt: 0,
        teamCpt: 0,
        occup: {
          release: 0,
          available: 0,
          oncall: 0
        },
        asa: 0,
        longest: 0
        }
      ],
      periods: [
        { value:"15m", name:"Last 15 minutes"},
        { value:"30m", name:"Last 30 minutes"},
        { value:"1h/h", name:"Last Hour"},
        { value:"1d/d", name:"Today" },
        { value:"1w/w", name:"This Week" },
        { value:"1M/M", name:"This Month" }
      ],
      period: { value: "15m", name: "Last 15 minutes"},
      fields: {
        ciq: { label: 'CIQ' },
        agents: { label: 'Agents' },
        statesCounts: { label: 'States'},
        myCpt: { label: 'My CPT' },
        teamCpt: { label: 'Team CPT' },
        occup: { label: 'Occup' },
        asa: { label: 'ASA' },
        longest: { label: 'Longest' }
      },
      showCollapse: true,
    }
  },
  methods: {
    query: async function () {
      let stats = await this.$agent.p_mfa('ws_stats', 'stats', [this.period.value])
      let statesCounts = await this.$agent.p_mfa('ws_stats', 'agents_states', [])
      let totalAgents = 0
      let states = statesCounts
      Object.keys(statesCounts).forEach(function(key,index) {
        totalAgents += statesCounts[key]
      })
      this.statistics[0].statesCounts = states
      this.statistics[0].agents = totalAgents
      this.statistics[0].teamCpt = this.time(stats.cpt.cpt)
      this.statistics[0].occup.oncall = this.percent(stats.occupancy.ratio.oncall)
      this.statistics[0].occup.available = this.percent(stats.occupancy.ratio.available)
      this.statistics[0].occup.release = this.percent(stats.occupancy.ratio.available)
      this.statistics[0].asa = this.time(stats.cpt.asa)
      this.statistics[0].longest = this.time(stats.cpt.longest)
    },
    handleUpdateStates (ev) {
      let totalAgents = 0
      let states = ev.states
      Object.keys(ev.states).forEach(function(key,index) {
        totalAgents += ev.states[key]
      })
      this.statistics[0].agents = totalAgents
      this.statistics[0].statesCounts = states
    },
    handleUpdateStats: async function () {
      let stats = await this.$agent.p_mfa('ws_stats', 'stats', [this.period.value])
      this.statistics[0].teamCpt = this.time(stats.cpt.cpt)
      this.statistics[0].occup.oncall = this.percent(stats.occupancy.ratio.oncall)
      this.statistics[0].occup.available = this.percent(stats.occupancy.ratio.available)
      this.statistics[0].occup.release = this.percent(stats.occupancy.ratio.available)
      this.statistics[0].asa = this.time(stats.cpt.asa)
      this.statistics[0].longest = this.time(stats.cpt.longest)
    },
    percent (value) {
      return `${(value*100).toFixed(2)}%`
    },
    time (value) {
      if (value > 0) {
        return `${(value/1000).toFixed(1)}s`
      } else {
        return "0s"
      }
    },
    set_period (value) {
      this.period.value = value
      this.query()
    }
  },
  created () {
    this.$bus.$on('stats_agents_states', this.handleUpdateStates)
    this.$bus.$on('agent_stats', this.handleUpdateStats)
    this.query()
    if (this.$agent.vm.storage_data.myStatisticsCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.myStatisticsCollapsed
  },
  beforeDestroy () {
   this.$bus.$off('stats_agents_states', this.handleUpdateStates)
   this.$bus.$off('agent_stats', this.handleUpdateStats)
  }
}
</script>
