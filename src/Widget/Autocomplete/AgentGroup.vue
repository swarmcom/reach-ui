<template>
  <autocomplete
    v-model="group"
    :query="query"
    :placeholder="placeholder"
  />
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'
export default {
  name: 'WidgetAutocompleteAgentGroup',
  components: { Autocomplete },
  props: {
    placeholder: {
      type: String,
      default: "" 
    }
  },
  data () {
    return {
      group: undefined
    }
  },
  watch: {
    group (value) {
      this.$emit('input', value)
      return value
    }
  },
  methods: {
    query (text) {
      return this.$agent.p_mfa("ws_db_agent_group", "suggest", [text])
    },
  }
}
</script>
