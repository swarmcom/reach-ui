<template>
<div class="form-inline">
<autocomplete-agent v-model="agent" placeholder="Agent..."></autocomplete-agent>
<button class="btn btn-outline-secondary" style="margin-left: 10px" v-for="agent in selected" @click="remove(agent)">{{agent.name}}</button>
</div>
</template>

<script>
import AutocompleteAgent from '@/Widget/Autocomplete/Agent'

export default {
  name: 'report-widget-agents',
  components: {AutocompleteAgent},
  props: ['value'],
  data () {
    return {
      agent: undefined,
      selected: []
    }
  },
  methods: {
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
