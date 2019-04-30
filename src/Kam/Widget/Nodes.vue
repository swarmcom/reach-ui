<template>
  <select
    class="custom-select"
    :value="value"
    style="width: 100%"
    :disabled="isDisabled()"
    @change="change($event.target.value)"
  >
    <option />
    <option
      v-for="entry in entries"
      :key="entry.id"
      :value="entry.id"
      :selected="isActive(entry.id)"
    >
      {{ entry.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'WidgetNode',
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      entries: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.entries.length == 0
    },
    query: async function () {
      if (this.type) {
        this.entries = await this.$agent.p_mfa('ws_kam_node', 'by_type', [this.type])
      } else {
        this.entries = await this.$agent.p_mfa('ws_kam_node', 'get', [])
      }
    },
    change (value) {
      this.$emit('input', parseInt(value))
    }
  }
}
</script>
