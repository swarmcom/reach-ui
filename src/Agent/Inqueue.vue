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
        <td>{{ this.inqueue.queue_id }}, {{ this.inqueue.effective_time.weight }}</td>
        <td>{{ this.inqueue.state }}</td>
        <td>{{ Math.round(this.inqueue.time/1000) }}</td>
        <td>{{ this.call_info['Caller-Caller-ID-Number'] }}</td>
        <td>{{ this.call_info['Caller-Destination-Number'] }}</td>
      </tr>
    </tbody>
  </table>
  <div>
    <div class="row">
      <div class="col">
        <button v-if="this.$agent.is_hold()" @click="unhold" class="btn btn-outline-info">UnHold</button>
        <button v-if="this.$agent.is_oncall()" @click="hold" class="btn btn-outline-info">Hold</button>
      </div>
    </div>
    <div v-if="this.$agent.is_oncall()" class="row" style="margin-top:20px">
      <div class="col">
        <h4>Transfer to</h4>
        <div class="form-inline">
          <transfer-agent></transfer-agent>&nbsp;
          <transfer-queue></transfer-queue>&nbsp;
          <transfer-uri v-if="this.$agent.can_call()" class="form-control"></transfer-uri>
        </div>
      </div>
      <div class="col">
        <h4>Conference with</h4>
        <div class="form-inline">
          <conference-agent></conference-agent>&nbsp;
          <conference-queue></conference-queue>&nbsp;
          <conference-uri v-if="this.$agent.can_call()" class="form-control"></conference-uri>
        </div>
      </div>
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

export default {
  data () {
    return {
      inqueue: {},
      call_info: {},
      updater: ''
    }
  },
  methods: {
    handleState ({ info, inqueue, call_info }) {
      if (info.state == 'ringing') {
        this.info = info
        this.inqueue = inqueue
        this.call_info = call_info
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
      }
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
    'conference-uri': ConferenceUri
  },
}
</script>
