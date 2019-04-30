<template>
  <div style="margin-top: 5px">
    <b-row>
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
        <input
          class="form-control"
          type="password"
          :value="safe_value"
          @input="onUpdate"
        >
      </b-col>
      <b-col
        v-if="effective"
        cols="4"
      >
        <b-form-input
          type="password"
          :value="safe_effective"
          disabled
        />
      </b-col>
      <b-col
        v-else
        cols="9"
      >
        <b-form-input
          type="password"
          :value="safe_value"
          @input="onUpdate"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'FormPassword',
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
      type: [String, Boolean],
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
