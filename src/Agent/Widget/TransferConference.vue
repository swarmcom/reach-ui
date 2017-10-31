<template>
<div v-if="this.$agent.can_transfer()">
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseTransferConference" class="mt-2">
    <div class="row">
      <div class="col-12">
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
    </div>
    <div class="row">
      <div class="col-12" v-if="this.$agent.can_conference()">
          <h6>Conference with:</h6>
          <div class="form-inline">
            <conference-agent></conference-agent>&nbsp;
            <conference-queue></conference-queue>&nbsp;
            <conference-uri v-if="this.$agent.can_call()" class="form-control"></conference-uri>
          </div>
        </div>
    </div>
  </b-collapse>
</div>
</template>

<script>
import ToggleBar from '../..//Widget/ToggleBar'
import Common from '../../Admin/Common'
import TransferAgent from './TransferAgent'
import TransferQueue from './TransferQueue'
import TransferUri from './TransferUri'
import ConferenceAgent from './ConferenceAgent'
import ConferenceQueue from './ConferenceQueue'
import ConferenceUri from './ConferenceUri'
export default {
  widgetName: 'Transfer / Conference',
  storageName: 'smtransferConference',
  mixins: [Common],
  data () {
    return {
      showCollapse: true
    }
  },
  methods: {
    transfer_to_agent (Agent) { this.$agent.transfer_to_agent(Agent) },
    transfer_to_queue (Queue) { this.$agent.transfer_to_queue(Queue) },
    transfer_to_uri (Uri) { this.$agent.transfer_to_uri(Uri) },
    conference_to_agent (Agent) { this.$agent.conference_to_agent(Agent) },
    conference_to_queue (Queue) { this.$agent.conference_to_queue(Queue) },
    conference_to_uri (Uri) { this.$agent.conference_to_uri(Uri) },
  },
  created () {
    this.a = this.$agent.getData()
    /*this.updater = setInterval(this.onTimer, 1000)*/
    if (this.a.storage_data.smtransferConferenceCollapsed != undefined)
      this.showCollapse = this.a.storage_data.smtransferConferenceCollapsed
  },
  /*beforeDestroy () {
    clearInterval(this.updater)
  },*/
  components: {
    toggleBar: ToggleBar,
    'transfer-agent': TransferAgent,
    'transfer-queue': TransferQueue,
    'transfer-uri': TransferUri,
    'conference-agent': ConferenceAgent,
    'conference-queue': ConferenceQueue,
    'conference-uri': ConferenceUri,
  },
}
</script>
