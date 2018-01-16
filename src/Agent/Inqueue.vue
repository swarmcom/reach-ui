<template>
<div>
  <b-row>
    <b-col cols="12" md="9" order="2" order-md="1">
      <outgoing v-if="outgoing_visible"></outgoing>
      <call v-if="call_visible" :uuid="uuid"></call>
      <spy v-if="spy_visible" :uuid="uuid"></spy>
    </b-col>
    <b-col cols="12" md="3" order="1" order-md="2">
      <phone-actions :uuid="uuid"></phone-actions>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="12">
      <ringer v-if="ringer_visible"></ringer>
      <transfer-conference :uuid="uuid" v-if="this.$agent.can_conference()"></transfer-conference>
      <conference v-if="conf_visible"></conference>
      <conf-request></conf-request>
    </b-col>
  </b-row>
</div>
</template>

<script>
import Call from '@/Agent/Inqueue/Call'
import Conference from '@/Agent/Inqueue/Conference'
import Outgoing from '@/Agent/Inqueue/Outgoing'
import Ringer from '@/Agent/Inqueue/Ringer'
import Spy from '@/Agent/Inqueue/Spy'
import InqueueConf from '@/Agent/Inqueue/Conf'
import PhoneActions from '@/Agent/Inqueue/PhoneActions'
import TransferConference from '@/Agent/Widget/TransferConference'
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
        if (state.inqueue.record == 'inqueue_call') {
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
    'conf-request': InqueueConf,
    'phone-actions': PhoneActions,
    'transfer-conference': TransferConference,
  },
}
</script>
