<template>
<div v-if="inqueue.uuid">
  <btable :fields="fields" :data="data"></btable>
  <!--<table class="table table-sm">
    <thead class="thead-default">
      <tr>
        <th>Queue</th>
        <th>State</th>
        <th>Time</th>
        <th>Caller</th>
        <th>Calling</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{ this.inqueue.queue_id }}, {{ this.inqueue.effective_time.weight }}</td>
        <td>{{ this.inqueue.state }}</td>
        <td>{{ Math.round(this.inqueue.time/1000) }}</td>
        <td>{{ this.call_info['Caller-Caller-ID-Number'] }}</td>
        <td>{{ this.call_info['Caller-Destination-Number'] }}</td>
      </tr>
    </tbody>
  </table>-->
  <div style="margin-left:15px;">
    <div class="row" style="margin-top:10px">
      <h6>Transfer to</h6><br>
    </div>
    <div class="row form-inline">
      <transfer-agent></transfer-agent>&nbsp;
      <transfer-queue></transfer-queue>&nbsp;
      <transfer-uri v-if="this.$agent.can_call()" class="form-control"></transfer-uri>
    </div>

    <div class="row" style="margin-top:10px">
      <h6>Conference with</h6><br>
    </div>
    <div class="row form-inline">
      <conference-agent></conference-agent>&nbsp;
      <conference-queue></conference-queue>&nbsp;
      <conference-uri v-if="this.$agent.can_call()" class="form-control"></conference-uri>
    </div>
  </div>
</div>
</template>

<script>
import TransferAgent from '../Agent/TransferAgent'
import TransferQueue from '../Agent/TransferQueue'
import Dialer from '../Agent/Dialer'
import TransferUri from '../Agent/TransferUri'
import ConferenceAgent from '../Agent/ConferenceAgent'
import ConferenceQueue from '../Agent/ConferenceQueue'
import ConferenceUri from '../Agent/ConferenceUri'
import Btable from '../Widget/Btable'

export default {
  data () {
    return {
      inqueue: {},
      call_info: {},
      updater: '',
      fields: {
        queue_id: { label: 'Queue' },
        state: { label: 'State' },
        computedTime: { label: 'Time' },
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
        this.data[0].computedTime = this.msToHms(this.inqueue.time)
      }
    },
    msToHms: function (duration) {
      let s = Math.floor((duration/1000)%60)
      let m = Math.floor((duration/(1000*60))%60)
      let h = Math.floor((duration/(1000*60*60))%24);

      let hDisplay = h > 0 ? (h <= 9 ? "0"+h : h) + ":" : ""
      let mDisplay = m > 0 ? (m <= 9 ? "0"+m : m) + ":" : ""
      let sDisplay = s > 0 ? (s <= 9 ? "0"+s : s) : "00"
      return hDisplay + mDisplay + sDisplay
    },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    end_wrapup () { this.$agent.end_wrapup() },
    transfer_to_agent (Agent) { this.$agent.transfer_to_agent(Agent) },
    transfer_to_queue (Queue) { this.$agent.transfer_to_queue(Queue) },
    transfer_to_uri (Uri) { this.$agent.transfer_to_uri(Uri) },
    conference_to_agent (Agent) { this.$agent.conference_to_agent(Agent) },
    conference_to_queue (Queue) { this.$agent.conference_to_queue(Queue) },
    conference_to_uri (Uri) { this.$agent.conference_to_uri(Uri) },
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
    'transfer-agent': TransferAgent,
    'transfer-queue': TransferQueue,
    'dialer': Dialer,
    'transfer-uri': TransferUri,
    'conference-agent': ConferenceAgent,
    'conference-queue': ConferenceQueue,
    'conference-uri': ConferenceUri,
    'btable': Btable
  },
}
</script>
