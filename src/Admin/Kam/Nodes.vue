<template>
<div class="container">
  <div class="row">
    <div class="col-4">
      <h3>Nodes:</h3>
    </div>
    <div class="col">
      <button @click="add" class="btn btn-outline-success"><icon name="plus" class="align-middle" scale="1"></icon></button>
    </div>
  </div>

  <b-table style="margin-top:10px" striped hover small :items="nodes" :fields="fields">
    <template slot="actions" slot-scope="data">
      <b-btn size="sm" variant="primary" @click="edit(data.item)">Edit</b-btn>
    </template>
  </b-table>
</div>
</template>

<script>
import Btable from '@/Widget/Btable'

export default {
  name: 'admin-kam-nodes',
  data () {
    return {
      fields: {
        id: { label: 'Id', sortable: true },
        name: { label: 'Name', sortable: true },
        actions: {}
      },
      nodes: []
    }
  },
  methods: {
    query: async function () {
      this.nodes = await this.$agent.p_mfa('ws_kam_node', 'get')
    },
    add () {
      this.$router.push(`/kam/node/`)
    },
    edit (data) {
      this.$router.push(`/kam/node/${data.id}`)
    }
  },
  created () {
    this.query()
  },
  components: {
    btable: Btable
  }
}
</script>
