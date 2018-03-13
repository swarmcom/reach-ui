<template>
  <div>
    <div>Interval [min]:</div>
    <div style="padding-bottom: 30px">
      <b-input :value="interval" @input="checkValue" :min="min_value" step="1" size="sm" type="number"></b-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'interval-input',
  props: {
    value: {
      type: Number,
      required: true
    },
    min_value: {
      type: Number
    }
  },
  data () {
    return {
      interval: this.value
    }
  },
  methods: {
    checkValue (v) {
      this.interval = Number(v)
      this.$emit('input', this.interval)
    }
  },
  watch: {
    value (v) {
      this.interval = v
      return v
    }
  }
}
</script>
