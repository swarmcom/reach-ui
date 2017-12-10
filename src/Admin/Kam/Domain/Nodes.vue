<template>
<div class="container">
  <div class="row" style="margin-bottom: 10px"><div class="col"><h3>Nodes:</h3></div></div>

  <div v-for="node of nodes" class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="del(node.id)" class="btn btn-outline-danger"><icon class="align-middle" name="minus" scale="1"></icon></button>
    </div>
    <b-col cols=2>
      <select class="custom-select" v-model="node.type"  style="width: 100%" v-on:change="onChange(node, 'type', $event.target.value)">
        <option value="proxy">Proxy</option>
        <option value="media">Media</option>
      </select>
    </b-col>
    <div class="col-3">
      <input type="text" class="form-control"
        :value="safe_value(node.name)" v-on:change="onChange(node, 'name', $event.target.value)">
    </div>
    <div class="col-3">
      <input type="text" class="form-control"
        :value="safe_value(node.ip)" v-on:change="onChange(node, 'ip', $event.target.value)">
    </div>

  </div>

  <div class="form-row" style="margin-top: 5px">
    <div class="col-1">
      <button @click="add" class="btn btn-outline-secondary"><icon class="align-middle" name="plus" scale="1"></icon></button>
    </div>
    <b-col cols=2>
      <select class="custom-select" v-model="type" style="width: 100%">
        <option value="proxy">Proxy</option>
        <option value="media">Media</option>
      </select>
    </b-col>
    <div class="col-3">
      <input type="text" class="form-control" v-model="name" placeholder="Name">
    </div>
    <div class="col-3">
      <input type="text" class="form-control" v-model="ip" placeholder="Name/Address">
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'admin-domain-nodes',
  props: ['id'],
  data () {
    return {
      name: undefined,
      ip: undefined,
      type: undefined,
      nodes: []
    }
  },
  methods: {
    query: async function () {
      this.nodes = await this.$agent.p_mfa('ws_kam_domain_node', 'get', [this.id])
    },
    is_selected(node, type) {
      console.log(node,type, node.type==type)
      return node.type == type
    },
    onChange (node, field, value) {
      node[field] = value
      this.$agent.p_mfa('ws_kam_domain_node', 'update', [node.id, node])
    },
    add: async function() {
      let node = await this.$agent.p_mfa('ws_kam_domain_node', 'create', [this.id, {
        name: this.name,
        type: this.type,
        ip: this.ip
      }])
      this.nodes.push(node)
      this.name = undefined
      this.type = undefined
      this.ip = undefined
    },
    del: async function (Key) {
      await this.$agent.p_mfa('ws_kam_domain_node', 'delete', [Key])
      let id = this.nodes.findIndex(Obj => Obj.id === Key)
      if (id >= 0) {
        this.nodes.splice(id, 1)
      }
    },
    safe_value (Value) {
      return Value === 'undefined' ? '' : Value
    }
  },
  created () {
    this.query()
  }
}
</script>
