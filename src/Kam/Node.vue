<template>
  <div class="form-row">
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
          class="btn btn-sm btn-outline-primary"
          @click="edit(entry.id)"
        >
          <icon
            class="align-middle"
            name="gear"
            scale="1"
          />
        </button>
      </template>
      <button
        v-else
        class="btn btn-sm btn-outline-secondary"
        @click="add"
      >
        <icon
          class="align-middle"
          name="plus"
          scale="1"
        />
      </button>
    </b-col>

    <b-col cols="2">
      <input
        v-if="disable"
        v-model="entry.type"
        :disabled="disable"
        type="text"
        class="form-control"
      >
      <select
        v-else
        v-model="entry.type"
        class="custom-select"
        style="width: 100%"
      >
        <option value="proxy">
          Proxy
        </option>
        <option value="media">
          Media
        </option>
        <option value="gateway">
          Gateway
        </option>
        <option value="agents">
          Agents
        </option>
        <option value="world">
          World
        </option>
      </select>
    </b-col>

    <b-col>
      <input
        type="text"
        class="form-control"
        :value="safe_value(entry.name)"
        @change="change('name', $event.target.value)"
      >
    </b-col>

    <b-col v-if="isGateway(entry.type)">
      <input
        type="text"
        class="form-control"
        :value="safe_value(entry.address)"
        @change="change('address', $event.target.value)"
      >
    </b-col>
  </div>
</template>

<script>
export default {
  name: 'AdminNode',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    disable: {
      type: Boolean,
      default: false
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
  }
}
</script>
