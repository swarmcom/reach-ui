<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-5">
    <input class="form-control" type="text" :value="safe_value" v-on:input="onUpdate($event.target.value)">
  </div>
  <div class="col-4">
    <input class="form-control" type="text" :value="safe_effective" disabled>
  </div>
</div>
</template>

<script>
export default {
  name: 'form-text-effective',
  props: ['label', 'value', 'effective'],
  data () {
    return {}
  },
  computed: {
    safe_value () {
      return this.value === 'undefined' ? '' : this.value
    },
    safe_effective () {
      return this.effective === 'undefined' ? '' : this.effective
    }
  },
  methods: {
    onUpdate (Value) {
      this.$emit('input', Value)
    }
  }
}
</script>
