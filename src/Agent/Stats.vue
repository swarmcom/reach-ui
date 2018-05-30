<template>
<div v-access:widget-my-statistics>
  <toggle-bar style="cursor: move"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseMyStatistics" class="mt-2 itemDragable">
    <b-row style="margin-top:10px">
      <b-col sm="4">
        <b-form-select class="pointer" size="sm" v-model="period.value" @change="set_period">
          <option v-for="period in periods" :value="period.value" :key="period.name">{{period.name}}</option>
        </b-form-select>
      </b-col>
    </b-row>
    <b-row style="margin-top:10px">
      <b-col>
        <b-container>
          <b-row>
            <b-col style="padding:0; max-width: 60px !important">
              <ciq class="table-body-orange"></ciq>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-green">
                Agents<br>
                <span class="stats-value">{{stats.agents}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 102px !important; padding-right:10px; border-right: 2px solid white;">
              <div style="background-color: #dbeffa">
                <b-progress-bar :value="stats.statesCounts.release" :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Released</div>
                </b-progress-bar>
              </div>
              <div style="margin-top:2px; background-color: #fbe7c3">
                <b-progress-bar variant="warning" :value="stats.statesCounts.available"
                                :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Available</div>
                </b-progress-bar>
              </div>
              <div style="margin-top:2px; background-color: #fbe7c3">
                <b-progress-bar variant="warning" :value="stats.statesCounts.ringing"
                                :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Ringing</div>
                </b-progress-bar>
              </div>
              <div style="margin-top:2px; background-color: #e2fada">
                <b-progress-bar variant="success" :value="stats.statesCounts.oncall"
                                :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Oncall</div>
                </b-progress-bar>
              </div>
              <div style="margin-top:2px; background-color: #fbe7c3">
                <b-progress-bar variant="warning" :value="stats.statesCounts.wrapup"
                                :max="maxAgents" show-progress>
                  <div class="agent-state-texts">Wrapup</div>
                </b-progress-bar>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                My CPT<br>
                <span class="stats-value">{{stats.myCpt}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                Team CPT<br>
                <span class="stats-value">{{stats.teamCpt}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                Occup.<br>
                <span class="stats-value">{{stats.occup.oncall}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                ASA<br>
                <span class="stats-value">{{stats.asa}}</span>
              </div>
            </b-col>
            <b-col style="padding:0; max-width: 60px !important">
              <div class="table-body-blue">
                Longest<br>
                <span class="stats-value">{{stats.longest}}</span>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import CIQ from '@/Agent/Stats/CIQ'
import Storage from '@/Storage'

export default {
  widgetName: 'My statistics',
  name: 'my-statistics',
  mixins: [Common, Storage],
  components: {
    ciq: CIQ
  },
  data () {
    return {
      stats: {
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
      },
      periods: [
        {value: "15m", name: "Last 15 minutes"},
        {value: "30m", name: "Last 30 minutes"},
        {value: "1h", name: "Last Hour"},
        {value: "1d", name: "Today"},
        {value: "1w", name: "This Week"},
        {value: "1M", name: "This Month"}
      ],
      period: {value: "15m", name: "Last 15 minutes"},
      showCollapse: true,
      maxAgents: 1
    }
  },
  methods: {
    query () {
      this.states_query()
      this.ciq_query()
      this.my_stats_query()
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
    this.query()
    this.maybeInitLocal().loadLocal('showCollapse')
  },
  beforeDestroy () {
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
