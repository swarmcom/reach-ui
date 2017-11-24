<template>
<div class="form-inline">
<autocomplete-agent-group :query="query" v-model="group" placeholder="Agent group..."></autocomplete-agent-group>
<button class="btn btn-outline-secondary" style="margin-left: 10px" v-for="group in selected" @click="remove(group)">{{group.name}}</button>
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
    },
    query () {
      this.$agent.p_mfa('ws_db_agent_group', 'get', [])
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
    this.query()
  }
}
</script>
