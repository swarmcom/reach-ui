<template>
<div>
  <div class="row">
    <div class="col"><h3>Agent Events</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="events" :fields="fields">
    <template slot="agent_id" slot-scope="data">
      {{ data.item.agent.id }}
    </template>
    <template slot="agent_name" slot-scope="data">
      {{ data.item.agent.name }}
    </template>
  </b-table>
</div>
</template>

<script>
function format_ms(ms) {
  if (Number.isInteger(ms)) {
    return (ms/1000).toFixed(1)
  } else {
    return ""
  }
}

export default {
  name: 'stats-agent-events',
  props: ['agent_id'],
  data () {
    return {
      fields: {
        ts: { label: 'Ts', sortable: true, formatter: (ts) => (new Date(ts)).toLocaleString() },
        state_from: { label: 'From' },
        state: { label: 'To' },
        time: { label: 'Time', formatter: format_ms },
        agent_id: { label: 'Id', sortable: true },
        agent_name: { label: 'Agent', sortable: true }
      },
      events: []
    }
  },
  methods: {
    query: async function() {
      let raw = await this.$agent.p_mfa('ws_stats', 'agent_events', [this.agent_id])
      this.events = raw.map( (re) => re._source )
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
