<template>
  <autocomplete :query="query" v-model="group"></autocomplete>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'
export default {
  name: 'widget-autocomplete-agent-group',
  data () {
    return {
      group: undefined
    }
  },
  components: { Autocomplete },
  methods: {
    query (text) {
      return this.$agent.p_mfa("ws_db_agent_group", "suggest", [text])
    },
  },
  watch: {
    group (value) {
      this.$emit('input', value)
      return value
    }
  }
}
</script>
