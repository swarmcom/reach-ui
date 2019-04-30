<template>
  <b-form-row>
    <b-col>
      <select
        class="custom-select"
        :value="value"
        @change="onUpdate($event.target.value)"
      >
        <option />
        <option
          v-for="prompt in prompts"
          :key="prompt.id"
          :value="prompt.id"
          :selected="isActive(prompt.id)"
        >
          {{ prompt.name }}
        </option>
      </select>
    </b-col>
  </b-form-row>
</template>

<script>
import Prompts from '@/Widget/Prompts'

export default {
  name: 'AdminRecipeActionAnnounce',
  props: {
    args: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      value: this.args[0],
      prompts: []
    }
  },
  watch: {
    value () {
      this.commit()
    }
  },
  created () {
    this.query()
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
  }
}
</script>
