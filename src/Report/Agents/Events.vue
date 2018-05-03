<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents Events</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups:skills"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
  <b-row>
    <b-col>
      <b-button variant="outline-primary" class="float-right" @click="more">More</b-button>
    </b-col>
  </b-row>
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
      data: [],
      fields: {
        ts_ms: { label: 'Time', formatter: this.tsMsFormatter },
        agent: { label: 'Name', formatter: this.nameFormatter },
        agent_group: { label: 'Group', formatter: this.nameFormatter },
        state_from: { label: 'From' },
        state: { label: 'To' },
        time: { label: 'Duration', formatter: this.durationFormatter },
        release: { label: 'Release', formatter: this.nameFormatter }
      },
    }
  },
  methods: {
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_agent', 'events', query])
    },
  },
  created () {
    this.safe_query(this.query_params)
  }
}
</script>
