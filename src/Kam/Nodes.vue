<template>
  <div class="container">
    <b-row style="margin-bottom: 10px">
      <b-col><h3>Nodes:</h3></b-col>
    </b-row>

    <div
      v-for="itemNode of nodes"
      :key="itemNode.id"
      style="margin-top: 5px"
    >
      <node
        :disable="true"
        :value="itemNode"
        @change="change"
        @del="del"
        @edit="edit"
      />
    </div>
    <node
      :disable="false"
      :value="node"
      style="margin-top: 5px"
      @change="change_node"
      @add="add"
    />
  </div>
</template>

<script>
import Node from '@/Kam/Node'

export default {
  name: 'AdminKamNodes',
  components: { Node },
  data () {
    return {
      node: {},
      nodes: []
    }
  },
  created () {
    this.query()
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
  }
}
</script>
