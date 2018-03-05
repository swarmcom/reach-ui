<template>
<div v-if="$agent.permAllowed('myStatistics-widget')">
  <toggle-bar style="cursor: move"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseMyStatistics" class="mt-2 itemDragable">
    <b-container style="margin-top:10px">
      <b-row>
        <b-col sm="4">
          <b-form-select class="pointer" size="sm" v-model="period.value" @change="set_period">
            <option v-for="period in periods" :value="period.value" :key="period.name">{{period.name}}</option>
          </b-form-select>
        </b-col>
        <b-col sm="8">
          <b-form-group label="Team tags:">
            <b-form-checkbox-group id="tags" name="team tags" v-model="selectedSkills" :options="skillsOptions">
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-container style="margin-left:15px; min-width: 600px">
          <b-row>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-orange">
                CIQ<br>
                <span class="stats-value">{{statistics[0].ciq}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-green">
                Agents<br>
                <span class="stats-value">{{statistics[0].agents}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 102px !important; padding-right:10px; border-right: 2px solid white;">
              <div style="background-color: #dbeffa">
                <b-progress-bar :value="statistics[0].statesCounts.release" :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Released</div>
                </b-progress-bar>
              </div>
              <div style="margin-top:2px; background-color: #fbe7c3">
                <b-progress-bar variant="warning" :value="statistics[0].statesCounts.available"
                                :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Available</div>
                </b-progress-bar>
              </div>
              <div style="margin-top:2px; background-color: #fbe7c3">
                <b-progress-bar variant="warning" :value="statistics[0].statesCounts.ringing"
                                :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Ringing</div>
                </b-progress-bar>
              </div>
              <div style="margin-top:2px; background-color: #e2fada">
                <b-progress-bar variant="success" :value="statistics[0].statesCounts.oncall"
                                :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Oncall</div>
                </b-progress-bar>
              </div>
              <div style="margin-top:2px; background-color: #fbe7c3">
                <b-progress-bar variant="warning" :value="statistics[0].statesCounts.wrapup"
                                :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Wrapup</div>
                </b-progress-bar>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                My CPT<br>
                <span class="stats-value">{{statistics[0].myCpt}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                Team CPT<br>
                <span class="stats-value">{{statistics[0].teamCpt}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                Occup.<br>
                <span class="stats-value">{{statistics[0].occup.oncall}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                ASA<br>
                <span class="stats-value">{{statistics[0].asa}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                Longest<br>
                <span class="stats-value">{{statistics[0].longest}}</span>
              </div>
            </b-col>
            <b-col>
              <b-btn size="sm" class="pointer" @click="refresh" variant="outline-secondary">Refresh</b-btn>
            </b-col>
          </b-row>
        </b-container>
      </b-row>
    </b-container>
  </b-collapse>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import Storage from '@/Storage'

export default {
  widgetName: 'MY STATISTICS',
  name: 'my-statistics',
  mixins: [Common, Storage],
  data () {
    return {
      statistics: [{
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
      }],
      periods: [
        {value: "15m", name: "Last 15 minutes"},
        {value: "30m", name: "Last 30 minutes"},
        {value: "1h", name: "Last Hour"},
        {value: "1d", name: "Today"},
        {value: "1w", name: "This Week"},
        {value: "1M", name: "This Month"}
      ],
      selectedSkills: [],
      skillsOptions: [],
      period: {value: "15m", name: "Last 15 minutes"},
      showCollapse: true,
      maxAgents: 1
    }
  },
  watch: {
    selectedSkills: function () {
      this.my_stats_query()
      this.states_query()
    }
  },
  methods: {
    query () {
      this.states_query()
      this.ciq_query()
      this.my_stats_query()
    },
    my_stats_query: async function () {
      let myStats = await this.$agent.p_mfa('ws_stats', 'my_stats', [this.period.value, this.selectedSkills])
      this.statistics[0].myCpt = this.time(myStats.cpt)
      this.statistics[0].teamCpt = this.time(myStats.team_cpt)
      this.statistics[0].occup.oncall = myStats.occupancy
      this.statistics[0].asa = this.time(myStats.asa)
      this.statistics[0].longest = this.time(myStats.longest)

    },
    states_query: async function () {
      let statesCounts = await this.$agent.p_mfa('ws_stats', 'my_stats_states', [this.list2skills(this.selectedSkills)])
      let totalAgents = 0
      Object.keys(statesCounts).forEach(function (key, index) {
        totalAgents += statesCounts[key]
      })
      this.statistics[0].statesCounts = statesCounts
      this.statistics[0].agents = totalAgents
      totalAgents < 1 ? this.maxAgents=1 : this.maxAgents=totalAgents 
    },
    ciq_query: async function () {
      let ciq = await this.$agent.p_mfa('ws_stats', 'ciq', [])
      this.statistics[0].ciq = ciq.ciq
    },
    handleUpdateMyStats (ev) {
      this.my_stats_query()
    },
    handleUpdateStatesStats (ev) {
      this.states_query()
      this.my_stats_query()
    },
    handleCiq (ev) {
      this.ciq_query()
    },
    refresh () {
      this.my_stats_query()
      this.states_query()
    },
    percent (value) {
      if (value > 0) {
        return `${(value * 100).toFixed(2)}%`
      } else {
        return "0%"
      }
    },
    time (value) {
      if (value > 0)
        return this.msToMs(value)
      else
        return "--"
    },
    set_period (value) {
      this.period.value = value
      this.my_stats_query()
    }
  },
  created () {
    this.$bus.$on('agent_group_state', this.handleUpdateStatesStats)
    this.$bus.$on('inqueue_state', this.handleCiq)
    this.$bus.$on('agent_stats', this.handleUpdateMyStats)
    this.query()
    this.skillsOptions = this.skills2list(this.$agent.vm.agent.skills)
    this.maybeInitLocal().loadLocal('showCollapse')
  },
  beforeDestroy () {
    this.$bus.$off('agent_group_state', this.handleUpdateStatesStats)
    this.$bus.$off('inqueue_state', this.handleCiq)
    this.$bus.$off('agent_stats', this.handleUpdateMyStats)
  },
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    }
  },
}
</script>

<style lang="scss">

  .form-check {
    margin-bottom: unset;
  }

</style>

