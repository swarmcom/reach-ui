<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select" :value="value" style="width: 100%" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="client in clients" :value="client.id" :selected="isActive(client.id)">{{ client.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'form-text',
  props: ['label', 'value'],
  data () {
    return {
      clients: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.clients.length == 0
    },
    query: async function () {
      this.clients = await this.$agent.p_mfa('ws_db_client', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  },
  created () {
    this.query()
  }
}
</script>
