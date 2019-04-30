<template>
  <b-form-row>
    <b-col cols="6" />
  </b-form-row>
</template>

<script>
export default {
  name: 'AdminRecipeActionVoicemail',
  props: {
    args: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
    }
  },
  watch: {
    value () {
      this.commit()
    }
  },
  methods: {
    commit () {
      this.$emit('input', [])
    }
  },
}
</script>
