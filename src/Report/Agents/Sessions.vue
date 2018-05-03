<template>
<div>
  <b-row>
    <b-col><h3>Agents sessions</h3></b-col>
  </b-row>
  <widget-query v-model="query_params" enable="range:agents:agent_groups"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields" tbody-tr-class="pointer" @row-clicked="click"></b-table>
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
        ts_ms: { label: 'Time', formatter: this.tsFormatter },
        state_total: { label: 'Total', formatter: (v, name, item) => this.durationFormatter(item.states.total) },
        state_release: { label: 'Release', formatter: (v, name, item) => this.durationFormatter(item.states.states.release) },
        state_available: { label: 'Available', formatter: (v, name, item) => this.durationFormatter(item.states.states.available) },
        state_oncall: { label: 'Oncall', formatter: (v, name, item) => this.durationFormatter(item.states.states.oncall) },
        agent_name: { label: 'Name', formatter: (v, name, item) => item.agent.name },
        agent_login: { label: 'Login', formatter: (v, name, item) => item.agent.login },
        agent_peer: { label: 'Peer IP', formatter: (v, name, item) => item.peer },
      },
    }
  },
  methods: {
    query (params) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_sessions', 'agent', params])
    },
    click ({uuid}) {
      this.$router.push(`/reports/agent/session/events/${uuid}`)
    },
  },
  created () {
    this.safe_query(this.query_params)
  },
}
</script>
