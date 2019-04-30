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
    <b-col
      v-if="effective"
      cols="5"
    >
      <b-form-input
        :value="safe_value"
        :state="filterState"
        @input="onUpdate"
      />
    </b-col>
    <b-col
      v-if="effective"
      cols="4"
    >
      <b-form-input
        :value="safe_effective"
        disabled
      />
    </b-col>
    <b-col
      v-else
      cols="9"
    >
      <b-form-input
        :value="safe_value"
        :state="filterState"
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
        type: [String, Number],
        default: ""
      }
    },
    data () {
      return {
        filterState: null
      }
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
        if (Value.toString().match(/^[0-9.]+$/gi) || Value.toString() === "") {
          this.$emit('input', Value)
          this.filterState = null
        }
        else {
          this.filterState = false
        }
      }
    }
  }
</script>