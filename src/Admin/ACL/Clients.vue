<template>
<div class="form-inline">
<autocomplete v-model="client" :query="query" placeholder="Client..."></autocomplete>
<button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="client in selected" @click="remove(client)">{{client.name}}</button>
</div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  name: 'acl-widget-clients',
  components: {Autocomplete},
  props: ['value'],
  data () {
    return {
      client: undefined,
      selected: []
    }
  },
  methods: {
    query (text) {
      return this.$agent.p_mfa("ws_db_client", "suggest", [text])
    },
    remove (client) {
      let index = this.selected.findIndex(el => el.id === client.id)
      if (index >= 0) {
        this.$emit('remove', client)
        this.selected.splice(index, 1)
      }
    }
  },
  watch: {
    client (value) {
      let index = this.selected.findIndex(el => el.id === value.id)
      if (index < 0) {
        this.$emit('add', value)
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
  }
}
</script>
