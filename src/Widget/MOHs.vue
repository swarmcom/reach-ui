<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div v-if="effective" class="col-5">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="moh in mohs" :value="moh.id" :selected="isActive(moh.id)">{{ moh.name }}</option>
    </select>
  </div>
  <div v-if="effective" class="col-4">
    <select class="custom-select" style="width: 100%" :value="effective" disabled>
      <option></option>
      <option v-for="moh in mohs" :value="moh.id" :selected="isEffective(moh.id)">{{ moh.name }}</option>
    </select>
  </div>
  <div v-else class="col-9">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="moh in mohs" :value="moh.id" :selected="isActive(moh.id)">{{ moh.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-mohss',
  props: ['label', 'value', 'effective'],
  data () {
    return {
      mohs: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.mohs.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
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
