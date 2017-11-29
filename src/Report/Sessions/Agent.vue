<template>
<div>
  <b-row>
    <b-col><h3>Agents sessions</h3></b-col>
  </b-row>
  <widget-query v-model="query_params"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="sessions" :fields="fields" @row-clicked="click">
    <template slot="state_release" slot-scope="data">
      {{ format_ms(data.item.states.release) }}
    </template>
    <template slot="state_available" slot-scope="data">
      {{ format_ms(data.item.states.available) }}
    </template>
    <template slot="state_oncall" slot-scope="data">
      {{ format_ms(data.item.states.oncall) }}
    </template>
    <template slot="agent_name" slot-scope="data">
      {{ data.item.agent.name }}
    </template>
    <template slot="agent_login" slot-scope="data">
      {{ data.item.agent.login }}
    </template>
    <template slot="agent_peer" slot-scope="data">
      {{ data.item.peer }}
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
  name: 'report-sessions-agent',
  components: { player: Player, 'widget-query': Query },
  data () {
    return {
      query_params: {},
      fields: {
        ts: { label: 'Ts', formatter: ts => new moment(ts).format("YYYY-MM-DD HH:mm:ss") },
        state_release: { label: 'Release', tdClass: 'text-right' },
        state_available: { label: 'Available', tdClass: 'text-right' },
        state_oncall: { label: 'Oncall', tdClass: 'text-right' },
        agent_name: { label: 'Name', tdClass: 'text-right' },
        agent_login: { label: 'Login', tdClass: 'text-right' },
        agent_peer: { label: 'Peer IP', tdClass: 'text-right' },
      },
      sessions: []
    }
  },
  methods: {
    query: async function(params) {
      this.sessions = await this.$agent.p_mfa('ws_report', 'agents_sessions', [params])
    },
    click ({uuid}) {
      this.$router.push(`/report/events/agent/${uuid}`)
    },
    format_ms (ms) {
      if (Number.isInteger(ms)) {
        return (ms/1000).toFixed(1)
      } else {
        return ""
      }
    },
    more: async function() {
      let params = this.query_params
      let session = this.sessions[this.sessions.length - 1]
      params.date_end = parseInt(session.ts/1000)
      let more = await this.$agent.p_mfa('ws_report', 'agents_sessions', [params])
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
