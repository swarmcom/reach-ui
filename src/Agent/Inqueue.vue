<template>
<div v-if="inqueue.uuid" style="margin-top: 20px">
  <h2>Call info</h2>
  <table style="margin-top: 20px" class="table table-sm">
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
        <td>{{ this.inqueue.queue }}, {{ this.inqueue.effective_time.weight }}</td>
        <td>{{ this.inqueue.state }}</td>
        <td>{{ Math.round(this.inqueue.time/1000) }}</td>
        <td>{{ this.call_info['Caller-Caller-ID-Number'] }}</td>
        <td>{{ this.call_info['Caller-Destination-Number'] }}</td>
      </tr>
    </tbody>
  </table>
  <div v-if="this.$agent.is_active()" class="row">
    <div class="col">
      <button v-if="this.$agent.is_hold()" @click="unhold" class="btn btn-outline-info">UnHold</button>
      <button v-if="this.$agent.is_oncall()" @click="hold" class="btn btn-outline-info">Hold</button>
      <transfer-agent></transfer-agent>
      <transfer-queue></transfer-queue>
      <transfer-uri></transfer-uri>
    </div>
  </div>
</div>
</template>

<script>
import TransferAgent from '../Agent/TransferAgent'
import TransferQueue from '../Agent/TransferQueue'
import Dialer from '../Agent/Dialer'
import TransferUri from '../Agent/TransferUri'

export default {
  data () {
    return {
      inqueue: {},
      call_info: {}
    }
  },
  methods: {
    handleState ({ info, inqueue, call_info }) {
      if (info.state == 'ringing') {
        this.info = info
        this.inqueue = inqueue
        this.call_info = call_info
        this.onTimer()
      } else if (info.state == 'oncall') {
        this.info = info
      } else if (info.state == 'hold') {
        this.info = info
      } else {
        this.inqueue = {}
        this.call_info = {}
      }
    },
    onTimer() {
      if (this.inqueue.time) {
        this.inqueue.time += 1000
        setTimeout( this.onTimer, 1000 )
      }
    },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    end_wrapup () { this.$agent.end_wrapup() },
    transfer_to_agent (Agent) { this.$agent.transfer_to_agent(Agent) },
    transfer_to_queue (Queue) { this.$agent.transfer_to_queue(Queue) },
    transfer_to_uri (Uri) { this.$agent.transfer_to_uri(Uri) },
  },
  created () {
    this.$bus.$on('agent_state', (S) => this.handleState(S))
  },
  components: { 'transfer-agent': TransferAgent, 'transfer-queue': TransferQueue, 'dialer': Dialer, 'transfer-uri': TransferUri },
}
</script>
