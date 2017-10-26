<template>
<div style="margin-top: 20px" v-if="visible">

<div class="row"><div class="col"><h5>Call info:</h5> </div></div>

<div class="row">
  <div class="col-10">
    <dl class="row session-manager-info">
      <dt class="col-sm-3">From:</dt>
      <dd class="col-sm-9">
        "{{ this.call_info['Caller-Caller-ID-Name'] }}" &lt;{{ this.call_info['Caller-Caller-ID-Number'] }}&gt;
      </dd>
      <dt class="col-sm-3">To:</dt>
      <dd class="col-sm-9">{{ this.call_info['Caller-Destination-Number'] }}</dd>
      <dt class="col-sm-3">Client:</dt>
      <dd class="col-sm-9">{{ this.inqueue.line_in.client.name }}</dd>
      <dt class="col-sm-3">State:</dt>
      <dd class="col-sm-9">{{ this.inqueue.state }}</dd>
      <dt class="col-sm-3">Queue:</dt>
      <dd class="col-sm-9">{{ this.inqueue.queue.name }}</dd>
      <dt class="col-sm-3">Weight:</dt>
      <dd class="col-sm-9">{{ this.inqueue.effective_time.weight }}</dd>
      <dt class="col-sm-3">Time:</dt>
      <dd class="col-sm-9">{{ msToHms(this.inqueue.time) }}</dd>
      <dt class="col-sm-3">Transferers:</dt>
      <dd class="col-sm-9">{{ this.inqueue.transferers.map( (agent) => agent.name ).join(", ") }}</dd>
    </dl>
  </div>
  <div class="col-2">
    <b-button v-if="this.$agent.is_oncall()" @click="record" variant="outline-danger" :disabled="inqueue.keep_record">Record</b-button>
  </div>
</div>
<div class="row">
  <div class="col-12">
    <div class="row" style="margin-top:10px">
      <div class="col-6">
        <div v-if="this.$agent.can_transfer()" class="row">
          <div class="col">
            <h6>Transfer to:</h6>
            <div class="form-inline">
              <transfer-agent></transfer-agent>&nbsp;
              <transfer-queue></transfer-queue>&nbsp;
              <transfer-uri v-if="this.$agent.can_call()" class="form-control"></transfer-uri>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6" v-if="this.$agent.can_conference()">
        <h6>Conference with:</h6>
        <div class="form-inline">
          <conference-agent></conference-agent>&nbsp;
          <conference-queue></conference-queue>&nbsp;
          <conference-uri v-if="this.$agent.can_call()" class="form-control"></conference-uri>
        </div>
      </div>
    </div>
  </div>
</div>
<!--<div class="row">
  <div class="col-12">
    <h4>Skills editor:</h4>
    <skills label="Skills" v-on:input="update_skills()" v-model="skills"></skills>
  </div>
</div>-->
<div class="row" style="margin-top:10px;">
  <div class="col-12">
    <h6>Disposition:</h6>
      <disposition v-bind:uuid="this.uuid"></disposition>
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
import Disposition from '../Widget/Disposition'

export default {
  components: {
    'transfer-agent': TransferAgent,
    'transfer-queue': TransferQueue,
    'transfer-uri': TransferUri,
    'conference-agent': ConferenceAgent,
    'conference-queue': ConferenceQueue,
    'conference-uri': ConferenceUri,
    'skills': Skills,
    'disposition': Disposition
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
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_call', this.uuid])
      this.call_info = await this.$agent.p_mfa('ws_agent', 'call_info', [this.uuid])
      let skills = await this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid])
      this.skills = this.object2list(skills)
      this.visible = true
    },
    onTimer() {
      if (this.inqueue.time) {
        this.inqueue.time += 1000
      }
    },
    update_skills () {
      this.$agent.p_mfa('ws_agent', 'skills', ['inqueue', this.uuid, this.list2object(this.skills)])
    },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    record: async function () {
      await this.$agent.p_mfa('ws_agent', 'record')
      this.inqueue.keep_record = true
    },
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
