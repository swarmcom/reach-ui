<template>
  <autocomplete :query="query" v-model="agent"></autocomplete>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'
export default {
  name: 'widget-autocomplete-agent',
  data () {
    return {
      agent: undefined
    }
  },
  components: { Autocomplete },
  methods: {
    query (text) {
      return this.$agent.p_mfa("ws_db_agent", "suggest", [text])
    },
  },
  watch: {
    agent (value) {
      this.$emit('input', value)
      return value
    }
  }
}
</script>
