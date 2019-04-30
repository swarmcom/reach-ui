<template>
  <b-form-row>
    <b-col cols="4">
      <b-form-select
        v-model="comparision"
        :options="comparasions"
        @change="commit"
      />
    </b-col>
    <b-col>
      <b-form-select
        v-model="value"
        :options="values"
        @change="commit"
      />
    </b-col>
  </b-form-row>
</template>

<script>
export default {
  name: 'AdminRecipeConditionHour',
  props: {
    args: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      comparasions: [ '=', '!=' ],
      comparision: this.args[0],
      values: [ 'Voice', 'Voicemail'],
      value: this.args[1]
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
  methods: {
    commit () {
      this.$emit('input', [this.comparision, this.value])
    }
  },
}
</script>
