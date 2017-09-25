<template>
<div class="form-group row">
  <label class="col-3 col-form-label">{{ label }}</label>
  <div class="col-7">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="group in groups" :value="group.id" :selected="isActive(group.id)">{{ group.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'queue-groups',
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
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_admin', 'get_queue_groups')
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