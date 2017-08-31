<template>
<div class="form-group row">
  <label :for="id" class="col-2 col-form-label">{{ label }}</label>
  <div class="col-10">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)" :id="id">
      <option></option>
      <option v-for="profile in profiles" :value="profile.id" :selected="isActive(profile.id)">{{ profile.name }}</option>
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
      profiles: []
    }
  },
  methods: {
    isActive(Id) {
      return Id === this.value
    },
    query () {
      this.$agent.get_profiles(Obj => this.profiles = Obj.reply)
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