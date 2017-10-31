<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="role in roles" :value="role.id" :selected="isActive(role.id)">{{ role.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-roles',
  props: ['label', 'value'],
  data () {
    return {
      roles: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
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
