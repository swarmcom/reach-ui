<template>
<div>
  <b-row style="margin-top:6px">
    <b-col sm="8">
  <b-form-select class="pointer" size="sm" v-model="period.value" @change="set_period">
    <option v-for="period in periods" :value="period.value">{{period.name}}</option>
  </b-form-select>
    </b-col>
  <b-col sm="4">
    <b-btn size="sm" class="pointer" @click="refresh" variant="outline-secondary">Refresh</b-btn>
  </b-col>
  </b-row>
  <b-table style="margin-top:10px" small striped bordered hover
    :items="stats"
    :fields="fieldsStats">
    <template slot="occupancy" slot-scope="data">
      <div class="session-state-text">
        {{data.item.occupancy ? data.item.occupancy + "%" : "0%"}}
      </div>
    </template>
    <template slot="cpt" slot-scope="data">
      <div class="session-state-text">
        {{data.item.cpt ? msToMs(data.item.cpt) : "&#45;&#45;"}}
      </div>
    </template>-->
    <template slot="calls" slot-scope="data">
      <div class="session-state-text">
        {{data.item.calls ? data.item.calls : "--"}}
      </div>
    </template>
  </b-table>
</div>
</template>
<script>
import Common from '@/Admin/Common'
export default {
  name: 'monitor-agents-groups-stats',
  mixins: [Common],
  props: {
    groups: Array
  },
  data () {
    return {
      fieldsStats: {
        occupancy: { label: 'Occup', sortable: false, variant: "primary", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        cpt: { label: 'CPT', sortable: false, variant: "primary", thClass:"table-header-text-center", tdClass:"table-body-text-center" },
        calls: { label: 'Calls', variant: "primary", sortable: false, thClass:"table-header-text-center", tdClass:"table-body-text-center" }
      },
      periods: [
        { value:"15m", name:"Last 15 minutes"},
        { value:"30m", name:"Last 30 minutes"},
        { value:"1h", name:"Last Hour"},
        { value:"1d", name:"Today" },
        { value:"1w", name:"This Week" },
        { value:"1M", name:"This Month" }
      ],
      stats: [],
      period: { value: "15m", name: "Last 15 minutes"}
    }
  },
  methods: {
    query: async function() {
      this.updateStats(this.period.value)
    },
    refresh () {
      this.updateStats(this.period.value)
    },
    updateStats: async function(val) {
      let empty = {
        'occupancy': null,
        'cpt': null,
        'calls': null
      }
      let response = await this.$agent.p_mfa('ws_stats', 'agent_manager_stats', [val, 'group_id'])
      this.stats = []
      for (let key of this.groups) {
        let stats = response.find(item => item.group_id === key.id)
          if (stats !== undefined) {
            this.stats.push(stats)
        }
        else {
            this.stats.push(empty)
          }
      }
    },
    set_period (value) {
      this.period.value = value
      this.updateStats(this.period.value)
    },
    handleState ({ tag, info }) {
      if (tag === 'change') {
        this.updateStats(this.period.value)
      }
    }
  },
  created () {
    this.query()
    this.$bus.$on('agents_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('agents_state', this.handleState)
  },
}
</script>