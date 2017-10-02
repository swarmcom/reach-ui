<template>
<div v-if="this.outgoing" style="margin-top: 10px">
  <div style="margin-left:15px;">
    <div class="row" v-if="this.state == 'agent_leg'">
      <h6>Calling: self</h6>
    </div>
    <div class="row" v-if="this.state == 'target_leg'">
      <h6>Calling: {{ target }}</h6>
    </div>
    <div class="row" v-if="this.state == 'oncall'">
      <h6>Call: {{ target }}</h6>
    </div>
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
import TransferUri from '../Agent/TransferUri'
import ConferenceAgent from '../Agent/ConferenceAgent'
import ConferenceQueue from '../Agent/ConferenceQueue'
import ConferenceUri from '../Agent/ConferenceUri'
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
    }
  },
  created () {
    this.$bus.$on('agent_state', (S) => this.handleState(S))
  },
  components : {
    'transfer-agent': TransferAgent,
    'transfer-queue': TransferQueue,
    'transfer-uri': TransferUri,
    'conference-agent': ConferenceAgent,
    'conference-queue': ConferenceQueue,
    'conference-uri': ConferenceUri
  }
}
</script>
