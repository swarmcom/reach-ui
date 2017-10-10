<template>
<div class="container" style="margin-top: 20px" v-if="visible">

<div class="row"><div class="col"><h2>Call info:</h2> </div></div>

<div class="row">
  <div class="col">
    <dl class="row">
      <dt class="col-sm-3">From:</dt>
      <dd class="col-sm-9">
        "{{ this.call_info['Caller-Caller-ID-Name'] }}" &lt;{{ this.call_info['Caller-Caller-ID-Number'] }}&gt;
      </dd>
      <dt class="col-sm-3">To:</dt>
      <dd class="col-sm-9">{{ this.call_info['Caller-Destination-Number'] }}</dd>
      <dt class="col-sm-3">State:</dt>
      <dd class="col-sm-9">{{ this.inqueue.state }}</dd>
      <dt class="col-sm-3">Queue:</dt>
      <dd class="col-sm-9">{{ this.inqueue.queue.name }}</dd>
      <dt class="col-sm-3">Weight:</dt>
      <dd class="col-sm-9">{{ this.inqueue.effective_time.weight }}</dd>
      <dt class="col-sm-3">Time:</dt>
      <dd class="col-sm-9">{{ Math.round(this.inqueue.time/1000) }}</dd>
      <dt class="col-sm-3">Transferers:</dt>
      <dd class="col-sm-9">{{ this.inqueue.transferers.map( (agent) => agent.name ).join(", ") }}</dd>
    </dl>
  </div>

  <div class="col">
    <skills label="Skills" v-model="skills"></skills>
  </div>
</div><!-- row -->

<div class="row"><div class="col"><h2></h2> </div></div>

<div class="row" style="margin-top: 20px">

  <div class="col-1">
    <h4 v-if="this.$agent.is_oncall()">Hold:</h4>
    <button v-if="this.$agent.is_hold()" @click="unhold" class="btn btn-outline-info">UnHold</button>
    <button v-if="this.$agent.is_oncall()" @click="hold" class="btn btn-outline-info">Hold</button>
  </div>

  <div class="col" v-if="this.$agent.can_transfer()">
    <h4>Transfer to:</h4>
    <div class="form-inline">
      <transfer-agent></transfer-agent>&nbsp;
      <transfer-queue></transfer-queue>&nbsp;
      <transfer-uri v-if="this.$agent.can_call()" class="form-control"></transfer-uri>
    </div>
  </div>

  <div class="col" v-if="this.$agent.can_conference()">
    <h4>Conference with:</h4>
    <div class="form-inline">
      <conference-agent></conference-agent>&nbsp;
      <conference-queue></conference-queue>&nbsp;
      <conference-uri v-if="this.$agent.can_call()" class="form-control"></conference-uri>
    </div>
  </div>

</div>

</div><!-- container -->
</template>

<script>
import TransferAgent from '../Widget/TransferAgent'
import TransferQueue from '../Widget/TransferQueue'
import TransferUri from '../Widget/TransferUri'
import ConferenceAgent from '../Widget/ConferenceAgent'
import ConferenceQueue from '../Widget/ConferenceQueue'
import ConferenceUri from '../Widget/ConferenceUri'
import Skills from '../Widget/Skills'
import Common from '../../Admin/Common'

export default {
  components: {
    'transfer-agent': TransferAgent,
    'transfer-queue': TransferQueue,
    'transfer-uri': TransferUri,
    'conference-agent': ConferenceAgent,
    'conference-queue': ConferenceQueue,
    'conference-uri': ConferenceUri,
    'skills': Skills
  },
  props: {
    uuid: String
  },
  mixins: [Common],
  data () {
    return {
      visible: false,
      inqueue: {},
      call_info: {},
      skills: {},
      updater: undefined
    }
  },
  methods: {
    query: async function () {
      this.inqueue = await this.$agent.p_call('inqueue_state', ['inqueue_call', this.uuid])
      this.call_info = await this.$agent.p_call('call_info', [this.uuid])
      let skills = await this.$agent.p_call('skills', ['inqueue', this.uuid])
      this.skills = this.object2list(skills)
      this.visible = true
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
    this.query()
    this.updater = setInterval(this.onTimer, 1000)
  },
  beforeDestroy () {
    clearInterval(this.updater)
  },
}
</script>
