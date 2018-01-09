<template>
<div class="container">
  <b-row style="margin-bottom: 10px"><b-col><h3>Nodes:</h3></b-col></b-row>
  <b-table striped hover small :items="nodes" :fields="fields">
  </b-table>
</div>

</template>

<script>
export default {
  name: 'admin-kam-nodes',
  components: { Node },
  data () {
    return {
      nodes: [],
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        type: { label: 'Type', sortable: true },
        address: { label: 'Address', sortable: true },
        ip: { label: 'Ip' },
        status: { label: 'Status' },
      },
    }
  },
  methods: {
    query: async function () {
      this.nodes = await this.$agent.p_mfa('ws_kam_node', 'get')
    },
  },
  created () {
    this.query()
  }
}
</script>
