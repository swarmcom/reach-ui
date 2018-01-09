<template>
<div class="form-row">
  <b-col cols=1>
    <template v-if="isEntry()">
      <button @click="del(entry.id)" class="btn btn-sm btn-outline-danger">
        <icon class="align-middle" name="minus" scale="1"></icon>
      </button>
    </template>
    <button v-else @click="add" class="btn btn-sm btn-outline-secondary">
      <icon class="align-middle" name="plus" scale="1"></icon>
    </button>
  </b-col>

  <b-col>
    <input type="text" class="form-control" :value="entry.name" placeholder="Name" v-on:change="change('name', $event.target.value)">
  </b-col>

  <b-col>
    <input type="text" class="form-control" :value="entry.password" placeholder="Password" v-on:change="change('password', $event.target.value)">
  </b-col>

</div>
</template>

<script>
export default {
  name: 'admin-node-admin',
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
