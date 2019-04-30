<template>
  <b-row style="margin-top: 5px">
    <b-col cols="3">
      <label
        :id="label"
        class="col-form-label"
      >{{ label }}</label>
    </b-col>
    <b-col
      v-if="effective"
      cols="5"
    >
      <b-form-input
        class="form-control"
        type="number"
        :value="safe_value"
        @input="onUpdate"
      />
    </b-col>
    <b-col
      v-if="effective"
      cols="4"
    >
      <b-form-input
        class="form-control"
        type="text"
        :value="safe_effective"
        disabled
      />
    </b-col>
    <b-col
      v-else
      cols="9"
    >
      <b-form-input
        class="form-control"
        type="number"
        :value="safe_value"
        @input="onUpdate"
      />
    </b-col>
  </b-row>
</template>

<script>
  export default {
    name: 'FormNumber',
    props: {
      value: {
        type: [String, Number],
        default: ""
      },
      label: {
        type: String,
        default: ""
      },
      effective: {
        type: [Boolean, Number],
        default: false
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