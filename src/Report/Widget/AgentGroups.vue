<template>
<select2 :options="groups" v-model="selected"></select2>
</template>

<script>
import Select2 from '@/Widget/Select2'

export default {
  name: 'report-widget-agent-groups',
  components: {Select2},
  props: ['value'],
  data () {
    return {
      groups: [],
      selected: []
    }
  },
  methods: {
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get', [])
      this.groups.forEach( X => X.text = X.name )
    }
  },
  watch: {
    value (value, old) {
      this.selected = value
      return value
    },
    selected (value) {
      this.$emit('input', value)
    }
  },
  created () {
    this.query()
  }
}
</script>
