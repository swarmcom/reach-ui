<template>
<div v-if="visible" style="margin-top: 20px">
  <h3>Conference requests:</h3>
  <div v-for="request in requests" :key="request.uuid" class="row" style="margin-bottom: 5px">
    <div class="col">
      {{ request.queue.name }}
    </div>
    <div class="col">
      {{ request.state }}
    </div>
    <div class="col">
      {{ request.time }}s / {{ request.effective }}s
    </div>
    <div class="col">
      <b-button size="sm" variant="outline-danger" @click="stop(request.uuid)">Cancel</b-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      updater: undefined,
      requests: []
    }
  },
  methods: {
    query: async function () {
      this.requests = await this.$agent.p_mfa('ws_agent', 'inqueue_conf', [])
      this.visible = this.requests.length > 0? true : false
      this.requests.forEach((inq) => {
        inq.time = Math.round(inq.time/1000)
        inq.effective = Math.round(inq.effective_time.time/1000)
      })
    },
    handleState ({state}) {
      if (state.record == 'inqueue_conf') {
        this.query()
      }
    },
    stop (uuid) {
      this.$agent.p_mfa('ws_agent', 'stop_inqueue_conf', [uuid])
    },
    onTimer () {
      this.requests.forEach((E, i, Arr) => { 
        E.time = E.time + 1
        E.effective = E.effective + 1
        Arr.splice(i, 1, E)
      })
    }
  },
  created () {
    this.updater = setInterval(this.onTimer, 1000)
    this.query()
    this.$bus.$on('inqueue_state', this.handleState)
  },
  beforeDestroy () {
    clearInterval(this.updater)
    this.$bus.$off('inqueue_state', this.handleState)
  },
}
</script>
