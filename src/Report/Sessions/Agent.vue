<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents sessions</h3></div>
  </div>
  <widget-query v-model="query_params"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="agents" :fields="fields" @row-clicked="click">
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
</div>
</template>

<script>
import Player from '@/Report/Player'
import Query from '@/Report/Widget/Query'

export default {
  name: 'report-sessions-agent',
  components: { player: Player, 'widget-query': Query },
  data () {
    return {
      query_params: {},
      fields: {
        ts: { label: 'Ts', sortable: true, formatter: (ts) => (new Date(ts)).toLocaleString() },
        state_release: { label: 'Release' },
        state_available: { label: 'Available' },
        state_oncall: { label: 'Oncall' },
        agent_name: { label: 'Name', sortable: true },
        agent_login: { label: 'Login', sortable: true },
        agent_peer: { label: 'Peer IP', sortable: true },
      },
      agents: []
    }
  },
  methods: {
    query: async function(params) {
      this.agents = await this.$agent.p_mfa('ws_report', 'agents_sessions', [params])
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
