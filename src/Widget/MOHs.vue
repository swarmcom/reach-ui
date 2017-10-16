<template>
<div class="form-group row">
  <label class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="moh in mohs" :value="moh.id" :selected="isActive(moh.id)">{{ moh.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-mohss',
  props: ['label', 'value'],
  data () {
    return {
      mohs: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.mohs = await this.$agent.p_mfa('ws_db_moh', 'get')
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
