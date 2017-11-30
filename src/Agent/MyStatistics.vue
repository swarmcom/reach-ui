<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseMyStatistics" class="mt-2">
    <b-row>
      <b-col cols="2">
        <b-form-select class="pointer" size="sm" v-model="period.value" @change="set_period">
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
            <div style="text-align:center;">{{data.item.occup.available}}</div>
            <!--<div class="session-state-text"><b>oncall: </b>{{data.item.occup.oncall}}</div>
            <div class="session-state-text"><b>ringing: </b>{{data.item.occup.ringing}}</div>
            <div class="session-state-text"><b>available: </b>{{data.item.occup.available}}</div>
            <div class="session-state-text"><b>release: </b>{{data.item.occup.release}}</div>-->
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
        { value:"1h", name:"Last Hour"},
        { value:"1d", name:"Today" },
        { value:"1w", name:"This Week" },
        { value:"1M", name:"This Month" }
      ],
      period: { value: "15m", name: "Last 15 minutes"},
      fields: {
        ciq: { label: 'CIQ', variant: 'warning', thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        agents: { label: 'Agents', variant: 'success', thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        statesCounts: { label: 'States', thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        myCpt: { label: 'My CPT', variant: 'primary', thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        teamCpt: { label: 'Team CPT', variant: 'primary', thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        occup: { label: 'Occup', variant: 'primary', thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        asa: { label: 'ASA', variant: 'primary', thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        longest: { label: 'Longest', variant: 'primary', thClass:"table-header-text-center", tdClass:"table-body-text-center" }
      },
      showCollapse: true,
    }
  },
  methods: {
    query () {
      this.states_query()
      this.stats_query()
      this.group_query()
      this.ciq_query()
    },
    states_query: async function() {
      let statesCounts = await this.$agent.p_mfa('ws_stats', 'agents_states', [])
      let totalAgents = 0
      let states = statesCounts
      Object.keys(statesCounts).forEach(function(key,index) {
        totalAgents += statesCounts[key]
      })
      this.statistics[0].statesCounts = states
      this.statistics[0].agents = totalAgents
    },
    ciq_query: async function () {
      let ciq = await this.$agent.p_mfa('ws_stats', 'ciq', [])
      this.statistics[0].ciq = ciq.ciq
    },
    stats_query: async function () {
      let stats = await this.$agent.p_mfa('ws_stats', 'stats', [this.period.value])
      this.statistics[0].myCpt = this.time(stats.cpt.avg.oncall)
    },
    group_query: async function () {
      let stats = await this.$agent.p_mfa('ws_stats', 'tagged_stats', [this.period.value])
      this.statistics[0].teamCpt = this.time(stats.cpt.avg.oncall)
      this.statistics[0].occup.oncall = this.percent(stats.occupancy.ratio.oncall)
      this.statistics[0].occup.ringing = this.percent(stats.occupancy.ratio.ringing)
      this.statistics[0].occup.available = this.percent(stats.occupancy.ratio.available)
      this.statistics[0].occup.release = this.percent(stats.occupancy.ratio.release)
      this.statistics[0].asa = this.time(stats.cpt.avg.answer)
      this.statistics[0].longest = this.time(stats.cpt.max.oncall)
    },
    handleUpdateSkills (ev) {
      this.states_query()
      this.stats_query()
      this.group_query()
      this.ciq_query()
    },
    handleUpdateMyStats (ev) {
      this.stats_query()
      this.group_query()
    },
    handleUpdateStatesStats (ev) {
      this.states_query()
      this.stats_query()
      this.group_query()
    },
    handleCiq (ev) {
      this.ciq_query()
    },
    handleUpdateStats: async function () {
      this.stats_query()
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
    set_period (value) {
      this.period.value = value
      this.group_query()
      this.stats_query()
    }
  },
  created () {
    this.$bus.$on('agent_group_state', this.handleUpdateStatesStats)
    this.$bus.$on('inqueue_state', this.handleCiq)
    this.$bus.$on('agent_stats', this.handleUpdateMyStats)
    this.$bus.$on('agent_skills', this.handleUpdateSkills)
    this.query()
    if (this.$agent.vm.storage_data.myStatisticsCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.myStatisticsCollapsed
  },
  beforeDestroy () {
    this.$bus.$off('agent_group_state', this.handleUpdateStatesStats)
    this.$bus.$off('inqueue_state', this.handleCiq)
    this.$bus.$off('agent_stats', this.handleUpdateMyStats)
    this.$bus.$off('agent_skills', this.handleUpdateSkills)
  }
}
</script>
