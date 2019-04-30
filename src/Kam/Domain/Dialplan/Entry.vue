<template>
  <b-form-row>
    <b-col cols="2">
      <template v-if="isEntry()">
        <button
          class="btn btn-sm btn-outline-danger"
          @click="del(entry.id)"
        >
          <icon
            class="align-middle"
            name="minus"
            scale="1"
          />
        </button>
        <button
          class="btn btn-sm btn-outline-success"
          @click="up(entry.id)"
        >
          <icon
            class="align-middle"
            name="arrow-up"
            scale="1"
          />
        </button>
        <button
          class="btn btn-sm btn-outline-primary"
          @click="down(entry.id)"
        >
          <icon
            class="align-middle"
            name="arrow-down"
            scale="1"
          />
        </button>
      </template>
      <template v-else>
        <button
          class="btn btn-sm btn-outline-secondary"
          @click="add"
        >
          <icon
            name="plus"
            scale="1"
            class="align-middle"
          />
        </button>
      </template>
    </b-col>
    <b-col>
      <nodes
        :value="entry.source"
        @input="change('source', arguments[0])"
      />
    </b-col>
    <b-col>
      <input
        type="text"
        class="form-control"
        placeholder="Match"
        :value="safe_value(entry.match)"
        @change="change('match', $event.target.value)"
      >
    </b-col>
    <b-col cols="1.5">
      <select
        v-model="entry.action"
        class="custom-select"
        style="width: 100%"
        @change="change('action', $event.target.value)"
      >
        <option value="pass">
          Pass
        </option>
        <option value="block">
          Block
        </option>
      </select>
    </b-col>
    <b-col>
      <nodes
        v-if="entry.action=='pass'"
        :domain="id"
        :value="entry.target"
        @input="change('target', arguments[0])"
      />
    </b-col>
  </b-form-row>
</template>

<script>
import Nodes from '@/Kam/Widget/Nodes'

export default {
  name: 'AdminDomainDialplanEntry',
  components: { Nodes },
  props: {
    id: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      entry: {},
    }
  },
  created () {
    this.entry = this.value
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
  }
}
</script>

