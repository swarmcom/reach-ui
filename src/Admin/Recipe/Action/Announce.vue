<template>
<b-form-row>
  <b-col>
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="prompt in prompts" :value="prompt.id" :selected="isActive(prompt.id)">{{ prompt.name }}</option>
    </select>
  </b-col>
</b-form-row>
</template>

<script>
import Prompts from '@/Widget/Prompts'

export default {
  name: 'admin-recipe-action-announce',
  props: ['args'],
  data () {
    return {
      value: this.args[0],
      prompts: []
    }
  },
  methods: {
    commit () {
      this.$emit('input', [this.value])
    },
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.prompts = await this.$agent.p_mfa('ws_db_prompt', 'get')
    },
    onUpdate (value) {
      this.value = value
      this.commit()
    }
  },
  watch: {
    value () {
      this.commit()
    }
  },
  created () {
    this.query()
  }
}
</script>
