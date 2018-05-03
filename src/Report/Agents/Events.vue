<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents Events {{ header }}</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups:skills"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields" @row-clicked="click"></b-table>
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
      header: '',
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
    maybe_set_header: async function () {
      let q = this.query_params
      if ('release' in q) {
        if (q.release) {
          let d = await this.$agent.p_mfa('ws_agent', 'get_release', [q.release])
          this.header = `for release "${d.name}"`
        } else {
          this.header = 'for release not set'
        }
      }
    },
    click ({uuid}) {
      this.$router.push(`/reports/agent/session/events/${uuid}`)
    },
  },
  created () {
    this.query_params = this.set_query_params(this.query_params)
    this.safe_query(this.query_params)
    this.maybe_set_header()
  }
}
</script>
