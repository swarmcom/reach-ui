<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div v-if="effective" class="col-5">
    <select class="custom-select" style="width: 100%" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="group in groups"
        :value="group.id" :disabled="isDisabled()" :selected="isActive(group.id)">{{ group.name }}</option>
    </select>
  </div>
  <div v-if="effective" class="col-4">
    <select class="custom-select" style="width: 100%" :value="value" disabled>
      <option></option>
      <option v-for="group in groups"
        :value="group.id" :selected="isEffective(group.id)">{{ group.name }}</option>
    </select>
  </div>
  <div v-else class="col-9">
    <select class="custom-select" style="width: 100%" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="group in groups"
        :value="group.id" :disabled="isDisabled()" :selected="isActive(group.id)">{{ group.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-tag-groups',
  props: ['label', 'value', 'effective'],
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
    isEffective(Id) {
      return Id == this.effective
    },
    query: async function () {
      this.groups = await this.$agent.p_mfa('ws_db_tag_group', 'get')
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
