<template>
<autocomplete :query="query" v-model="agent" :placeholder="placeholder"></autocomplete>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'
export default {
  name: 'widget-autocomplete-agent',
  props: ['placeholder'],
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
