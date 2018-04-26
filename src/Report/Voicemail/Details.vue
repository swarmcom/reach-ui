<template>
<div>
  <div class="row">
    <div class="col"><h3>Voicemail details</h3></div>
  </div>
  <widget-query v-model="query_params" enable="step:empty_intervals"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
</div>
</template>

<script>
import Query from '@/Report/Query'
import Base from '@/Report/Base'

function maybe_copy_params(Dst, Src, Params) {
  Params.forEach( k => { if (Src[k]) { Dst[k] = parseInt(Src[k]) } })
  return Dst
}

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: { step: 60, empty_intervals: false },
      data: [],
      fields: {
        ts_from: { label: "From", formatter: this.tsFormatter },
        ts_to: { label: "To", formatter: this.tsFormatter },
        call_count: { label: 'Calls' },
        ring_count: { label: 'Attempts' },
        answered_count: { label: 'Answer' },
        cpt: { label: "CPT", formatter: this.durationFormatter },
        asa: { label: "ASA", formatter: this.durationFormatter },
        sla_count: { label: 'SLA' },
        callback_count: { label: 'Callbacks' },
        callback_answered_count: { label: 'Answer' },
        callback_abandoned_count: { label: 'Abandon' },
        callback_cpt: { label: 'CPT' },
      },
    }
  },
  methods: {
    query (query) {
      query = this.set_query_params(query)
      return this.$agent.p_mfa('ws_report', 'query', ['report_voicemail', 'details', query])
    },
    set_query_params (params) {
      let q = this.$route.query
      maybe_copy_params(params, q, ['date_start', 'date_end', 'sla'])
      let entity = `${q.group_by}_id`
      params[entity] = parseInt(q.entity_id)
      return params
    }
  },
  created () {
    this.query_params = this.set_query_params(this.query_params)
    this.safe_query(this.query_params)
  },
}
</script>

