<template>
<div class="container">
  <b-row style="margin-bottom: 10px"><b-col><h3>Nodes:</h3></b-col></b-row>

  <div v-for="node of nodes" :key="node.id" style="margin-top: 5px">
    <node :disable=true :value="node" v-on:change="change" v-on:del="del" v-on:edit="edit"></node>
  </div>
  <node :disable=false :value="node" style="margin-top: 5px" v-on:change="change_node" v-on:add="add"></node>

</div>
</template>

<script>
import Node from '@/Kam/Node'

export default {
  name: 'admin-kam-nodes',
  components: { Node },
  data () {
    return {
      node: {},
      nodes: []
    }
  },
  methods: {
    query: async function () {
      this.nodes = await this.$agent.p_mfa('ws_kam_node', 'get')
    },
    change: async function (node) {
      this.$agent.p_mfa('ws_kam_node', 'update', [node.id, node])
    },
    change_node (node) {
      this.node = node
    },
    add: async function(node) {
      let created_node = await this.$agent.p_mfa('ws_kam_node', 'create', [node])
      this.nodes.push(created_node)
      this.node = {}
    },
    del: async function (id) {
      await this.$agent.p_mfa('ws_kam_node', 'delete', [id])
      let idx = this.nodes.findIndex(Obj => Obj.id === id)
      if (idx >= 0) {
        this.nodes.splice(idx, 1)
      }
    },
    edit (id) {
      this.$router.push(`/kam/node/${id}`)
    }
  },
  created () {
    this.query()
  }
}
</script>
