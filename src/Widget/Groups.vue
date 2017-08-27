<template>
<div class="form-group row">
  <label :for="id" class="col-2 col-form-label">{{ label }}</label>
  <div class="col-10">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)" :id="id">
      <option v-for="group in groups" :value="group.name" :selected="isActive(group.name)">{{ group.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'form-text',
  props: ['id', 'label', 'value'],
  data () {
    return {
      groups: []
    }
  },
  methods: {
    isActive(Name) {
      return Name === this.value
    },
    query () {
      this.$agent.get_groups(Profiles => this.groups = Profiles)
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