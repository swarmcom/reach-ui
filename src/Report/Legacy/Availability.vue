<template>
<div>
  <div class="row">
    <div class="col"><h3>Availability</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups:queues:queue_groups:clients:step:sla"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
</div>
</template>

<script>
import Query from '@/Report/Legacy/Query'
import Base from '@/Report/Base'
import Moment from 'moment'

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: { step: 60, sla: 10 },
      data: [],
      fields: {
        ts_from: { label: 'From', formatter: this.tsFormatter },
        ts_to: { label: 'To', formatter: this.tsFormatter },
        call_count: { label: 'Calls' },
        ring_count: { label: 'Placed' },
        answered_count: { label: 'Answered' },
        voicemail: { label: 'VM' },
        transferred_out: { label: 'Trnf.' },
        abandoned: { label: 'Abndn' },
        abandoned_percent: { label: 'Abndn %', formatter: (v, _, item) => this.percentageFormatter(item.abandoned, item.call_count) },
        cpt: { label: 'CPT',formatter: this.durationFormatter },
        asa: { label: 'ASA',formatter: this.durationFormatter },
        sla_count: { label: 'SLA' },
      },
    }
  },
  methods: {
    query: async function (query) {
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['availability', 'report', query])
    }
  },
}
</script>
