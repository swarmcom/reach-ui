<template>
<b-dropdown id="ddown1" text="Transfer to queue" variant="outline-primary">
  <b-dropdown-item v-for="queue in queues" :key="queue.id" @click="onUpdate(queue.id)">{{ queue.name }}</b-dropdown-item>
</b-dropdown>
</template>

<script>
export default {
  name: 'transfer-queue',
  data () {
    return {
      queues: []
    }
  },
  methods: {
    query () {
      this.$agent.get_transfer_queues(Obj => this.queues = Obj.reply)
    },
    onUpdate (id) {
      this.$agent.transfer_to_queue(id)
    }
  },
  mounted () {
    this.query()
  }
}
</script>