<template>
<div>
  <call v-if="call_visible" :uuid="uuid"></call>
  <conference v-if="conf_visible"></conference>
</div>
</template>

<script>
import Call from './Inqueue/Call'
import Conference from './Inqueue/Conference'

export default {
  data () {
    return {
      call_visible: false,
      conf_visible: false,
      uuid: undefined
    }
  },
  methods: {
    handleState ({ state }) {
      console.log('state', state)
      if (state.state == "available" || state.state == "release") {
        this.call_visible = false
        this.conf_visible = false
        this.uuid = undefined
      } else {
        if (state.inqueue.inqueue_call) {
          this.call_visible = true
          this.uuid = state.inqueue.inqueue_call
        }
        if (state.state == 'conference') {
          this.conf_visible = true
        }
      }
    }
  },
  created () {
    this.$agent.p_call('request_state', [])
    this.$bus.$on('agent_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('agent_state', this.handleState)
  },
  components: {
    call: Call,
    conference: Conference
  },
}
</script>
