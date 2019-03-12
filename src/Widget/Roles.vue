<template>
<b-row style="margin-top: 5px">
  <b-col cols="3">
    <label :id="label" class="col-form-label">{{ label }}</label>
  </b-col>
  <b-col v-if="effective" cols="5">
    <b-form-select class="pointer" :value="value" :disabled="isDisabled()" @change="onUpdate">
      <option></option>
      <option v-for="role in roles"
        :value="role.id" :selected="isActive(role.id)" :key="role.id">{{ role.name }}</option>
    </b-form-select>
  </b-col>
  <b-col v-if="effective" cols="4">
    <b-form-input type="text" :value="roles.find((element) => element.id == effective).name" disabled/>
  </b-col>
  <b-col v-else cols="9">
    <b-form-select class="pointer" :value="value" :disabled="isDisabled()" @change="onUpdate">
      <option></option>
      <option v-for="role in roles"
        :value="role.id" :selected="isActive(role.id)" :key="role.id">{{ role.name }}</option>
    </b-form-select>
  </b-col>
</b-row>
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
