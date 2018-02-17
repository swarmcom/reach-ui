<template>
<div class="row" style="margin-top: 5px">
  <label :id="label" class="col-3 col-form-label">{{ label }}</label>

  <div v-if="effective" class="col-5">
    <select class="custom-select" style="width: 100%" :value="value" :disabled="isDisabled()" @change="onUpdate($event.target.value)">
      <option></option>
      <option v-for="queue in queues" :value="queue.id" :selected="isActive(queue.id)">{{ queue.name }}</option>
    </select>
  </div>
  <div v-if="effective" class="col-4">
    <select class="custom-select" style="width: 100%" :value="value" disabled>
      <option></option>
      <option v-for="queue in queues" :value="queue.id" :selected="isEffective(queue.id)">{{ queue.name }}</option>
    </select>
  </div>
  <div v-else class="col-9">
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
  props: ['label', 'value', 'effective'],
  data () {
    return {
      queues: []
    }
  },
  methods: {
    isActive(Id) {
      return Id == this.value
    },
    isEffective(Id) {
      return Id == this.effective
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
