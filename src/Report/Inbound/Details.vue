<template>
<div>
  <div class="row">
    <div class="col"><h3>Inbound traffic details</h3></div>
  </div>
  <widget-query v-model="query_params" enable="step:empty_intervals" @reset="reset"></widget-query>
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
      header: '',
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
      return this.$agent.p_mfa('ws_report', 'query', ['report_inqueue', 'details', query])
    },
  },
  created () {
    if (! this.is_standalone() && ! this.is_cached()) {
      this.query_params = this.set_query_params(this.query_params)
      this.safe_query(this.query_params)
    }
  },
}
</script>
