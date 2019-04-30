<template>
  <div class="form-row">
    <b-col cols="1">
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

    <b-col>
      <input
        type="text"
        class="form-control"
        :value="entry.name"
        placeholder="Name"
        @change="change('name', $event.target.value)"
      >
    </b-col>

    <b-col>
      <input
        type="text"
        class="form-control"
        :value="entry.password"
        placeholder="Password"
        @change="change('password', $event.target.value)"
      >
    </b-col>
  </div>
</template>

<script>
export default {
  name: 'AdminNodeAdmin',
  props: {
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
