<template>
<select class="custom-select" :value="value" style="width: 100%" :disabled="isDisabled()" @change="change($event.target.value)">
  <option></option>
  <option v-for="entry in entries" :value="entry.id" :selected="isActive(entry.id)">{{ entry.name }}</option>
</select>
</template>

<script>
export default {
  name: 'widget-domain-node',
  props: ['domain', 'value', 'type'],
  data () {
    return {
      entries: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.entries.length == 0
    },
    query: async function () {
      if (this.type) {
        this.entries = await this.$agent.p_mfa('ws_kam_domain_node', 'by_domain', [this.domain, this.type])
      } else {
        this.entries = await this.$agent.p_mfa('ws_kam_domain_node', 'by_domain', [this.domain])
      }
    },
    change (value) {
      this.$emit('input', parseInt(value))
    }
  },
  created () {
    this.query()
  }
}
</script>
