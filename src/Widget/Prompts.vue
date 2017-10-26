<template>
<div class="row" style="margin-top: 5px">
  <label class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="prompt in prompts" :value="prompt.id" :selected="isActive(prompt.id)">{{ prompt.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-prompts',
  props: ['label', 'value'],
  data () {
    return {
      prompts: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.prompts = await this.$agent.p_mfa('ws_db_prompt', 'get')
    },
    onUpdate (value) {
      this.$emit('input', value)
    }
  },
  created () {
    this.query()
  }
}
</script>
