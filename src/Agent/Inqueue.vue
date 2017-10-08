<template>
<div>
  <call v-if="call_visible" :uuid="uuid"></call>
  <div v-if="ringer_visible" class="container" style="margin-top: 10px">
    <h3>Ringer:</h3>
    <div class="row">
      <div class="col">
        Calling: {{ ringer.uri }} attempt: {{ ringer.attempt }}/{{ ringer.attempts }}, timeout: {{ ringer.timeout }}
      </div>
      <div class="col">
        <b-button size="sm" variant="outline-danger" @click="stop_ringer(ringer.agent_id)">Cancel</b-button>
      </div>
    </div>
  </div>
  <conference v-if="conf_visible"></conference>
</div>
</template>

<script>
import Call from './Inqueue/Call'
import Conference from './Inqueue/Conference'
import Outgoing from './Inqueue/Outgoing'

export default {
  data () {
    return {
      call_visible: false,
      conf_visible: false,
      ringer_visible: false,
      ringer: {},
      uuid: undefined
    }
  },
  methods: {
    handleState ({ state }) {
      console.log('inqueue state', state)
      if (state.state == "available" || state.state == "release") {
        this.call_visible = false
        this.conf_visible = false
        this.ringer_visible = false
        this.uuid = undefined
      } else {
        if (state.inqueue.inqueue_call) {
          this.call_visible = true
          this.uuid = state.inqueue.inqueue_call
        }
        if (state.state == 'conference') {
          this.conf_visible = true
        }
        if (state.state == 'inconference') {
          this.conf_visible = true
        }
      }
    },
    handleRinger ({ringer, state, agent_id}) {
      if (ringer == "originate") {
        this.ringer_visible = true
        this.ringer = state
        this.ringer.agent_id = agent_id
      } else {
        this.ringer_visible = false
        this.ringer = {}
      }
    },
    stop_ringer (Id) {
      this.$agent.p_call('stop_ringer', [Id])
    }
  },
  created () {
    this.$agent.p_call('request_state', [])
    this.$bus.$on('agent_state', this.handleState)
    this.$bus.$on('agent_conference_ringer', this.handleRinger)
  },
  beforeDestroy () {
    this.$bus.$off('agent_state', this.handleState)
    this.$bus.$off('agent_conference_ringer', this.handleRinger)
  },
  components: {
    call: Call,
    conference: Conference,
    outgoing: Outgoing
  },
}
</script>
