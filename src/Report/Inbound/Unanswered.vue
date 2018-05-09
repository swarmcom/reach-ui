<template>
<div>
  <div class="row">
    <div class="col"><h3>Unanswered inbound calls {{ header }}</h3></div>
  </div>
  <widget-query v-if="is_standalone()" v-model="query_params" enable="range:queues:queue_groups:clients"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields" tbody-tr-class="pointer" @row-clicked="click">
    <template slot="state_total" slot-scope="data">
      {{ durationFormatter(data.item.states.total) }}
    </template>
    <template slot="state_inqueue" slot-scope="data">
      {{ durationFormatter(data.item.states.states.inqueue) }}
    </template>
    <template slot="state_agent" slot-scope="data">
      {{ durationFormatter(data.item.states.states.agent) }}
    </template>
    <template slot="line_in" slot-scope="data">
      {{ nameFormatter(data.item.line_in) }}
    </template>
    <template slot="client" slot-scope="data">
      {{ nameFormatter(data.item.client) }}
    </template>
    <template slot="queue" slot-scope="data">
      {{ nameFormatter(data.item.queue) }}
    </template>
    <template slot="caller_ip" slot-scope="data">
      {{ data.item.caller_ip }}
    </template>
    <template slot="caller" slot-scope="data">
      {{ data.item.caller }}
    </template>
    <template slot="calling" slot-scope="data">
      {{ data.item.calling }}
    </template>
  </b-table>
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
  props: [],
  data () {
    return {
      query_params: {},
      data: [],
      header: '',
      fields: {
        ts_ms: { label: 'Time', formatter: this.tsMsFormatter },
        state_total: { label: 'Total' },
        state_inqueue: { label: 'Inqueue' },
        state_agent: { label: 'Agent' },
        state_oncall: { label: 'Oncall' },
        line_in: { label: 'Line In' },
        client: { label: 'Client' },
        queue: { label: 'Queue' },
        caller_ip: { label: 'IP' },
        caller: { label: 'Caller' },
        calling: { label: 'Calling' }
      },
    }
  },
  methods: {
    query (params) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_answer', 'details', params])
    },
    click ({uuid}) {
      this.$router.push(`/reports/inbound/session/events/${uuid}`)
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
