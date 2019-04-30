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
    <b-col cols="9">
      <div class="form-check">
        <label class="form-check-label">
          <input
            type="checkbox"
            class="form-check-input position-static"
            :checked="value"
            @change="onChange"
          >
        </label>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'FormBool',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      prop: false
    }
  },
  created () {
    console.log(this.$props)
  },
  methods: {
    onChange (V) {
      this.$emit('input', V.target.checked)
    }
  }
}
</script>
