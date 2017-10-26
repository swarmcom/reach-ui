<template>
<div class="row" style="margin-top: 5px">
  <label class="col-3 col-form-label">{{ label }}</label>
  <div class="col-7">
    <select class="custom-select" :value="value" @change="onUpdate($event.target.value)">
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
