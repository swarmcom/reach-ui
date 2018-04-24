<template>
<div class="form-inline">
<autocomplete v-model="line_in" :query="query" placeholder="Line In..."></autocomplete>
<button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="line in selected" @click="remove(line)">{{line.name}}</button>
</div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  name: 'report-widget-line-ins',
  components: {Autocomplete},
  props: ['value'],
  data () {
    return {
      line: undefined,
      selected: []
    }
  },
  methods: {
    query (text) {
      return this.$agent.p_mfa('ws_agent', 'suggest', ['line_in', text])
    },
    remove (line) {
      let index = this.selected.findIndex(el => el.id === line.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    }
  },
  watch: {
    line (value) {
      let index = this.selected.findIndex(el => el.id === value.id)
      if (index < 0) {
        this.selected.push(value)
      }
      return value
    },
    selected (value) {
      this.$emit('input', value)
      return value
    },
    value (value) {
      this.selected = value
    }
  },
  created () {
  }
}
</script>
