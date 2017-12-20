<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div v-if="effective" class="col-5">
    <b-form-select :value="computed_value" :options="options" v-on:change="onChange"></b-form-select>
  </div>
  <div v-if="effective" class="col-4">
    <b-form-select :value="computed_effective" :options="options" disabled></b-form-select>
  </div>
  <div v-else class="col-9">
    <b-form-select :value="computed_value" :options="options" v-on:change="onChange"></b-form-select>
  </div>
</div>
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
  name: 'form-bool-drop',
  props: ['label', 'value', 'effective'],
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
  methods: {
    onChange (V) {
      if (V == 'Not set') {
        this.$emit('input', undefined)
      } else if (V == 'True') {
        this.$emit('input', true)
      } else if (V == 'False') {
        this.$emit('input', false)
      }
    }
  },
  created () {
  }
}
</script>
