<template>
<div>
  <b-row>
    <div v-if="this.$agent.can_hangup()" class="state-time">{{msToHms( this.state_time )}}</div>
    <wrap-timer  v-if="this.wrap_visible" v-bind:inqueue="this.wrap" :state_time="state_time" class="state-time"></wrap-timer>
    <button v-if="this.$agent.is_hold()" @click="unhold" class="btn call-action-button">
      <icon name="pause" scale="2"></icon>
    </button>
    <button v-if="this.$agent.is_oncall()" @click="hold" class="btn call-action-button">
      <icon name="pause" scale="2"></icon>
    </button>

    <button v-if="this.$agent.can_hangup()" @click="hangup" style="margin-left:2px" class="btn call-action-button">
      <icon name="close" scale="2"></icon></button>
    <button v-if="this.$agent.is_wrapup()" @click="wrapup" style="margin-left:2px" class="btn call-action-button">
      <icon name="close" scale="2"></icon></button>
  </b-row>
  <b-row style="margin-top:5px;" >
    <disposition v-if="this.uuid!=undefined" v-bind:uuid="this.uuid" :active="disposition_id" v-on:input="update_disposition"></disposition>
  </b-row>
  <b-row style="margin-top:5px;" >
    <b-button size="sm" class="pointer" v-if="this.$agent.is_oncall() && this.inqueue!=undefined" @click="record" variant="outline-danger" :disabled="!this.inqueue.keep_record">Record</b-button>
  </b-row>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import Wrap from '@/Agent/Widget/Wrap'
import Disposition from '@/Agent/Widget/Disposition'

export default {
  mixins: [Common],
  props: {
    uuid: String
  },
  data () {
    return {
      updater: undefined,
      state_time: 0,
      inqueue: undefined,
      wrap_visible: false,
      wrap: undefined,
      disposition_id: undefined
    }
  },
  methods: {
    query: async function () {
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_call', this.uuid])
    },
    queryWrap: async function () {
      this.wrap = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_call', this.uuid])
    },
    onTimer() {
      this.state_time += 1000
    },
    update_disposition (id) {
      this.disposition_id = id
    },
    record: async function () {
      await this.$agent.p_mfa('ws_agent', 'record')
      this.inqueue.keep_record = false
    },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    answer () { this.$agent.answer() },
    hangup () { this.$agent.hangup() },
    wrapup () { this.$agent.p_mfa('ws_agent', 'end_wrapup') },
    getState (S) {
      if(S.tag == 'request')
        this.state_time = S.state.time
      else
        this.state_time = 0
      if (S.state.inqueue.record == 'inqueue_call')
        this.query()

      if (S.state.state == 'oncall')
        this.queryWrap()

      if (S.state.state == 'wrapup')
        this.wrap_visible = true
      if (S.state.state != 'wrapup')
        this.wrap_visible = false
    }
  },
  created () {
    this.$agent.p_mfa('ws_agent', 'request_state', [])
    this.$bus.$on('agent_state', this.getState)
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    clearInterval(this.updater)
    this.$bus.$off('agent_state', this.getState)
  },
  components: {
    'wrap-timer': Wrap,
    'disposition': Disposition,
  },
}
</script>
