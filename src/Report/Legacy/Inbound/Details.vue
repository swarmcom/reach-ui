<template>
<div>
  <div class="row">
    <div class="col"><h3>Inbound traffic details</h3></div>
  </div>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
</div>

</template>

<script>
import Base from '@/Report/Base'

export default {
  mixins: [Base],
  data () {
    return {
      query_params: { step: 60 },
      data: [],
      fields: {
        ts_from: { label: "From", formatter: this.tsFormatter },
        ts_to: { label: "To", formatter: this.tsFormatter },
        call_count: { label: "Calls" },
        ring_count: { label: "Attempts" },
        answered_count: { label: "Answered" },
        abandoned: { label: "Abandon" },
        abandoned_percent: { label: "Abandon [%]", formatter: (v, _, item) => this.percentageFormatter(item.abandoned, item.ring_count) },
        voicemail: { label: "VM"  },
        sla_count: { label: "SLA" },
        cpt: { label: "CPT", formatter: this.durationFormatter },
        asa: { label: "ASA", formatter: this.durationFormatter },
      },
    }
  },
  methods: {
    query: async function (query) {
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_inqueue', 'details', query])
    },
  },
}
</script>
