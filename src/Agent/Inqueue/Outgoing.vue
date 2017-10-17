<template>
<div style="margin-top: 20px" v-if="visible">

  <div class="row"><div class="col"><h2>Outgoing info:</h2> </div></div>

  <div class="row">
    <div class="col">
      <dl class="row">
        <dt class="col-sm-3">To:</dt>
        <dd class="col-sm-9">{{ this.outgoing.target }}</dd>
      </dl>
    </div>
  </div><!-- row -->

  <div class="row" style="margin-top: 20px">
    <div class="col-1">
      <h4>Hold:</h4>
      <button v-if="this.$agent.is_hold()" @click="unhold" class="btn btn-outline-info">UnHold</button>
      <button v-if="this.$agent.is_oncall()" @click="hold" class="btn btn-outline-info">Hold</button>
    </div>
  </div>

</div><!-- container -->
</template>

<script>
export default {
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
