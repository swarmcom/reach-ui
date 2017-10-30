<template>
<div>
  <div class="row">
    <div class="col"><h3>Inqueue</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="inqueues" :fields="fields" @row-clicked="click">
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
      <player v-if="data.item.keep_record == false" :href="data.item.call_record_path"></player>
    </template>
  </b-table>
</div>
</template>

<script>
import Player from './Player'

export default {
  name: 'stats-inqueue',
  components: { player: Player },
  data () {
    return {
      fields: {
        ts: { label: 'Ts', sortable: true, formatter: (ts) => (new Date(ts)).toLocaleString() },
        state_inqueue: { label: 'Inqueue' },
        state_agent: { label: 'Agent' },
        state_oncall: { label: 'Oncall' },
        line_in: { label: 'Line In', sortable: true },
        client: { label: 'Client', sortable: true },
        agent: { label: 'Agent', sortable: true },
        caller_id: { label: 'Caller ID' },
        called_id: { label: 'Called ID' },
        player: { label: ' ' }
      },
      inqueues: []
    }
  },
  methods: {
    query: async function() {
      let raw = await this.$agent.p_mfa('ws_stats', 'inqueue', [])
      this.inqueues = raw.map( (re) => re._source )
    },
    click ({uuid}) {
      this.$router.push(`/stats/inqueue/${uuid}`)
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
