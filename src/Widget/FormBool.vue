<template>
<div class="form-group row">
  <label class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9 ">
    <div class="form-check">
      <label class="form-check-label">
        <input type="checkbox" class="form-check-input" v-bind:checked="value" v-on:change="onChange">
      </label>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'form-bool',
  props: ['label', 'value'],
  data () {
    return {
      prop: false
    }
  },
  methods: {
    onChange (V) {
      this.$emit('input', V.target.checked)
    }
  },
  created () {
    console.log(this.$props)
  }
}
</script>
