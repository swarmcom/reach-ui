<template>
<div class="form-group row">
  <label class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9 ">
    <b-form-select v-bind:value="computed_value" :options="options" v-on:input="onChange"></b-form-select>
  </div>
</div>
</template>

<script>
export default {
  name: 'form-bool-drop',
  props: ['label', 'value'],
  data () {
    return {
      options: ['Not set', 'True', 'False']
    }
  },
  computed: {
    computed_value () {
      if (this.value === true) {
        return 'True'
      } else if (this.value === false) {
        return 'False'
      } else {
        return 'Not set'
      }
    }
  },
  methods: {
    onChange (V) {
      if (V == 'Not set') {
        this.$emit('input', 'undefined')
      } else if (V == 'True') {
        this.$emit('input', true)
      } else if (V == 'False') {
        this.$emit('input', false)
      }
    }
  },
  created () {
    console.log(this.$props)
  }
}
</script>
