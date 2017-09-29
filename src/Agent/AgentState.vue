<template>
<div>
  <div class="row">
    <div class="col-5">
      <button v-if="a.hangup_state == 'available'" @click="release" class="btn btn-outline-secondary">
        <icon name="stop" scale="5"></icon>
      </button>
      <button v-if="a.hangup_state == 'release'" @click="available" class="btn btn-outline-success"">
          <icon name="play" scale="5"></icon>
      </button>
    </div>
    <div class="col-7">
      <div v-if="a.state == 'available'" style="background:orange; padding-top:5px; padding-left:15px;">
        <icon  name="circle-o" scale="5"></icon>
        <div>Available</div>
      </div>
      <div v-if="a.state == 'release'" style="background:silver; padding-top:5px; padding-left:15px;">
        <icon name="stop" scale="5"></icon>
        <div>Released</div>
      </div>
      <div v-if="a.state == 'ringing'" style="background:#28a745; padding-top:5px; padding-left:10px;">
        <icon  name="wifi" scale="5"></icon>
        <div>Ringing</div>
      </div>
      <div v-if="a.state == 'oncall'" style="background:#28a745; padding-top:5px; padding-left:15px;">
        <icon  name="phone" scale="5"></icon>
        <div>On call</div>
      </div>
    </div>
  </div>
  <div class="row col">
    <release v-if="a.hangup_state == 'available'"></release>
  </div>
  <div class="row"></div>
    <div class="row">
      <div class="col-5 agent-state-text">State:</div>
      <div class="col-7 agent-state-text"> {{a.state}} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Hang_up State:</div>
      <div class="col-7 agent-state-text"> {{a.hangup_state}} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Since:</div>
      <div class="col-7 agent-state-text"> {{date}} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Activity Time:</div>
      <div class="col-7 agent-state-text"> {{activity_time | secondsToHms }} </div>
    </div>
  </div>
</template>
<script>
import Release from '../Agent/Release'
import moment from 'moment'
export default {
  name: 'agent-state',
  data () {
    return {
      a: {},
      releases: [],
      updater: null,
      activity_time: 0
    }
  },
  methods: {
    available () { this.$agent.available() },
    release () { this.$agent.release() },
  },
  beforeDestroy () {
    clearInterval(this.updater)
  },
  created () {
    this.a = this.$agent.getData()
    this.date = moment(new Date()).format('Do MMM YYYY[,] HH:mm:ss')
    this.updater = setInterval(() => { this.$agent.vm.state != 'release' ? this.activity_time++ : this.activity_time=0 } , 1000)
  },
  filters: {
    secondsToHms: function (d) {
      d = Number(d)
      let h = Math.floor(d / 3600)
      let m = Math.floor(d % 3600 / 60)
      let s = Math.floor(d % 3600 % 60)

      let hDisplay = h > 0 ? (h <= 9 ? "0"+h : h) + ":" : "00:"
      let mDisplay = m > 0 ? (m <= 9 ? "0"+m : m) + ":" : "00:"
      let sDisplay = s > 0 ? (s <= 9 ? "0"+s : s) : "00"
      return hDisplay + mDisplay + sDisplay
    }
  },
  components: {
    release: Release
  }
}
</script>
