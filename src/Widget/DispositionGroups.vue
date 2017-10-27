<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="disposition in dispositions"
        :value="disposition.id" :selected="isActive(disposition.id)">{{ disposition.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'widget-dispositions',
  props: ['label', 'value'],
  data () {
    return {
      dispositions: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    query: async function () {
      this.dispositions = await this.$agent.p_mfa('ws_db_disposition_group', 'get')
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
