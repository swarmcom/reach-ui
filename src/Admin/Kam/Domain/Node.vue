<template>
<div class="form-row">
  <b-col cols=1>
    <button v-if="isEntry()" @click="del(entry.id)" class="btn btn-outline-danger">
      <icon class="align-middle" name="minus" scale="1"></icon>
    </button>
    <button v-else @click="add" class="btn btn-outline-secondary">
      <icon class="align-middle" name="plus" scale="1"></icon>
    </button>
  </b-col>

  <b-col cols=2>
    <select class="custom-select" v-model="entry.type" style="width: 100%">
      <option value="proxy">Proxy</option>
      <option value="media">Media</option>
      <option value="gateway">Gateway</option>
      <option value="agents">Agents</option>
      <option value="world">World</option>
    </select>
  </b-col>

  <b-col>
    <input type="text" class="form-control"
      :value="safe_value(entry.name)" v-on:change="change('name', $event.target.value)">
  </b-col>

  <b-col v-if="isGateway(entry.type)">
    <input type="text" class="form-control"
      :value="safe_value(entry.ip)" v-on:change="change('ip', $event.target.value)">
  </b-col>

  <b-col v-if="entry.type=='media'">
    <node type="proxy" :domain="this.id" :value="entry.args" v-on:input="change('args', arguments[0])"></node>
  </b-col>

</div>
</template>

<script>
import Node from '@/Admin/Kam/Domain/Dialplan/Node'

export default {
  name: 'admin-domain-node',
  props: ['id', 'value'],
  components: { Node },
  data () {
    return {
      entry: {},
    }
  },
  methods: {
    safe_value (value) {
      return value === 'undefined' ? '' : value
    },
    isGateway (type) {
      return ((type != 'agents') && (type != 'world'))
    },
    isEntry () {
      return this.entry.id > 0
    },
    change (field, value) {
      this.entry[field] = value
      this.$emit('change', this.entry)
    },
    add () {
      this.$emit('add', this.entry)
      this.entry = {}
    },
    del (id) {
      this.$emit('del', id)
    }
  },
  created () {
    this.entry = this.value
  }
}
</script>
