<template>
<div v-if="this.outgoing" style="margin-top: 20px">
  <div v-if="this.state == 'agent_leg'">
    <h2>Calling: self</h2>
  </div>
  <div v-if="this.state == 'target_leg'">
    <h2>Calling: {{ target }}</h2>
  </div>
  <div v-if="this.state == 'oncall'">
    <h2>Call: {{ target }}</h2>
  </div>
  <div class="row">
    <div class="col">
      <button v-if="this.$agent.is_hold()" @click="unhold" class="btn btn-outline-info">UnHold</button>
      <button v-if="this.$agent.is_oncall()" @click="hold" class="btn btn-outline-info">Hold</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      outgoing: false,
      target: '',
      state: ''
    }
  },
  methods: {
    handleState ({ info, inqueue, call_info }) {
      if (info.state == 'ringing' && info.inqueue.outgoing) {
        this.target = info.inqueue.outgoing
        this.state = 'agent_leg'
        this.outgoing = true
      } else if (info.state == 'outgoing') {
        this.state = 'target_leg'
      } else if (info.state == 'oncall') {
        this.state = 'oncall'
      } else if (info.state == 'hold') {
      } else {
        this.state = ''
        this.target = ''
        this.outgoing = false
      }
    },
    onTimer () {
    },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() }
  },
  created () {
    this.$bus.$on('agent_state', (S) => this.handleState(S))
  },
  mounted () {
    this.onTimer()
  }
}
</script>
