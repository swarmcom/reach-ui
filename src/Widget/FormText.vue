<template>
<div class="form-group row">
  <label :for="id" class="col-2 col-form-label">{{ label }}</label>
  <div class="col-10">
    <input class="form-control" type="text" :value="safe_value" v-on:input="onUpdate($event.target.value)" :id="id">
  </div>
</div>
</template>

<script>
export default {
  name: 'form-text',
  props: ['id', 'label', 'value'],
  data () {
    return {}
  },
  computed: {
    safe_value () {
      if(this.value === 'undefined') {
        return ''
      } else {
        return this.value
      }
    }
  },
  methods: {
    onUpdate (value) {
      this.$emit('input', value)
    }
  }
}
</script>