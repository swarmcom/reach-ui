<template>
<div>
  <div class="row">
    <div class="col"><h3>Inbound session events</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="data" :fields="fields"></b-table>
</div>
</template>

<script>
import Base from '@/Report/Base'

export default {
  props: ['uuid'],
  mixins: [Base],
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        ts_start_ms: { label: 'Time', formatter: this.tsMsFormatter },
        state_from: { label: 'From' },
        state: { label: 'To' },
        time: { label: 'Time', formatter: this.durationFormatter },
        queue: { label: 'Queue', formatter: this.nameFormatter },
        agent: { label: 'Agent', formatter: this.nameFormatter }
      },
    }
  },
  methods: {
    query (params) {
      params.uuid = this.uuid
      return this.$agent.p_mfa('ws_report', 'query', ['report_events', 'inqueue', params])
    },
  },
  created () {
    this.safe_query(this.query_params)
  },
}
</script>
