<template>
<div class="form-group row">
  <label :for="id" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-7">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)" :id="id">
      <option></option>
      <option v-for="group in groups" :value="group.id" :selected="isActive(group.id)">{{ group.name }}</option>
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
    isActive(Id) {
      return Id == this.value
    },
    query () {
      this.$agent.get_groups(Obj => this.groups = Obj.reply)
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