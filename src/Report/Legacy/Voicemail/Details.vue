<template>
<div>
  <div class="row">
    <div class="col"><h3>Voicemail details</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:clients:sla"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
</div>
</template>

<script>
import Query from '@/Report/Legacy/Query'
import Base from '@/Report/Base'

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        ts_from: { label: "From", formatter: this.tsFormatter },
        ts_to: { label: "To", formatter: this.tsFormatter },
        queue: { label: 'Name', formatter: this.nameFormatter },
        vm_left: { label: 'Total' },
        vm_answered: { label: 'Answered' },
        vm_callback_placed: { label: 'Callback' },
        returned_percent: { label: 'Callback', formatter: (v, _, item) => this.percentageFormatter(item.vm_callback_placed, item.vm_answered) },
        vm_callback_answered: { label: 'Answered by Caller' },
        answered_caller_percent: {
          label: '% Answered by Caller',
          formatter: (v, _, item) => this.percentageFormatter(item.vm_callback_answered, item.vm_answered)
        },
        sla_count: { label: 'SLA' },
        vm_sla_count: { label: 'Voicemail SLA' },
        asa: { label: 'ASA', formatter: this.durationFormatter },
        avg_time_to_callback: { label: 'Avg. Time to Callback', formatter: this.durationFormatter(v) },
      },
    }
  },
  methods: {
    query: async function (query) {
      query.group_by = "client"
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_voicemail', 'summary', query])
    },
  },
}
</script>

