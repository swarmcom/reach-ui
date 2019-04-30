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
      <b-form-select
        class="pointer"
        :value="computed_value"
        :options="options"
        @change="onChange"
      />
    </b-col>
    <b-col
      v-if="effective"
      cols="4"
    >
      <b-form-input
        :value="computed_effective"
        disabled
      />
    </b-col>
    <b-col
      v-else
      cols="9"
    >
      <b-form-select
        class="pointer"
        :value="computed_value"
        :options="options"
        @change="onChange"
      />
    </b-col>
  </b-row>
</template>

<script>
function verbose(value) {
  if (value === true) {
    return 'True'
  } else if (value === false) {
    return 'False'
  } else {
    return 'Not set'
  }
}

export default {
  name: 'FormBoolDrop',
  props: {
    value: {
      type: [Boolean, String],
      default: "Not set"
    },
    label: {
      type: String,
      default: ""
    },
    effective: {
      type: [Boolean, String],
      default: false
    }
  },
  data () {
    return {
      options: ['Not set', 'True', 'False']
    }
  },
  computed: {
    computed_value () {
      return verbose(this.value)
    },
    computed_effective () {
      return verbose(this.effective)
    }
  },
  created () {
  },
  methods: {
    onChange (V) {
      if (V == 'Not set') {
        this.$emit('input', null)
      } else if (V == 'True') {
        this.$emit('input', true)
      } else if (V == 'False') {
        this.$emit('input', false)
      }
    }
  }
}
</script>
