<template>
<div class="container">
  <div class="row" style="margin-bottom: 10px"><div class="col"><h3>Domain nodes:</h3></div></div>

  <div v-for="node of nodes" :key="node.id" style="margin-top: 5px">
    <node :id="id" :value="node" v-on:change="change" v-on:del="del"></node>
  </div>
  <node :id="id" :value="node" style="margin-top: 5px" v-on:change="change_node" v-on:add="add"></node>

</div>
</template>

<script>
import Node from '@/Admin/Kam/Domain/Node'

export default {
  name: 'admin-domain-nodes',
  components: { Node },
  props: ['id'],
  data () {
    return {
      node: {},
      nodes: []
    }
  },
  methods: {
    query: async function () {
      this.nodes = await this.$agent.p_mfa('ws_kam_domain_node', 'get', [this.id])
    },
    change: async function (node) {
      this.$agent.p_mfa('ws_kam_domain_node', 'update', [node.id, node])
    },
    change_node (node) {
      this.node = node
    },
    add: async function(node) {
      let created_node = await this.$agent.p_mfa('ws_kam_domain_node', 'create', [this.id, node])
      this.nodes.push(created_node)
      this.node = {}
    },
    del: async function (id) {
      await this.$agent.p_mfa('ws_kam_domain_node', 'delete', [id])
      let idx = this.nodes.findIndex(Obj => Obj.id === id)
      if (idx >= 0) {
        this.nodes.splice(idx, 1)
      }
    }
  },
  created () {
    this.query()
  }
}
</script>
