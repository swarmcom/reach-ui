<template>
<div>
  <b-form-select style="margin-top:8px" class="pointer" size="sm" v-model="period.value" @change="set_period">
    <option v-for="period in periods" :value="period.value">{{period.name}}</option>
  </b-form-select>
  <b-table style="margin-top:10px" small striped bordered hover
    :items="stats"
    :fields="fieldsStats">
    <template slot="occupancy" slot-scope="data">
      <div class="session-state-text">
        {{data.item.occupancy.oncall ? `${(data.item.occupancy.ratio.oncall*100).toFixed(2)}%` : "0%"}}
      </div>
    </template>
    <template slot="cpt" slot-scope="data">
      <div class="session-state-text">
        {{data.item.cpt.avg.oncall ? `${(data.item.cpt.avg.oncall/1000).toFixed(1)}s` : "0s"}}
      </div>
    </template>
  </b-table>
</div>
</template>
<script>
export default {
  name: 'monitor-agents-groups-stats',
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
        { value:"1m", name:"This Month" }
      ],
      stats: [],
      period: { value: "15m", name: "Last 15 minutes"}
    }
  },
  methods: {
    query: async function() {
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get')
      this.updateStats(this.period.value)
    },
    updateStats: async function(val) {
      let i = 0
      this.stats = []
      for (let key of this.groups) {
        let stats = await this.$agent.p_mfa('ws_stats', 'stats', [{ agent_group_id: key.id }, val])
        this.stats.push(stats)
        i++
      }
    },
    set_period (value) {
      this.period.value = value
      this.updateStats(this.period.value)
    },
    handleState ({ tag, info }) {
      console.log(tag)
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