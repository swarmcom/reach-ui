<template>
<b-form-row>
  <b-col>
    <b-form-input v-model="value"></b-form-input>
  </b-col>
</b-form-row>
</template>

<script>
export default {
  name: 'admin-recipe-action-priority',
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
