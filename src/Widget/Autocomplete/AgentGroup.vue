<template>
<autocomplete :query="query" v-model="group" :placeholder="placeholder"></autocomplete>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'
export default {
  name: 'widget-autocomplete-agent-group',
  props: ['placeholder'],
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
