<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <h3>SIP Registry:</h3>
    </div>
  </div>

  <b-table style="margin-top:10px" striped hover small :items="registry" :fields="fields">
    <template slot="agent" slot-scope="data">
      {{ data.item.name }}
    </template>
  </b-table>
</div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'admin-domains',
  data () {
    return {
      fields: {
        agent: { label: 'Agent' },
        name: { label: 'Name' },
        domain: { label: 'Domain' },
        registrar: { label: 'Registrar' },
        address: { label: 'Address' },
        ts: { label: 'Ts', formatter: ts => new moment(ts, "x").format("YYYY-MM-DD HH:mm:ss") }
      },
      registry: []
    }
  },
  methods: {
    query: async function () {
      this.registry = await this.$agent.p_mfa('ws_kam_registry', 'get')
    },
  },
  created () {
    this.query()
  }
}
</script>
