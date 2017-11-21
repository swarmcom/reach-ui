<template>
<select class="custom-select pointer" :value="value" @change="onUpdate($event.target.value)">
  <option></option>
  <option v-for="line in lines" :value="line.id" :selected="isActive(line.id)">{{ line.name }}</option>
</select>
</template>

<script>
export default {
  name: 'form-text',
  props: ['label', 'value'],
  data () {
    return {
      lines: []
    }
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
  },
  created () {
    this.query()
  }
}
</script>
