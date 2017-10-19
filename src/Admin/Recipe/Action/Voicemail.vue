<template>
<b-form-row>
  <b-col cols="6">
  </b-col>
</b-form-row>
</template>

<script>
export default {
  name: 'admin-recipe-action-voicemail',
  props: ['args'],
  data () {
    return {
    }
  },
  methods: {
    commit () {
      this.$emit('input', [])
    }
  },
  watch: {
    value () {
      this.commit()
    }
  },
}
</script>
