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
        <dd class="col-sm-4">To:</dt>
        <dd class="col-sm-8">{{ this.outgoing.target }}</dd>
        <dd v-if="!this.$agent.is_ringing()" class="col-sm-4">Wait Time:</dt>
        <dd v-if="!this.$agent.is_ringing()" class="col-sm-8">{{ msToHms(this.$agent.vm.wait_time) }}</dd>
      </dl>
    </b-col>
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
    },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() }
  },
  created () {
    this.query()
  },
  beforeDestroy () {
  },
}
</script>
