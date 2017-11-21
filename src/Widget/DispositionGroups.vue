<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div v-if="effective" class="col-5">
    <select class="custom-select pointer" style="width: 100%" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="disposition in dispositions"
        :value="disposition.id" :disabled="isDisabled()" :selected="isActive(disposition.id)">{{ disposition.name }}</option>
    </select>
  </div>
  <div v-if="effective" class="col-4">
    <select class="custom-select pointer" style="width: 100%" :value="value" disabled>
      <option></option>
      <option v-for="disposition in dispositions"
        :value="disposition.id" :selected="isEffective(disposition.id)">{{ disposition.name }}</option>
    </select>
  </div>
  <div v-else class="col-9">
    <select class="custom-select pointer" style="width: 100%" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="disposition in dispositions"
        :value="disposition.id" :disabled="isDisabled()" :selected="isActive(disposition.id)">{{ disposition.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-dispositions',
  props: ['label', 'value', 'effective'],
  data () {
    return {
      dispositions: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.dispositions.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.dispositions = await this.$agent.p_mfa('ws_db_disposition_group', 'get')
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
