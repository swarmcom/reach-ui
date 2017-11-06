<template>
<b-form-row>
  <b-col cols="6">
    <b-form-select v-model="comparision" @change="commit" :options="comparasions"></b-form-select>
  </b-col>
  <b-col>
    <b-form-select v-model="value" @change="commit" :options="values"></b-form-select>
  </b-col>
</b-form-row>
</template>

<script>
export default {
  name: 'admin-recipe-condition-hour',
  props: ['args'],
  data () {
    return {
      comparasions: [ '=', '!=' ],
      comparision: this.args[0],
      values: [ 'Voice', 'Voicemail'],
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
