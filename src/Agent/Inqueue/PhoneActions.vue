<template>
<div class="float-right">
  <b-row>
    <div v-if="this.$agent.can_hangup()" class="state-time">{{msToHms( this.state_time )}}</div>
    <wrap-timer  v-if="this.wrap_visible" class="state-time"></wrap-timer>
    <button v-if="this.$agent.is_hold()" style="background:#FFEDA4" @click="unhold" class="btn call-action-button">
      <icon style="padding-top:5px" name="pause" scale="2"></icon>
    </button>
    <button v-if="this.$agent.is_oncall()" @click="hold" class="btn call-action-button">
      <icon style="padding-top:5px" name="pause" scale="2"></icon>
    </button>

    <button v-if="this.$agent.can_hangup()" @click="hangup" style="margin-left:2px" class="btn call-action-button">
      <icon style="padding-top:2px" name="close" scale="2"></icon></button>
    <button v-if="this.$agent.is_wrapup()" @click="wrapup" style="margin-left:2px" class="btn call-action-button">
      <icon style="padding-top:2px" name="close" scale="2"></icon></button>
    <button v-if="this.$agent.vm.state == 'barge'" @click="hangup" style="margin-left:2px" class="btn call-action-button">
      <icon style="padding-top:2px" name="close" scale="2"></icon></button>
  </b-row>
  <b-row style="margin-top:5px; width:200px;">
    <disposition v-if="this.uuid!=undefined && this.disp_visible" v-bind:uuid="this.uuid" style="width:100%"></disposition>
  </b-row>
  <br>
  <br>
  <b-row style="margin-top:5px;" class="float-right" v-if="can_record()">
    <b-button style="width:85px" size="sm" class="pointer" v-if="!isRecording()" @click="record" variant="outline-danger">Record</b-button>
    <b-button style="width:85px" size="sm" class="pointer" v-else variant="danger" :disabled="isRecording()">Recording</b-button>
  </b-row>
</div>
</template>

<script>
import Common from '@/Admin/Common'
import Wrap from '@/Agent/Widget/Wrap'
import DispositionSelect from '@/Agent/Widget/DispositionSelect'

export default {
  mixins: [Common],
  props: {
    uuid: String,
    showDispositions: {
      type: Boolean,
      default: true
    },
  },
  data () {
    return {
      updater: undefined,
      state_time: 0,
      state_date: 0,
      inqueue: null,
      outgoing: null,
      wrap_visible: false,
      disp_visible: this.showDispositions,
      wrap: undefined
    }
  },
  methods: {
    query: async function () {
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_call', this.uuid])
    },
    query_outgoing: async function () {
      this.outgoing = await this.$agent.p_mfa('ws_agent', 'get_outgoing', [])
      this.$agent.p_mfa('ws_agent', 'subscribe', ['outgoing', this.outgoing.id])
    },
    onTimer() {
      this.state_time = new Date() - this.state_date
    },
    record: async function () {
      await this.$agent.p_mfa('ws_agent', 'record')
      if(this.inqueue) {
        this.inqueue.keep_record = true
      }
      if(this.outgoing) {
        this.outgoing.keep_record = true
      }
    },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    answer () { this.$agent.answer() },
    hangup () { this.$agent.hangup() },
    wrapup () { this.$agent.p_mfa('ws_agent', 'end_wrapup') },
    getState (S) {
      if(S.tag == 'request') {
        this.state_time = S.state.time
        this.state_date = new Date() - S.state.time
      }
      else {
        this.state_time = 0
        this.state_date = new Date()
      }

      if (S.state.inqueue && S.state.inqueue.record === 'inqueue_vm') {
        this.disp_visible = false
      }

      if (S.state.inqueue && S.state.inqueue.record == 'inqueue_call') {
        this.query()
      }
      if (S.state.inqueue && S.state.inqueue.record == 'outgoing') {
        this.query_outgoing()
      }
      else {
        this.inqueue = null
        this.outgoing = null
      }
      if (S.state.state == 'wrapup') {
        this.wrapup_timer = S.state.queue.wrapup_timer
        this.wrap_visible = true
      }
      else {
        this.wrap_visible = false
        this.wrapup_timer = 0
      }
    },
    can_record () {
      return this.$agent.permAllowed('CROnDemand-feature') &&
        (this.inqueue && this.inqueue.line_in && this.inqueue.line_in.enable_call_recording === null ||
        this.outgoing && this.outgoing.line_out && this.outgoing.line_out.enable_call_recording === null) 
    },
    isRecording () {
      return ((this.inqueue && this.inqueue.keep_record) || (this.outgoing && this.outgoing.keep_record)) 
    }
  },
  watch: {
    showDispositions (v) {
      this.disp_visible = v
      return v
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
    if(this.outgoing) {
      this.$agent.mfa('ws_agent', 'unsubscribe', ['outgoing', this.outgoing.id])
    }
  },
  components: {
    'wrap-timer': Wrap,
    'disposition': DispositionSelect,
  },
}
</script>
