<template>
<div>
  <div class="row">
    <div class="col"><h3>Activity</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:group_by" group-by="activity" @reset="reset"></widget-query>
  <div class="row" style="margin-top: 20px"><div class="col"><h4>Inbound</h4></div>  </div>
  <b-table small striped hover :items="inbound" :fields="inbound_fields"></b-table>
  <div class="row"><div class="col"><h4>Outbound</h4></div>  </div>
  <b-table small striped hover :items="outbound" :fields="outbound_fields"></b-table>
</div>
</template>

<script>
import Query from '@/Report/Query'
import Base from '@/Report/Base'

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: {},
      inbound_fields: {
        entity: { label: 'Name', formatter: this.nameFormatter },
        rings: { label: 'Calls' },
        answered: { label: 'Answer' },
        transferred: { label: 'Transfer' },
        talk_time: { label: 'Talk', formatter: this.durationFormatter },
        hold_time: { label: 'Hold', formatter: this.durationFormatter },
        avg_talk_time: { label: 'Avg. Talk', formatter: this.durationFormatter },
        avg_hold_time: { label: 'Avg. Hold', formatter: this.durationFormatter },
      },
      outbound_fields: {
        entity: { label: 'Name', formatter: this.nameFormatter },
        calls: { label: 'Calls' },
        rings: { label: 'Placed' },
        answers: { label: 'Answer' },
        abandons: { label: 'Abandon' },
        talk_time: { label: 'Talk', formatter: this.durationFormatter },
        avg_talk_time: { label: 'Avg. Talk', formatter: this.durationFormatter },
      },
      inbound: [],
      outbound: []
    }
  },
  methods: {
    query: async function (query) {
      this.inbound = await this.$agent.p_mfa('ws_report', 'query', ['report_activity', 'inbound', query])
      this.outbound = await this.$agent.p_mfa('ws_report', 'query', ['report_activity', 'outbound', query])
    },
  }
}
</script>
