<template>
<b-dropdown size="sm" id="ddown1" text="Queue" variant="outline-primary">
  <b-dropdown-item v-for="queue in queues" :key="queue.id" @click="onUpdate(queue.id)">{{ queue.name }}</b-dropdown-item>
</b-dropdown>
</template>

<script>
export default {
  name: 'conference-queue',
  data () {
    return {
      queues: []
    }
  },
  methods: {
    query: async function () {
      this.queues = await this.$agent.p_mfa('ws_agent', 'get_transfer_queues')
    },
    onUpdate (id) {
      this.$agent.conference_to_queue(id)
    }
  },
  mounted () {
    this.query()
  }
}
</script>
