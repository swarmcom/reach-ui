<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select pointer" style="width: 100%" :disabled="isDisabled()" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="group in groups" :value="group.id" :selected="isActive(group.id)">{{ group.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'agent-groups',
  props: ['label', 'value'],
  data () {
    return {
      groups: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.groups.length == 0
    },
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_db_agent_group', 'get')
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
