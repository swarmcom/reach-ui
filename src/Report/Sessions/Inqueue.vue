<template>
<div>
  <div class="row">
    <div class="col"><h3>Calls sessions</h3></div>
  </div>
  <widget-query v-model="query_params"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="sessions" :fields="fields" @row-clicked="click">
    <template slot="state_inqueue" slot-scope="data">
      {{ format_ms(data.item.states.inqueue) }}
    </template>
    <template slot="state_agent" slot-scope="data">
      {{ format_ms(data.item.states.agent) }}
    </template>
    <template slot="state_oncall" slot-scope="data">
      {{ format_ms(data.item.states.oncall) }}
    </template>
    <template slot="line_in" slot-scope="data">
      {{ data.item.line_in.name }}
    </template>
    <template slot="client" slot-scope="data">
      {{ data.item.line_in.client.name }}
    </template>
    <template slot="agent" slot-scope="data">
      {{ maybe_name(data.item.agent) }}
    </template>
    <template slot="caller_id" slot-scope="data">
      "{{ data.item.vars['Caller-Caller-ID-Name'] }}" &lt;{{ data.item.vars['Caller-Caller-ID-Number'] }}&gt;
    </template>
    <template slot="called_id" slot-scope="data">
      {{ data.item.vars['Caller-Destination-Number'] }}
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
import Query from '@/Report/Widget/Query'
import moment from 'moment'

export default {
  name: 'stats-inqueue',
  components: { player: Player, 'widget-query': Query },
  data () {
    return {
      query_params: {},
      fields: {
        ts: { label: 'Ts', sortable: true, formatter: ts => new moment(ts).format("YYYY-MM-DD HH:MM:SS") },
        state_inqueue: { label: 'Inqueue', tdClass: 'text-right' },
        state_agent: { label: 'Agent', tdClass: 'text-right' },
        state_oncall: { label: 'Oncall', tdClass: 'text-right' },
        line_in: { label: 'Line In', tdClass: 'text-right' },
        client: { label: 'Client', tdClass: 'text-right' },
        agent: { label: 'Agent', tdClass: 'text-right' },
        caller_id: { label: 'Caller ID', tdClass: 'text-right' },
        called_id: { label: 'Called ID',tdClass: 'text-right' },
        player: { label: ' ', tdClass: 'text-right' }
      },
      sessions: []
    }
  },
  methods: {
    query: async function(params) {
      this.sessions = await this.$agent.p_mfa('ws_report', 'inqueues_sessions', [params])
    },
    click ({uuid}) {
      this.$router.push(`/report/events/inqueue/${uuid}`)
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
      let more = await this.$agent.p_mfa('ws_report', 'inqueues_sessions', [params])
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
