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
          v-for="queue in queues"
          :key="queue.id"
          :value="queue.id"
          :selected="isActive(queue.id)"
        >
          {{ queue.name }}
        </option>
      </select>
    </b-col>
  </b-form-row>
</template>

<script>
export default {
  name: 'AdminRecipeActionTransferToQueue',
  props: {
    args: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      value: this.args[0],
      queues: []
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
      this.queues = await this.$agent.p_mfa('ws_db_queue', 'get')
    },
    onUpdate (value) {
      this.value = value
      this.commit()
    }
  }
}
</script>
