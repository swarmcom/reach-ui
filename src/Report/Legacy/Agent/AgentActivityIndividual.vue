<template>
<div>
  <div class="row">
    <div class="col"><h3>Agent Activity</h3></div>
  </div>
  <widget-query v-model="query_params" enable=agents:range></widget-query>
  <div class="row" style="margin-top: 20px"><div class="col"><h4>Inbound</h4></div>  </div>
  <b-table small striped hover :items="inbound" :fields="inbound_fields"></b-table>
  <div class="row"><div class="col"><h4>Outbound</h4></div>  </div>
  <b-table small striped hover :items="outbound" :fields="outbound_fields"></b-table>
</div>
</template>

<script>
import Query from '@/Report/Legacy/Query'
import Moment from 'moment'

export default {
  name: 'AgentActivityIndividual',
  components: { 'widget-query': Query },
  data () {
    return {
      query_params: {},
      inbound_fields: {
        agent_name: { label: 'Name', sortable: true },
        answered: { label: 'Calls' },
        talk_time: { label: 'Talk', formatter: this.durationFormatter },
        completed: { label: 'Completed' },
        transferred: { label: 'Transferred' },
        avg_hold_time: { label: 'Avg. Hold', formatter: this.durationFormatter },
      },
      outbound_fields: {
        agent_name: { label: 'Name', sortable: true },
        started: { label: 'Calls' },
        placed: { label: 'Placed' },
        answered: { label: 'Answered' },
        talk_time: { label: 'Talk Time', formatter: this.durationFormatter },
      },
      inbound: [],
      outbound: []
    }
  },
  methods: {
    query: async function (query) {
      this.inbound = await this.$agent.p_mfa('ws_report', 'query', ['agent_activity', 'inbound', query])
      this.outbound = await this.$agent.p_mfa('ws_report', 'query', ['agent_activity', 'outbound', query])
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    }
  },
  watch: {
    query_params (value) {
      this.query(value)
      return value
    }
  }
}
</script>
