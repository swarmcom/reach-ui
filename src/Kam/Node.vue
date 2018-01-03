<template>
<div class="form-row">
  <b-col cols=2>
    <template v-if="isEntry()">
      <button @click="del(entry.id)" class="btn btn-sm btn-outline-danger">
        <icon class="align-middle" name="minus" scale="1"></icon>
      </button>
      <button @click="edit(entry.id)" class="btn btn-sm btn-outline-primary">
        <icon class="align-middle" name="gear" scale="1"></icon>
      </button>
    </template>
    <button v-else @click="add" class="btn btn-sm btn-outline-secondary">
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
      :value="safe_value(entry.address)" v-on:change="change('address', $event.target.value)">
  </b-col>

</div>
</template>

<script>
export default {
  name: 'admin-node',
  props: ['value'],
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
    edit (id) {
      this.$emit('edit', id)
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
