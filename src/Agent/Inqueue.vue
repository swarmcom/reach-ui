<template>
<div>
  <call v-if="call_visible" :uuid="uuid"></call>
  <outgoing v-if="outgoing_visible"></outgoing>
  <ringer v-if="ringer_visible"></ringer>
  <spy v-if="spy_visible" :uuid="uuid"></spy>
  <conference v-if="conf_visible"></conference>
  <conf-request></conf-request>
</div>
</template>

<script>
import Call from '@/Agent/Inqueue/Call'
import Conference from '@/Agent/Inqueue/Conference'
import Outgoing from '@/Agent/Inqueue/Outgoing'
import Ringer from '@/Agent/Inqueue/Ringer'
import Spy from '@/Agent/Inqueue/Spy'
import InqueueConf from '@/Agent/Inqueue/Conf'

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
        console.log("XXX", state.inqueue)
        if (state.inqueue.record == 'inqueue_call') {
          console.log("VISIBLE", state.inqueue.uuid)
          this.call_visible = true
          this.uuid = state.inqueue.uuid
        }
        if (state.inqueue.record == 'outgoing') {
          this.outgoing_visible = true
        }
        if (state.inqueue.record == 'spy') {
          this.spy_visible = true
          this.uuid = state.inqueue.uuid
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
    spy: Spy,
    'conf-request': InqueueConf
  },
}
</script>
