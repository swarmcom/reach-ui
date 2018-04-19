<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents Availability</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups:queues:queue_groups:clients"></widget-query>
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
        ts_from: { label: 'From', formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm") },
        ts_to: { label: 'To', formatter: ts => new Moment(ts, "x").format("YYYY-MM-DD HH:mm") },
        call_count: { label: 'Calls' },
        ring_count: { label: 'Offered' },
        answered_count: { label: 'Answered' },
        voicemail: { label: 'VM' },
        transferred_out: { label: 'Trans' },
        abandoned: { label: 'Abandon' },
        sla_count: { label: 'SLA' },
        abandoned_percent: {
          label: 'Abandon [%]',
          formatter: (v, _, item) => (item.call_count !== undefined && item.call_count !== 0) ? (100*item.abandoned/item.call_count).toFixed(1)+'%' : 'NA'
        },
        cpt: {
          label: 'CPT',
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        },
        asa: {
          label: 'ASA',
          formatter: (v, _, item) => (item.call_count !== undefined) ? this.durationFormatter(v) : 'NA'
        }
      },
      onlyActive: 'false',
      sla: 10,
      interval: 60,
    }
  },
  methods: {
    query: async function (query) {
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['availability', 'report', query])
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
