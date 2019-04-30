<template>
  <div class="form-inline">
    <autocomplete
      v-model="client"
      :query="query"
      placeholder="Client..."
    />
    <button
      v-for="itemClient in selected"
      :key="itemClient.id"
      class="btn btn-sm btn-outline-primary"
      style="margin-left: 10px"
      @click="remove(itemClient)"
    >
      {{ itemClient.name }}
    </button>
  </div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  name: 'ReportWidgetClients',
  components: {Autocomplete},
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      client: undefined,
      selected: []
    }
  },
  watch: {
    client (value) {
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
      return this.$agent.p_mfa('ws_agent', 'suggest', ['client', text])
    },
    remove (client) {
      let index = this.selected.findIndex(el => el.id === client.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    },
    get: async function (id) {
      let entity = await this.$agent.p_mfa('ws_agent', 'entity', ['client', id])
      this.selected.push(entity)
    }
  }
}
</script>
