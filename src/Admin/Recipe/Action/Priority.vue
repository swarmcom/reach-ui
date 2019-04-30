<template>
  <b-form-row>
    <b-col>
      <b-form-input v-model="value" />
    </b-col>
  </b-form-row>
</template>

<script>
export default {
  name: 'AdminRecipeActionPriority',
  props: {
    args: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      value: this.args[0]
    }
  },
  watch: {
    value () {
      this.commit()
    }
  },
  methods: {
    commit () {
      this.$emit('input', [this.value])
    }
  },
}
</script>
