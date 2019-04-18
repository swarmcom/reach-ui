<template>
<div>
  <div class="row">
    <div class="col"><h3>Outbound session events</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="data" :fields="fields"></b-table>
  <b-btn @click="$router.go(-1)">
    Back
  </b-btn>
</div>
</template>

<script>
import Base from '@/Report/Base'

export default {
  props: ['id'],
  mixins: [Base],
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        ts_ms: { label: 'Time', formatter: this.tsMsFormatter },
        state_from: { label: 'From' },
        state: { label: 'To' },
        time: { label: 'Time', formatter: this.durationFormatter }
      },
    }
  },
  methods: {
    query (params) {
      params.uuid = this.id
      return this.$agent.p_mfa('ws_report', 'query', ['report_events', 'outgoing', params])
    },
  },
  created () {
    this.safe_query(this.query_params)
  },
}
</script>
