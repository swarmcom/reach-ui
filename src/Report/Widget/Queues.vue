<template>
<div class="form-inline">
<autocomplete v-model="queue" :query="query" placeholder="Queue..."></autocomplete>
<button class="btn btn-sm btn-outline-primary" style="margin-left: 10px" v-for="queue in selected" @click="remove(queue)">{{queue.name}}</button>
</div>
</template>

<script>
import Autocomplete from '@/Widget/Autocomplete'

export default {
  name: 'report-widget-queues',
  components: {Autocomplete},
  props: ['value'],
  data () {
    return {
      queue: undefined,
      selected: []
    }
  },
  methods: {
    query (text) {
      return this.$agent.p_mfa('ws_agent', 'suggest', ['queue', text])
    },
    remove (queue) {
      let index = this.selected.findIndex(el => el.id === queue.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    },
    get: async function (id) {
      let entity = await this.$agent.p_mfa('ws_agent', 'entity', ['queue', id])
      this.selected.push(entity)
    }
  },
  watch: {
    queue (value) {
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
  }
}
</script>
