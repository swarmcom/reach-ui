<template>
<div class="form-inline">
<autocomplete v-model="agent" :query="query" placeholder="Agent..."></autocomplete>
<button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="agent in selected" @click="remove(agent)">{{agent.name}}</button>
</div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  name: 'report-widget-agents',
  components: {Autocomplete},
  props: ['value'],
  data () {
    return {
      agent: undefined,
      selected: []
    }
  },
  methods: {
    query (text) {
      return this.$agent.p_mfa('ws_agent', 'suggest', ['agent', text])
    },
    remove (agent) {
      let index = this.selected.findIndex(el => el.id === agent.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    }
  },
  watch: {
    agent (value) {
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
