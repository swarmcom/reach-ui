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
      {{ data.item.client.name }}
    </template>
    <template slot="agent" slot-scope="data">
      {{ maybe_name(data.item.agent) }}
    </template>
  </b-table>
</div>
</template>

<script>
import moment from 'moment'

function format_ms(ms) {
  if (Number.isInteger(ms)) {
    return (ms/1000).toFixed(1)
  } else {
    return ""
  }
}

export default {
  name: 'report-events-inqueue',
  props: ['uuid'],
  data () {
    return {
      fields: {
        ts_ms: { label: 'Ts', sortable: true, formatter: ts => new moment(ts, "x").format("YYYY-MM-DD HH:mm:ss") },
        state_from: { label: 'From' },
        state: { label: 'To' },
        time: { label: 'Time', formatter: format_ms },
        line_in: { label: 'Line In', sortable: true },
        client: { label: 'Client', sortable: true },
        agent: { label: 'Agent', sortable: true }
      },
      events: []
    }
  },
  methods: {
    query: async function() {
      this.events = await this.$agent.p_mfa('ws_report', 'inqueue_events', [this.uuid])
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
