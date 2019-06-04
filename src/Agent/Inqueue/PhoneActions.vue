<template>
  <div class="float-right">
    <b-row>
      <div
        v-if="this.$agent.can_hangup()"
        class="state-time"
      >
        {{ msToHms( state_time ) }}
      </div>
      <wrap-timer
        v-if="wrap_visible"
        class="state-time"
      />
      <button
        v-if="this.$agent.is_hold()"
        style="background:#FFEDA4"
        class="btn call-action-button"
        @click="unhold"
      >
        <icon
          style="padding-top:5px"
          name="pause"
          scale="2"
        />
      </button>
      <button
        v-if="this.$agent.is_oncall()"
        class="btn call-action-button"
        @click="hold"
      >
        <icon
          style="padding-top:5px"
          name="pause"
          scale="2"
        />
      </button>

      <button
        v-if="this.$agent.can_hangup()"
        style="margin-left:2px"
        class="btn call-action-button"
        @click="hangup"
      >
        <icon
          style="padding-top:2px"
          name="close"
          scale="2"
        />
      </button>
      <button
        v-if="this.$agent.is_wrapup()"
        style="margin-left:2px"
        class="btn call-action-button"
        @click="wrapup"
      >
        <icon
          style="padding-top:2px"
          name="close"
          scale="2"
        />
      </button>
      <button
        v-if="this.$agent.vm.state == 'barge'"
        style="margin-left:2px"
        class="btn call-action-button"
        @click="hangup"
      >
        <icon
          style="padding-top:2px"
          name="close"
          scale="2"
        />
      </button>
    </b-row>
    <b-row style="margin-top:5px; width:200px;">
      <disposition
        v-if="uuid!='' && disp_visible"
        :uuid="uuid"
        style="width:100%"
      />
    </b-row>
    <br>
    <br>
    <b-row
      v-if="can_record()"
      style="margin-top:5px;"
      class="float-right"
    >
      <b-button
        v-if="!isRecording()"
        style="width:85px"
        size="sm"
        class="pointer"
        variant="outline-danger"
        @click="record"
      >
        Record
      </b-button>
      <b-button
        v-else
        style="width:85px"
        size="sm"
        class="pointer"
        variant="danger"
        :disabled="isRecording()"
      >
        Recording
      </b-button>
      <b-btn
        variant="outline-info"
        title="Park a Call"
        size="sm"
        style="margin-left:2px"
      >
        <icon
          name="phone"
          scale="2"
        />
        <icon name="parking" />
      </b-btn>
    </b-row>
  </div>
</template>

<script>
import Common from '@/Admin/Common'
import Wrap from '@/Agent/Widget/Wrap'
import DispositionSelect from '@/Agent/Widget/DispositionSelect'

export default {
  components: {
    'wrap-timer': Wrap,
    'disposition': DispositionSelect,
  },
  mixins: [Common],
  props: {
    uuid: { 
      type: String,
      default: ''
    },
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
  watch: {
    showDispositions (v) {
      this.disp_visible = v
      return v
    }
  },
  created () {
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

      if (S.state.state == "available" || S.state.state == "release" || S.state.state == "suspended") {
        this.inqueue = null
        this.outgoing = null
        this.wrap_visible = false
        this.wrapup_timer = 0
      } else {
        if (S.state.inqueue && S.state.inqueue.record === 'inqueue_vm') {
          this.disp_visible = false
        }
        else if (S.state.inqueue && S.state.inqueue.record == 'inqueue_call') {
          this.query()
        }
        else if (S.state.inqueue && S.state.inqueue.record == 'outgoing_call') {
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
      }
    },
    can_record () {
      return this.$agent.permAllowed('agent-feature-call-recording-on-demand') &&
        (this.inqueue && this.inqueue.line_in && this.inqueue.line_in.enable_call_recording === null && !this.wrap_visible ||
        this.outgoing && this.outgoing.line_out && this.outgoing.line_out.enable_call_recording === null && !this.wrap_visible)
    },
    isRecording () {
      return ((this.inqueue && this.inqueue.keep_record) || (this.outgoing && this.outgoing.keep_record)) 
    }
  },
}
</script>
