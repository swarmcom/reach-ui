<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <input class="form-control" type="text" :value="safe_value" v-on:input="onUpdate($event.target.value)">
  </div>
</div>
</template>

<script>
export default {
  name: 'form-text',
  props: ['label', 'value'],
  data () {
    return {}
  },
  computed: {
    safe_value () {
      return this.value === 'undefined' ? '' : this.value
    }
  },
  methods: {
    onUpdate (Value) {
      this.$emit('input', Value)
    }
  }
}
</script>
