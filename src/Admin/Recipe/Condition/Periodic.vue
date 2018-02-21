<template>
<b-form-row>
  <b-col cols="4">
    <b-form-input v-model="value"></b-form-input>
  </b-col>
</b-form-row>
</template>

<script>
export default {
  name: 'admin-recipe-condition-periodic',
  props: ['args'],
  data () {
    return {
      value: this.args[0]
    }
  },
  methods: {
    commit () {
      this.$emit('input', [this.value])
    }
  },
  watch: {
    value () {
      this.commit()
    }
  },
}
</script>
