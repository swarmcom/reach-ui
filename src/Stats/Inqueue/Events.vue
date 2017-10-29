<template>
<div>
  <div class="row">
    <div class="col"><h3>Inqueue Events</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="events" :fields="fields">
    <template slot="line_in" slot-scope="data">
      {{ data.item.line_in.name }}
    </template>
    <template slot="client" slot-scope="data">
      {{ data.item.line_in.client.name }}
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
  name: 'stats-inqueue-events',
  props: ['uuid'],
  data () {
    return {
      fields: {
        ts: { label: 'Ts', sortable: true, formatter: (ts) => (new Date(ts)).toLocaleString() },
        state: { label: 'State' },
        time: { label: 'Time', formatter: format_ms },
        line_in: { label: 'Line In', sortable: true },
        client: { label: 'Client', sortable: true },
      },
      events: []
    }
  },
  methods: {
    query: async function() {
      let raw = await this.$agent.p_mfa('ws_stats', 'inqueue_events', [this.uuid])
      this.events = raw.map( (re) => re._source )
    },
  },
  created () {
    this.query()
  },
}
</script>
