<template>
<div class="form-inline">
<autocomplete v-model="group" :query="query" placeholder="Agent group..."></autocomplete>
<button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="group in selected" @click="remove(group)">{{group.name}}</button>
</div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  name: 'report-widget-agent-groups',
  components: {Autocomplete},
  props: ['value'],
  data () {
    return {
      group: undefined,
      selected: []
    }
  },
  methods: {
    query (text) {
      return this.$agent.p_mfa('ws_agent', 'suggest', ['agent_group', text])
    },
    remove (group) {
      let index = this.selected.findIndex(el => el.id === group.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    },
    get: async function (id) {
      let entity = await this.$agent.p_mfa('ws_agent', 'entity', ['agent_group', id])
      this.selected.push(entity)
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
    this.value.forEach(id => this.get(id))
  }
}
</script>
