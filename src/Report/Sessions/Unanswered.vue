<template>
<div>
  <div class="row">
    <div class="col"><h3>Unanswered inbound calls</h3></div>
  </div>
  <widget-query v-if="is_standalone()" v-model="query_params" enable="range:queues:queue_groups:clients"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="sessions" :fields="fields" tbody-tr-class="pointer" @row-clicked="click">
    <template slot="state_total" slot-scope="data">
      {{ format_ms(data.item.states.total) }}
    </template>
    <template slot="state_inqueue" slot-scope="data">
      {{ format_ms(data.item.states.states.inqueue) }}
    </template>
    <template slot="state_agent" slot-scope="data">
      {{ format_ms(data.item.states.states.agent) }}
    </template>
    <template slot="line_in" slot-scope="data">
      {{ maybe_name(data.item.line_in) }}
    </template>
    <template slot="client" slot-scope="data">
      {{ maybe_name(data.item.client) }}
    </template>
    <template slot="queue" slot-scope="data">
      {{ maybe_name(data.item.queue) }}
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
import moment from 'moment'

function maybe_copy_params(Dst, Src, Params) {
  Params.forEach( k => { if (Src[k]) { Dst[k] = parseInt(Src[k]) } })
  return Dst
}

export default {
  components: { 'widget-query': Query },
  props: [],
  data () {
    return {
      query_params: {},
      fields: {
        ts_ms: { label: 'Ts', sortable: true, formatter: ts => new moment(ts, "x").format("YYYY-MM-DD HH:mm:ss") },
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
      sessions: []
    }
  },
  methods: {
    query: async function(params) {
      try {
        this.sessions = await this.$agent.p_mfa('ws_report', 'query', ['report_answer', 'details', params])
      }
      catch (e) {
        this.$notify({ title: 'Report Error:', text: e, type: 'error' })
      }
    },
    click ({uuid}) {
      this.$router.push(`/reports/events/inqueue/${uuid}`)
    },
    format_ms (ms) {
      if (Number.isInteger(ms)) {
        return (ms/1000).toFixed(1)
      } else {
        return ""
      }
    },
    maybe_name (item) {
      if (typeof item === 'object') {
        return item.name
      } else {
        return ''
      }
    },
    more: async function() {
      let params = this.query_params
      let session = this.sessions[this.sessions.length - 1]
      params.date_end = parseInt(session.ts/1000)
      let more = await this.$agent.p_mfa('ws_report', 'query', ['report_answer', 'details', params])
      this.sessions = this.sessions.concat(more)
    },
    is_standalone () {
      return this.$route.query.group_by? false : true
    },
    set_query_params (params) {
      let q = this.$route.query
      maybe_copy_params(params, q, ['date_start', 'date_end'])
      let entity = `${q.group_by}_id`
      params[entity] = parseInt(q.entity_id)
      return params
    }
  },
  created () {
    this.query_params = this.set_query_params(this.query_params)
    this.query(this.query_params)
  },
  watch: {
    query_params (value) {
      this.query(value)
      return value
    }
  }
}
</script>
