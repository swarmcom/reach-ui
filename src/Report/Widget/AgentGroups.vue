<template>
<div class="form-inline">
<autocomplete v-model="group" :query="query" placeholder="Agent group..."></autocomplete>
<button class="btn btn-sm btn-outline-primary pointer" style="margin-left: 10px" v-for="group in selected" @click="remove(group)">{{group.name}}</button>
</div>
</template>

<script>
import AutocompleteAgentGroup from '@/Widget/Autocomplete/AgentGroup'

export default {
  name: 'report-widget-agent-groups',
  components: {AutocompleteAgentGroup},
  props: ['value'],
  data () {
    return {
      group: undefined,
      selected: []
    }
  },
  methods: {
    remove (group) {
      let index = this.selected.findIndex(el => el.id === group.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    }
  },
  watch: {
    group (value) {
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
