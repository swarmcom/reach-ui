<template>
<b-form-row>
  <b-col cols="6">
    <b-form-select v-model="comparision" @change="commit" :options="comparasions"></b-form-select>
  </b-col>
  <b-col>
    <b-form-input v-model="value" @change="commit"></b-form-input>
  </b-col>
</b-form-row>
</template>

<script>
export default {
  name: 'admin-recipe-condition-eligible-agents-ratio',
  props: ['args'],
  data () {
    return {
      comparasions: [ '<', '=', '>' ],
      comparision: this.args[0],
      value: this.args[1]
    }
  },
  methods: {
    commit () {
      this.$emit('input', [this.comparision, this.value])
    }
  },
  watch: {
    comparision () {
      this.commit()
    },
    value () {
      this.commit()
    }
  },
}
</script>
