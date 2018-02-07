<template>
  <div class="row" style="margin-top: 5px">
    <label :id="label" class="col-3 col-form-label">{{ label }}</label>
    <div v-if="effective" class="col-5">
      <b-form-input :value="safe_value" v-on:input="onUpdate" :state="filterState"></b-form-input>
    </div>
    <div v-if="effective" class="col-4">
      <b-form-input :value="safe_effective" disabled></b-form-input>
    </div>
    <div v-else class="col-9">
      <b-form-input :value="safe_value" v-on:input="onUpdate" :state="filterState"></b-form-input>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'form-number',
    props: ['label', 'value', 'effective'],
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
        if (Value.toString().match(/^[0-9.]+$/gi)) {
          this.$emit('input', Value)
          this.filterState = null
        }
        else {
          this.filterState = false
        }
      }
    },
    data () {
      return {
        filterState: null
      }
    }
  }
</script>