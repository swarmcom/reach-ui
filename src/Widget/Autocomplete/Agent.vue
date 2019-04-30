<template>
  <autocomplete
    v-model="agent"
    :query="query"
    :placeholder="placeholder"
  />
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'
export default {
  name: 'WidgetAutocompleteAgent',
  components: { Autocomplete },
  props: {
    placeholder: {
      type: String,
      default: "" 
    }
  },
  data () {
    return {
      agent: undefined
    }
  },
  watch: {
    agent (value) {
      this.$emit('input', value)
      return value
    }
  },
  methods: {
    query (text) {
      return this.$agent.p_mfa("ws_db_agent", "suggest", [text])
    },
  }
}
</script>
