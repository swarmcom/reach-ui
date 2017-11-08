<template>
<div>
  <call v-if="call_visible" :uuid="uuid"></call>
  <outgoing v-if="outgoing_visible"></outgoing>
  <ringer v-if="ringer_visible"></ringer>
  <spy v-if="spy_visible" :uuid="uuid"></spy>
  <conference v-if="conf_visible"></conference>
</div>
</template>

<script>
import Call from './Inqueue/Call'
import Conference from './Inqueue/Conference'
import Outgoing from './Inqueue/Outgoing'
import Ringer from './Inqueue/Ringer'
import Spy from './Inqueue/Spy'

export default {
  data () {
    return {
      call_visible: false,
      conf_visible: false,
      ringer_visible: false,
      outgoing_visible: false,
      spy_visible: false,
      uuid: undefined
    }
  },
  methods: {
    handleState ({ state }) {
      if (state.state == "available" || state.state == "release" || state.state == "suspended") {
        this.call_visible = false
        this.conf_visible = false
        this.ringer_visible = false
        this.outgoing_visible = false
        this.spy_visible = false
        this.uuid = undefined
      } else {
        if (state.inqueue.inqueue_call) {
          this.call_visible = true
          this.uuid = state.inqueue.inqueue_call
        }
        if (state.inqueue.outgoing) {
          this.outgoing_visible = true
        }
        if (state.inqueue.spy) {
          this.spy_visible = true
          this.uuid = state.inqueue.spy
        }
        if (state.state == 'ringing') {
          this.ringer_visible = true
        }
        if (state.state == 'conference') {
          this.conf_visible = true
        }
        if (state.state == 'inconference') {
          this.conf_visible = true
        }
        if (state.state == 'outgoing') {
          this.outgoing_visible = true
        }
      }
    },
  },
  created () {
    this.$agent.p_mfa('ws_agent', 'request_state', [])
    this.$bus.$on('agent_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('agent_state', this.handleState)
  },
  components: {
    call: Call,
    conference: Conference,
    outgoing: Outgoing,
    ringer: Ringer,
    spy: Spy
  },
}
</script>
