<template>
  <b-form-row>

    <b-col cols="2">
      <template v-if="isEntry()">
        <button @click="del(entry.id)" class="btn btn-sm btn-outline-danger">
          <icon class="align-middle" name="minus" scale="1"></icon>
        </button>
        <button @click="up(entry.id)" class="btn btn-sm btn-outline-success">
          <icon class="align-middle" name="arrow-up" scale="1"></icon>
        </button>
        <button @click="down(entry.id)" class="btn btn-sm btn-outline-primary">
          <icon class="align-middle" name="arrow-down" scale="1"></icon>
        </button>
      </template>
      <template v-else>
        <button @click="add" class="btn btn-sm btn-outline-secondary">
          <icon name="plus" scale="1" class="align-middle"></icon>
        </button>
      </template>
    </b-col>

    <b-col>
      <select v-model="entry.source" class="custom-select" style="width: 100%" v-on:change="change('source', $event.target.value)">
        <option value="agents">Agents</option>
        <option value="media">Media</option>
        <option value="world">World</option>
        <option value="gateway">Gateway</option>
      </select>
    </b-col>

    <b-col>
      <input type="text" class="form-control" placeholder="Match"
        :value="safe_value(entry.match)" v-on:change="change('match', $event.target.value)">
    </b-col>

    <b-col cols=1.5>
      <select v-model="entry.action" class="custom-select" style="width: 100%" v-on:change="change('action', $event.target.value)">
        <option value="pass">Pass</option>
        <option value="block">Block</option>
      </select>
    </b-col>

    <b-col>
      <node v-if="entry.action=='pass'" :domain="this.id" :value="entry.target" v-on:input="change('target', arguments[0])"></node>
    </b-col>

  </b-form-row>
</template>

<script>
import Node from '@/Admin/Kam/Domain/Dialplan/Node'

export default {
  name: 'admin-domain-dialplan-entry',
  components: { Node },
  props: ['id', 'value'],
  data () {
    return {
      entry: {},
    }
  },
  methods: {
    safe_value (value) {
      return value === 'undefined' ? '' : value
    },
    isEntry () {
      return this.entry.id > 0
    },
    change (field, value) {
      this.entry[field] = value
      this.$emit('change', this.entry)
    },
    up (id) {
      this.$emit('up', id)
    },
    down (id) {
      this.$emit('down', id)
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

