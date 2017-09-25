<template>
<div class="form-group row">
  <label class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="profile in profiles" :value="profile.id" :selected="isActive(profile.id)">{{ profile.name }}</option>
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
      profiles: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.profiles = await this.$agent.p_mfa('ws_admin', 'get_agent_groups')
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