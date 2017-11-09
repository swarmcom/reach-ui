<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>
  <div class="col-9">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="queue in queues" :value="queue.id" :selected="isActive(queue.id)">{{ queue.name }}</option>
    </select>
  </div>
</div>
</template>

<script>
export default {
  name: 'form-text',
  props: ['label', 'value'],
  data () {
    return {
      queues: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isDisabled() {
      return this.queues.length == 0
    },
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get')
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
