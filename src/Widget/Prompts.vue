<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div v-if="effecitve" class="col-5">
    <select class="custom-select" style="width: 100%" :value="value"  :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="prompt in prompts" :value="prompt.id" :selected="isActive(prompt.id)">{{ prompt.name }}</option>
    </select>
  </div>
  <div v-if="effecitve" class="col-4">
    <select class="custom-select" style="width: 100%" :value="value" disabled>
      <option></option>
      <option v-for="prompt in prompts" :value="prompt.id" :selected="isEffective(prompt.id)">{{ prompt.name }}</option>
    </select>
  </div>
  <div v-else class="col-9">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="prompt in prompts" :value="prompt.id" :selected="isActive(prompt.id)">{{ prompt.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-prompts',
  props: ['label', 'value', 'effecitve'],
  data () {
    return {
      prompts: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.prompts.length == 0
    },
    isEffective(Id) {
      return Id == this.effective
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
