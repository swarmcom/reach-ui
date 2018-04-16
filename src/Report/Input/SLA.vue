<template>
  <div>
    <div>{{caption}}:</div>
    <div style="padding-bottom: 30px">
      <b-input :value="sla" @input="checkValue" min="1" step="1" type="number"></b-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sla-input',
  props: {
    value: {
      type: Number,
      required: true
    },
    caption: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      sla: this.value
    }
  },
  methods: {
    checkValue (v) {
      this.sla = Number(v)
      this.$emit('input', this.sla)
    }
  },
  watch: {
    value (v) {
      this.sla = v
      return v
    }
  }
}
</script>
