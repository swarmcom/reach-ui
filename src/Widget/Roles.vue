<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div v-if="effective" class="col-5">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="role in roles" :value="role.id" :selected="isActive(role.id)">{{ role.name }}</option>
    </select>
  </div>
  <div v-if="effective" class="col-4">
    <select class="custom-select" :value="value" disabled style="width: 100%">
      <option></option>
      <option v-for="role in roles" :value="role.id" :selected="isEffective(role.id)">{{ role.name }}</option>
    </select>
  </div>
  <div v-else class="col-9">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="role in roles" :value="role.id" :selected="isActive(role.id)">{{ role.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-roles',
  props: ['label', 'value', 'effective'],
  data () {
    return {
      roles: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.roles.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.roles = await this.$agent.p_mfa('ws_db_role', 'get')
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
