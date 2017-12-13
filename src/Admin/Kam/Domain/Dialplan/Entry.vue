<template>
  <b-form-row>
    <b-col cols="2">
      <template v-if="isEntry()">
        <button @click="del(entry.id)" class="btn btn-outline-danger">
          <icon class="align-middle" name="minus" scale="1"></icon>
        </button>
        <button @click="up(entry.id)" class="btn btn-outline-success">
          <icon class="align-middle" name="arrow-up" scale="1"></icon>
        </button>
        <button @click="down(entry.id)" class="btn btn-outline-primary">
          <icon class="align-middle" name="arrow-down" scale="1"></icon>
        </button>
      </template>
      <template v-else>
        <button @click="add" class="btn btn-outline-secondary">
          <icon name="plus" scale="1" class="align-middle"></icon>
        </button>
      </template>
    </b-col>

    <b-col cols=5>
      <input type="text" class="form-control" placeholder="Match"
        :value="safe_value(entry.match)" v-on:change="change('match', $event.target.value)">
    </b-col>
    <b-col cols=5>
      <input type="text" class="form-control" placeholder="Target"
        :value="safe_value(entry.target)" v-on:change="change('target', $event.target.value)">
    </b-col>
  </b-form-row>
</template>

<script>
export default {
  name: 'admin-domain-dialplan-entry',
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

