<template>
<div style="margin-top: 10px" v-if="visible">

<div class="row"><div class="col session-manager-text"><b>Incoming Call:</b> </div></div>

<div class="row">
  <div class="col-12">
    <dl class="row agent-state-text">
      <dt class="col-sm-3">Queue:</dt>
      <dd class="col-sm-9">{{ this.inqueue.queue.name }}</dd>
      <dt class="col-sm-3">Wait time:</dt>
      <dd class="col-sm-9">{{ msToHms(this.inqueue.time) }}</dd>
      <dt class="col-sm-3">From:</dt>
      <dd class="col-sm-9">
        "{{ this.call_info['Caller-Caller-ID-Name'] }}" &lt;{{ this.call_info['Caller-Caller-ID-Number'] }}&gt;
      </dd>
      <dt class="col-sm-3">To:</dt>
      <dd class="col-sm-9">{{ this.call_info['Caller-Destination-Number'] }}</dd>
      <dt class="col-sm-3">Client:</dt>
      <dd class="col-sm-9">{{ this.inqueue.line_in.client.name }}</dd>
      <!--<dt class="col-sm-3">State:</dt>
      <dd class="col-sm-9">{{ this.inqueue.state }}</dd>
      <dt class="col-sm-3">Weight:</dt>
      <dd class="col-sm-9">{{ this.inqueue.effective_time.weight }}</dd>-->
      <dt class="col-sm-3">Transferers:</dt>
      <dd class="col-sm-9">{{ this.inqueue.transferers.map( (agent) => agent.name ).join(", ") }}</dd>
    </dl>
  </div>
</div>
<div class="row agent-state-text">
  <div class="col-2">
    <disposition v-bind:uuid="this.uuid"></disposition>
  </div>
  <div class="col-2">
    <b-button size="sm" v-if="this.$agent.is_oncall()" @click="record" variant="outline-danger" :disabled="inqueue.keep_record">Record</b-button>
  </div>
</div>
<div class="col-12">
  <transfer-conference></transfer-conference>
</div>

<div class="row" style="margin-top: 10px">
  <div class="col-12">
    <div class="row"><div class="col session-manager-text"><b>Skills Editor:</b> </div></div>
    <skills label="Skills" v-on:input="update_skills()" v-model="skills"></skills>
  </div>
</div>
</div><!-- container -->
</template>

<script>
import Skills from '../Widget/Skills'
import Common from '../../Admin/Common'
import Disposition from '../Widget/Disposition'
import TransferConference from '../Widget/TransferConference'
export default {
  components: {
    'transfer-conference': TransferConference,
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
    record: async function () {
      await this.$agent.p_mfa('ws_agent', 'record')
      this.inqueue.keep_record = true
    }
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
