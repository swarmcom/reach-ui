<template>
<div style="margin-top: 10px" v-if="visible">
  <b-row>
    <b-col cols="2">
      <div class="call-phone-center"><icon style="color:#838383" name="mobile" scale="4"></icon></div>
      <div class="call-hand-center"><icon style="color:#838383" name="handshake-o" scale="4"></icon></div>
    </b-col>
    <b-col cols="10">
      <dl class="row agent-state-text">
        <dt class="col-sm-12 session-manager-text">Outbound Call:</dt>
        <dd class="col-sm-4">To:</dd>
        <dd class="col-sm-8">{{ this.outgoing.target }}</dd>
        <dd v-if="!this.$agent.is_ringing()" class="col-sm-4">Wait Time:</dd>
        <dd v-if="!this.$agent.is_ringing()" class="col-sm-8">{{ msToHms(this.$agent.vm.wait_time) }}</dd>
        <dd class="col-sm-4">Client:</dd>
        <dd class="col-sm-8">{{ this.outgoing.line_out.client.name }}</dd>
        <dd class="col-sm-4">Line:</dd>
        <dd class="col-sm-8">{{ this.outgoing.line_out.name }}</dd>
      </dl>
    </b-col>
  </b-row>
  <b-row style="margin-top:5px;" class="float-right"  v-access:CROnDemand-feature v-if="can_record()">
    <b-button style="width:85px" size="sm" class="pointer" v-if="!outgoing.keep_record" @click="record" variant="outline-danger">Record</b-button>
    <b-button style="width:85px" size="sm" class="pointer" v-else variant="danger" :disabled="outgoing.keep_record">Recording</b-button>
  </b-row>
</div><!-- container -->
</template>
<script>
import Common from '@/Admin/Common'
export default {
  mixins: [Common],
  data () {
    return {
      visible: false,
      outgoing: {}
    }
  },
  methods: {
    query: async function () {
      this.outgoing = await this.$agent.p_mfa('ws_agent', 'get_outgoing', [])
      this.visible = true
      this.$agent.p_mfa('ws_agent', 'subscribe', ['outgoing', this.outgoing.id])
    },
    record: async function () {
      await this.$agent.p_mfa('ws_agent', 'record')
      this.outgoing.keep_record = true
    },
    can_record () {
      return this.outgoing && this.outgoing.line_out && this.outgoing.line_out.enable_call_recording === null
    }

  },
  created () {
    this.query()
  },
  beforeDestroy () {
    this.$agent.mfa('ws_agent', 'unsubscribe', ['outgoing', this.outgoing.id])
  },
}
</script>
