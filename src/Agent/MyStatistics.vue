<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseMyStatistics" class="mt-2">
    <b-row>
      <b-col>
        <b-table style="margin-top:10px" small bordered
          :items="statistics"
          :fields="fields">
          <template slot="statesCounts" slot-scope="data">
            <div style="background-color: #dbeffa">
              <b-progress-bar variant="danger" :value=data.item.statesCounts.release :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Released</div></b-progress-bar>
            </div>
            <div style="margin-top:2px; background-color: #fbe7c3">
              <b-progress-bar variant="danger" :value="data.item.statesCounts.available" :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Available</div></b-progress-bar>
            </div>
            <div style="margin-top:2px; background-color: #fbe7c3">
              <b-progress-bar variant="danger" :value="data.item.statesCounts.ringing" :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Ringing</div></b-progress-bar>
            </div>
            <div style="margin-top:2px; background-color: #e2fada">
              <b-progress-bar variant="danger" :value="data.item.statesCounts.oncall" :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Oncall</div></b-progress-bar>
            </div>
            <div style="margin-top:2px; background-color: #fbe7c3">
              <b-progress-bar variant="danger" :value="data.item.statesCounts.wrapup" :max="data.item.agents" show-progress><div class="agent-state-text" style="min-width:100%; color:black">Wrapup</div></b-progress-bar>
            </div>
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
                    occup: 0,
                    asa: 0,
                    longest: 0
                    }
                  ],
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
      let statesCounts = await this.$agent.p_mfa('ws_stats', 'agents_states', [])
      let totalAgents = 0
      let states = statesCounts
      Object.keys(statesCounts).forEach(function(key,index) {
        totalAgents += statesCounts[key]
      })
      this.statistics[0].statesCounts = states
      this.statistics[0].agents = totalAgents

    },
    handleUpdate (ev) {
      let totalAgents = 0
      let states = ev.states
      Object.keys(ev.states).forEach(function(key,index) {
        totalAgents += ev.states[key]
      })
      this.statistics[0].agents = totalAgents
      this.statistics[0].statesCounts = states
    }
  },
  created () {
    this.$bus.$on('stats_agents_states', this.handleUpdate)
    this.query()
    if (this.$agent.vm.storage_data.myStatisticsCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.myStatisticsCollapsed
  },
  beforeDestroy () {
   this.$bus.$off('stats_agents_states', this.handleUpdate)
  }
}
</script>
