<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents Productivity</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
</div>
</template>

<script>
import Query from '@/Report/Legacy/Query'
import Moment from 'moment'

export default {
  components: { 'widget-query': Query },
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        agent_name: { label: 'Name' },
        occupancy: { label: 'Ocpncy', formatter: v => v ? v + '%' : 0 + '%' },
        cpt: { label: 'CPT', formatter: v => v ? this.durationFormatter(v) : 'NA' },
        total_time: { label: 'Logged In', formatter: v => this.durationFormatter(v) },
        logged_out: { label: 'Logged Out', formatter: (v, _, item) => this.durationFormatter(item.range - item.total_time) },
        released: { label: 'Rel.', formatter: v => this.durationFormatter(v) },
        suspended: { label: 'Susp.', formatter: v => this.durationFormatter(v) },
        idle: { label: 'Idle', formatter: v => this.durationFormatter(v) },
        ringing: { label: 'Ring', formatter: v => this.durationFormatter(v) },
        talk_total: { label: 'Talk', formatter: v => this.durationFormatter(v) },
        wrapup: { label: 'Wrap Up', formatter: v => this.durationFormatter(v) },
      },
    }
  },
  methods: {
    query: async function (query) {
      try {
        this.data = await this.$agent.p_mfa('ws_report', 'query', ['productivity', 'agent', query])
      }
      catch (e) {
        this.$notify({ title: 'Report Error:', text: e, type: 'error' })
      }
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    }
  },
  watch: {
    query_params (value) {
      this.query(value)
      return value
    }
  }
}
</script>

