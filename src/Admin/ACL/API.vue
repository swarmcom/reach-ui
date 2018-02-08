<template>
</template>

<script>
export default {
  methods: {
    query (text) {
      return this.$agent.p_mfa(this.module, "suggest", [text])
    },
    remove (obj) {
      let index = this.selected.findIndex(el => el.id === obj.id)
      if (index >= 0) {
        this.$emit('remove', obj)
        this.selected.splice(index, 1)
      }
    }
  },
  watch: {
    obj (value) {
      let index = this.selected.findIndex(el => el.id === value.id)
      if (index < 0) {
        this.$emit('add', value)
        this.selected.push(value)
      }
      return value
    },
    selected (value) {
      this.$emit('input', value)
      return value
    },
    value (value) {
      this.selected = value
    }
  },
  created () {
  }
}
</script>
