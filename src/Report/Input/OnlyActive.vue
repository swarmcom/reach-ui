<template>
  <div>
    <b-form-checkbox id="checkbox1" :checked="status" @change="onChange" value="true" unchecked-value="false" style="padding-bottom: 30px" size="sm">
      Show Only Intervals with Activity
    </b-form-checkbox>
  </div>
</template>

<script>
export default {
  name: 'only-active-input',
  props: ['value'],
  data () {
    return {
      status: this.value
    }
  },
  methods: {
    onChange (v) {
      this.$emit('input', v)
    }
  },
  watch: {
    value (v) {
      this.status = v
      return v
    }
  }
}
</script>
