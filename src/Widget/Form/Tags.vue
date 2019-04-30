<template>
  <div>
    <b-row style="margin-top: 5px">
      <b-col>
        <label
          :id="label"
          class="col-form-label"
        >{{ label }}</label>
      </b-col>
      <tags
        v-model="value"
        :placeholder="placeholder"
        class="col-9"
      />
    </b-row>
    <b-row
      v-if="has_effective()"
      style="margin-top: 5px"
    >
      <b-col>
        <label
          :id="label"
          class="col-form-label"
        >{{ effectiveLabel }}</label>
      </b-col>
      <tags
        v-model="effective"
        disabled="true"
        class="col-9"
      />
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'FormTags',
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: Array,
      default: () => ([])
    },
    placeholder: {
      type: String,
      default: ""
    },
    effectiveLabel: {
      type: String,
      default: ""
    },
    effective: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
    }
  },
  methods: {
    has_effective () {
      return this.effective && this.effective.length > 0
    }
  }
}
</script>
