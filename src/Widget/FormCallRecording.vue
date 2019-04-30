<template>
  <b-row
    style="margin-top: 5px"
  >
    <b-col cols="3">
      <label :id="label">
        {{ label }}
      </label>
    </b-col>
    <b-col
      v-if="effective"
      cols="5"
    >
      <b-form-select
        :value="computed_value"
        :options="options"
        @change="onChange"
      />
    </b-col>
    <b-col
      v-if="effective"
      cols="4"
    >
      <b-form-select
        :value="computed_effective"
        :options="options"
        disabled
      />
    </b-col>
    <b-col
      v-else
      cols="9"
    >
      <b-form-select
        :value="computed_value"
        :options="options"
        @change="onChange"
      />
    </b-col>
  </b-row>
</template>

<script>
function verbose(value) {
  console.log("value", value)
  if (value === true) {
    return 'Enabled'
  } else if (value === false) {
    return 'Disabled'
  } else {
    return 'On Demand'
  }
}

export default {
  name: 'FormBoolDrop',
  props: {
    value: {
      type: [String, Boolean],
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
    return {
      options: ['On Demand', 'Enabled', 'Disabled']
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
      if (V == 'On Demand') {
        this.$emit('input', null)
      } else if (V == 'Enabled') {
        this.$emit('input', true)
      } else if (V == 'Disabled') {
        this.$emit('input', false)
      }
    }
  }
}
</script>
