<template>
<div style="margin-top: 20px" v-if="visible">

  <div class="row"><div class="col"><h2>Outgoing call:</h2> </div></div>
  <b-row>
    <b-col cols=2>
      <b-button variant="outline-danger" size="sm">
        {{ this.outgoing.state }}:
        {{ Math.round(this.outgoing.time/1000) }}
      </b-button>
    </b-col>
    <b-col>
      <b-button variant="outline-dark" size="sm">
        {{ this.outgoing.agent.name }}
      </b-button>
      <icon name="long-arrow-right" class="align-middle" scale=1></icon>
      <b-button variant="outline-dark" size="sm">
        {{ this.outgoing.line_out.client.name }}
      </b-button>
      <icon name="long-arrow-right" class="align-middle" scale=1></icon>
      <b-button variant="outline-dark" size="sm">
        {{ this.outgoing.line_out.name }}
      </b-button>
      <icon name="long-arrow-right" class="align-middle" scale=1></icon>
      <b-button variant="outline-dark" size="sm">
        {{ this.outgoing.target }}
      </b-button>
    </b-col>
  </b-row>

  <b-row v-if="is_oncall()" style="margin-top: 20px">
    <b-col>
      <h4>Actions:</h4>
      <button v-if="is_hold()" @click="unhold" class="btn btn-outline-info">UnHold</button>
      <button v-else @click="hold" class="btn btn-outline-info">Hold</button>
      <button @click="hangup" class="btn btn-outline-primary">Hangup</button>
      <b-button v-if="can_record()" @click="record" :variant="record_variant()" :disabled="outgoing.keep_record">Record</b-button>
    </b-col>
  </b-row>

  <b-row v-if="is_ringing()" style="margin-top: 20px">
    <b-col>
      <h4>Actions:</h4>
      <button @click="hangup" class="btn btn-outline-primary">Hangup</button>
    </b-col>
  </b-row>


</div><!-- container -->
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      outgoing: {}
    }
  },
  methods: {
    is_oncall () {
      let state = this.outgoing.state
      return state == 'oncall' || state == 'hold'
    },
    is_hold () {
      return this.outgoing.state == 'hold'
    },
    is_ringing () {
      return this.outgoing.state == 'ringing'
    },
    can_record () {
      return this.outgoing && this.outgoing.line_out && this.outgoing.line_out.enable_call_recording === null
    },
    record_variant () {
      return this.outgoing.keep_record ? 'danger' : 'outline-danger'
    },
    query: async function () {
      this.outgoing = await this.$agent.p_mfa('ws_agent', 'get_outgoing', [])
      this.visible = true
      this.$agent.p_mfa('ws_agent', 'subscribe', ['outgoing', this.outgoing.id])
    },
    onTimer() {
      if (this.outgoing.time) {
        this.outgoing.time += 1000
      }
    },
    record: async function () {
      await this.$agent.p_mfa('ws_agent', 'record')
      this.outgoing.keep_record = true
    },
    handleState ({state}) {
      this.outgoing.state = state.state
    },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    hangup () { this.$agent.hangup() }
  },
  created () {
    this.query()
    this.$bus.$on('outgoing_state', this.handleState)
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    this.$bus.$off('outgoing_state', this.handleState)
    this.$agent.mfa('ws_agent', 'unsubscribe', ['outgoing', this.outgoing.id])
  },
}
</script>
