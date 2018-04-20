<template>
<div>
  <div class="row">
    <div class="col"><h3>Outgoing calls</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups:queues:queue_groups:clients"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="sessions" :fields="fields" @row-clicked="click">
    <template slot="state_total" slot-scope="data">
      {{ format_ms(data.item.states.total) }}
    </template>
    <template slot="state_ringing" slot-scope="data">
      {{ format_ms(data.item.states.states.ringing) }}
    </template>
    <template slot="state_oncall" slot-scope="data">
      {{ format_ms(data.item.states.states.oncall) }}
    </template>
    <template slot="line_out" slot-scope="data">
      {{ maybe_name(data.item.line_out) }}
    </template>
    <template slot="client" slot-scope="data">
      {{ maybe_name(data.item.client) }}
    </template>
    <template slot="agent" slot-scope="data">
      {{ maybe_name(data.item.agent) }}
    </template>
    <template slot="calling" slot-scope="data">
      {{ data.item.target }}
    </template>
    <template slot="player" slot-scope="data">
      <player v-if="data.item.keep_record" :href="data.item.call_record_path"></player>
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
import Player from '@/Report/Player'
import Query from '@/Report/Legacy/Query'
import moment from 'moment'

export default {
  name: 'stats-outgoing',
  components: { player: Player, 'widget-query': Query },
  data () {
    return {
      query_params: {},
      fields: {
        ts_ms: { label: 'Time', sortable: true, formatter: ts => new moment(ts, "x").format("YYYY-MM-DD HH:mm:ss") },
        state_total: { label: 'Total', tdClass: 'text-right' },
        state_ringing: { label: 'Ringing', tdClass: 'text-right' },
        state_oncall: { label: 'Oncall', tdClass: 'text-right' },
        line_out: { label: 'Line out', tdClass: 'text-right' },
        client: { label: 'Client', tdClass: 'text-right' },
        agent: { label: 'Agent', tdClass: 'text-right' },
        target: { label: 'Target', tdClass: 'text-right' },
        player: { label: ' ', tdClass: 'text-right' }
      },
      sessions: []
    }
  },
  methods: {
    query: async function(params) {
      try {
        this.sessions = await this.$agent.p_mfa('ws_report', 'query', ['report_sessions', 'outgoing', params])
      }
      catch (e) {
        this.$notify({ title: 'Report Error:', text: e, type: 'error' })
      }
    },
    click ({id}) {
      this.$router.push(`/reports/events/outgoing/${id}`)
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
      let more = await this.$agent.p_mfa('ws_report', 'query', ['report_sessions', 'outgoing', params])
      this.sessions = this.sessions.concat(more)
    }
  },
  created () {
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

<style>
tbody tr {
  cursor: pointer;
}
</style>
