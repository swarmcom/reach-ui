<template>
<div>
  <div class="row">
    <div class="col"><h3>Outbound summary</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:clients"></widget-query>
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
        client: { label: 'Client', formatter: this.nameFormatter },
        placed: { label: 'Calls' },
        answered: { label: 'Answered' },
        answered_percent: { label: 'Answered [%]', formatter: (v) => this.percentageFormatter(v.answered, v.placed)},
        avg_talk_time: { label: 'Average Talk Time', formatter: this.durationFormatter },
        total_talk_time: { label: 'Total Talk Time', formatter: this.durationFormatter }
      },
    }
  },
  methods: {
    query: async function (query) {
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_outbound', 'summary', query])
    },
  },
}
</script>
