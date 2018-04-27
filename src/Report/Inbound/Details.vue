<template>
<div>
  <div class="row">
    <div class="col"><h3>Inbound traffic details</h3></div>
  </div>
  <widget-query v-model="query_params" enable="step:empty_intervals"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields">
    <template slot="abandoned" slot-scope="data">
      {{ data.item.abandoned }} / {{ percentageFormatter(data.item.abandoned, data.item.ring_count) }}
    </template>
  </b-table>
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
        call_count: { label: "Calls" },
        ring_count: { label: "Attempts" },
        answered_count: { label: "Answered" },
        abandoned: { label: "Abandon" },
        voicemail: { label: "VM"  },
        sla_count: { label: "SLA" },
        cpt: { label: "CPT", formatter: this.durationFormatter },
        asa: { label: "ASA", formatter: this.durationFormatter },
      },
    }
  },
  methods: {
    query (query) {
      query = this.set_query_params(query)
      return this.$agent.p_mfa('ws_report', 'query', ['report_inqueue', 'details', query])
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
