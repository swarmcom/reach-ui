<template>
<div class="container">
  <b-row style="margin-bottom: 10px"><b-col><h3>Nodes:</h3></b-col></b-row>
  <b-row style="margin-bottom: 10px"><b-col>
    <b-btn size="sm" variant="outline-danger" @click="resolve_all">Resolve all</b-btn>
  </b-col></b-row>
  <b-table striped hover small :items="nodes" :fields="fields" @row-clicked="row_click">
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
    row_click (node) {
      this.$router.push(`/kam/node/${node.id}`)
    },
    resolve_all: async function () {
      await this.$agent.p_mfa('ws_kam_node', 'resolve_all')
      this.query()
      this.$notify({ title: 'Resolve', text: "Success", type: 'success' })
    }
  },
  created () {
    this.query()
  }
}
</script>
