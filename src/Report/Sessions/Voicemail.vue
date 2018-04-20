<template>
<div>
  <div class="row">
    <div class="col"><h3>Voicemails</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups:queues:queue_groups:clients"></widget-query>
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
    <template slot="state_oncall" slot-scope="data">
      {{ format_ms(data.item.states.states.oncall) }}
    </template>
    <template slot="line_in" slot-scope="data">
      {{ maybe_name(data.item.line_in) }}
    </template>
    <template slot="client" slot-scope="data">
      {{ maybe_name(data.item.client) }}
    </template>
    <template slot="agent" slot-scope="data">
      {{ maybe_name(data.item.agent) }}
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
  components: { player: Player, 'widget-query': Query },
  data () {
    return {
      query_params: {},
      fields: {
        ts_ms: { label: 'Time', sortable: true, formatter: ts => new moment(ts, "x").format("YYYY-MM-DD HH:mm:ss") },
        state_total: { label: 'Total' },
        state_inqueue: { label: 'Inqueue' },
        state_agent: { label: 'Agent' },
        state_oncall: { label: 'Oncall' },
        line_in: { label: 'Line In' },
        client: { label: 'Client' },
        agent: { label: 'Agent' },
        caller_ip: { label: 'IP' },
        caller: { label: 'Caller' },
        calling: { label: 'Calling' },
        player: { label: ' ' }
      },
      sessions: []
    }
  },
  methods: {
    query: async function(params) {
      try {
        this.sessions = await this.$agent.p_mfa('ws_report', 'query', ['report_sessions', 'voicemail', params])
      }
      catch (e) {
        this.$notify({ title: 'Report Error:', text: e, type: 'error' })
      }
    },
    click ({uuid}) {
      this.$router.push(`/reports/events/voicemail/${uuid}`)
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
      let more = await this.$agent.p_mfa('ws_report', 'query', ['report_sessions', 'voicemail', params])
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
