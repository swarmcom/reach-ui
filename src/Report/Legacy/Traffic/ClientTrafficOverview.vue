<template>
<div>
  <div class="row">
    <div class="col"><h3>Client traffic overview</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:clients:sla"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
</div>

</template>

<script>
import Query from '@/Report/Legacy/Query'
import Base from '@/Report/Base'
import Common from '@/Report/Legacy/Common'

export default {
  components: { 'widget-query': Query },
  mixins: [Base, Common],
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        client: { label: 'Client', formatter: this.nameFormatter },
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
      query.group_by = "client"
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_traffic', 'summary', query])
    },
  },
}
</script>
