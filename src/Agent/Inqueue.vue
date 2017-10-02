<template>
<div v-if="inqueue.uuid">
  <btable :fields="fields" :data="data"></btable>
</div>
</template>

<script>
import Dialer from '../Agent/Dialer'
import Btable from '../Widget/Btable'
import Common from '../Admin/Common'
export default {
  mixins: [Common],
  data () {
    return {
      inqueue: {},
      call_info: {},
      updater: '',
      fields: {
        queue_id: { label: 'Queue' },
        state: { label: 'State' },
        time: { label: 'Time', formatter: (time) => this.msToHms(this.inqueue.time) },
        callDirection: { label: 'Direction'},
        callerCallerIDNumber : { label: 'Caller' },
        callerDestinationNumber : { label: 'Calling' }
      },
      data: []
    }
  },
  methods: {
    handleState ({ info, inqueue, call_info }) {
      if (info.state == 'ringing') {
        this.info = info
        this.inqueue = inqueue
        this.call_info = call_info
        this.data[0] = this.inqueue;
        this.data[0].callerCallerIDNumber = this.call_info['Caller-Caller-ID-Number'];
        this.data[0].callDirection = this.call_info['Call-Direction'];
        this.data[0].callerDestinationNumber = this.call_info['Caller-Destination-Number'];
      } else if (info.state == 'oncall') {
        this.info = info
      } else if (info.state == 'hold') {
        this.info = info
      } else {
        this.inqueue = {}
        this.call_info = {}
        this.data[0] = {}
      }
    },
    onTimer() {
      if (this.inqueue.time) {
        this.inqueue.time += 1000
      }
    },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    end_wrapup () { this.$agent.end_wrapup() },
  },
  created () {
    this.updater = setInterval(this.onTimer, 1000)
    this.$bus.$on('agent_state', this.handleState)
    this.$agent.p_call('request_state')
  },
  beforeDestroy () {
    this.$bus.$off('agent_state', this.handleState)
    clearInterval(this.updater)
  },
  components: {
    'dialer': Dialer,
    'btable': Btable
  },
}
</script>
