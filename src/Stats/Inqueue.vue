<template>
<div>
  <div class="row">
    <div class="col"><h3>Inqueue</h3></div>
  </div>
  <b-table style="margin-top:10px" small striped hover :items="inqueues" :fields="fields">
    <template slot="line_in" scope="data">
      {{ data.item.line_in.name }}
    </template>
    <template slot="client" scope="data">
      {{ data.item.line_in.client.name }}
    </template>
    <template slot="caller_id" scope="data">
      "{{ data.item.vars['Caller-Caller-ID-Name'] }}" &lt;{{ data.item.vars['Caller-Caller-ID-Number'] }}&gt;
    </template>
    <template slot="called_id" scope="data">
      {{ data.item.vars['Caller-Destination-Number'] }}
    </template>
  </b-table>
</div>
</template>

<script>
function format_ms(ms) {
  if (ms > 0) {
    return (ms/1000).toFixed(1)
  } else {
    return ""
  }
}

export default {
  name: 'stats-inqueue',
  data () {
    return {
      fields: {
        ts: { label: 'Ts', sortable: true, formatter: (ts) => (new Date(ts)).toLocaleString() },
        agent: { label: 'Agent', formatter: format_ms },
        oncall: { label: 'Oncall', formatter: format_ms },
        inqueue: { label: 'Inqueue', formatter: format_ms },
        line_in: { label: 'Line In', sortable: true },
        client: { label: 'Client', sortable: true },
        caller_id: { label: 'Caller ID' },
        called_id: { label: 'Called ID' },
      },
      inqueues: []
    }
  },
  methods: {
    query: async function() {
      let raw = await this.$agent.p_mfa('ws_stats', 'inqueue', [])
      this.inqueues = raw.map( (re) => re._source )
    },
  },
  created () {
    this.query()
  },
}
</script>
