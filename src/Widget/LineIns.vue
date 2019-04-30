<template>
  <select
    class="custom-select pointer"
    :value="value"
    @change="onUpdate($event.target.value)"
  >
    <option />
    <option
      v-for="line in lines"
      :key="line.id"
      :value="line.id"
      :selected="isActive(line.id)"
    >
      {{ line.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'FormText',
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: [String, Number],
      default: ""
    }
  },
  data () {
    return {
      lines: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.lines = await this.$agent.p_mfa('ws_db_line_in', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>
