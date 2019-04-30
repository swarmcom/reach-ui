<template>
  <b-dropdown
    id="ddown1"
    size="sm"
    text="Queue"
    variant="outline-primary"
  >
    <b-dropdown-item
      v-for="queue in queues"
      :key="queue.id"
      @click="onUpdate(queue.id)"
    >
      {{ queue.name }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: 'TransferQueue',
  data () {
    return {
      queues: []
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_agent', 'get_transfer_queues')
    },
    onUpdate (id) {
      this.$agent.transfer_to_queue(id)
    }
  }
}
</script>
