<template>
  <div class="form-inline">
    <autocomplete
      v-model="line"
      :query="query"
      placeholder="Line In..."
    />
    <button
      v-for="itemLine in selected"
      :key="itemLine.id"
      class="btn btn-sm btn-outline-primary"
      style="margin-left: 10px"
      @click="remove(itemLine)"
    >
      {{ itemLine.name }}
    </button>
  </div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  name: 'ReportWidgetLineIns',
  components: {Autocomplete},
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      line: undefined,
      selected: []
    }
  },
  watch: {
    line (value) {
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
  },
  methods: {
    query (text) {
      return this.$agent.p_mfa('ws_agent', 'suggest', ['line_in', text])
    },
    remove (line) {
      let index = this.selected.findIndex(el => el.id === line.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    },
    get: async function (id) {
      let entity = await this.$agent.p_mfa('ws_agent', 'entity', ['line_in', id])
      this.selected.push(entity)
    }
  }
}
</script>
