<template>
  <b-row
    style="margin-top: 5px"
  >
    <b-col cols="3">
      <label
        :id="label"
      >
        {{ label }}
      </label>
    </b-col>
    <b-col cols="5">
      <input
        class="form-control"
        type="text"
        :value="safe_value"
        @input="onUpdate($event.target.value)"
      >
    </b-col>
    <b-col cols="4">
      <input
        class="form-control"
        type="text"
        :value="safe_effective"
        disabled
      >
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'FormTextEffective',
  props: {
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    },
    effective: {
      type: String,
      default: ""
    }
  },
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
