<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents sessions</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="agents" :fields="fields" @row-clicked="click">
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

  </b-table>
</div>
</template>

<script>
import Player from './Player'

export default {
  name: 'stats-agent',
  components: { player: Player },
  data () {
    return {
      fields: {
        ts: { label: 'Ts', sortable: true, formatter: (ts) => (new Date(ts)).toLocaleString() },
        state_release: { label: 'Release' },
        state_available: { label: 'Available' },
        state_oncall: { label: 'Oncall' },
        agent_name: { label: 'Name', sortable: true },
        agent_login: { label: 'Login', sortable: true }
      },
      agents: []
    }
  },
  methods: {
    query: async function() {
      let raw = await this.$agent.p_mfa('ws_stats', 'agent', [])
      this.agents = raw.map( (re) => re._source )
    },
    click ({uuid}) {
      this.$router.push(`/stats/agent/${uuid}`)
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
    this.query()
  },
}
</script>

<style>
tbody tr {
  cursor: pointer;
}
</style>
