<template>
<div class="container">
  <div class="row">
    <div class="col">
      <button type="button" disabled class="btn btn-outline-primary">{{a.state}}</button>
      <button type="button" disabled class="btn btn-outline-secondary">{{a.hangup_state}}</button>
    </div>
    <div class="col">
      <agent-ciq></agent-ciq>
    </div>
    <div class="col">
      <div class="row justify-content-end">
        <button v-if="this.$agent.can_hangup()" @click="hangup" class="btn btn-outline-warning">Hangup</button>
        <button v-if="this.$agent.is_wrapup()" @click="wrapup" class="btn btn-outline-warning">Wrap up</button>
      </div>
    </div>
    <div class="col">
      <div class="row justify-content-end">
        <release v-if="a.hangup_state == 'available'">Release</release>
        <button v-if="a.hangup_state == 'release'" @click="available" class="btn btn-outline-success">Available</button>
      </div>
    </div>
    <div class="col">
      <div class="row justify-content-end">
        <button @click="logout" class="btn btn-outline-danger">Logout</button>
      </div>
    </div>
  </div>
  <b-row style="margin-top: 20px">
    <b-col cols="6">
      <agent-skills></agent-skills>
    </b-col>
    <b-col cols="6">
      <override v-if="this.$agent.is_idle()"></override>
      <dialer v-if="this.$agent.is_idle()"></dialer>
    </b-col>
  </b-row>
  <b-row style="margin-top: 20px">
    <b-col cols="4">
      <agent-count></agent-count>
    </b-col>
    <b-col cols="8">
      <agent-stats></agent-stats>
    </b-col>
  </b-row>
  <inqueue></inqueue>
</div>
</template>

<script>
import Inqueue from './Agent/Inqueue'
import Dialer from './Agent/Dialer'
import Override from './Agent/Override'
import Release from './Agent/Widget/Release'
import AgentSkills from './Agent/Skills'
import AgentCount from './Agent/Count'
import AgentStats from './Agent/Stats'
import AgentCIQ from './Agent/CIQ'

export default {
  data () {
    return {
      a: {},
      releases: []
    }
  },
  methods: {
    logout () { this.$agent.logout() },
    available () { this.$agent.available() },
    answer () { this.$agent.answer() },
    hangup () { this.$agent.hangup() },
    wrapup () { this.$agent.p_mfa('ws_agent', 'end_wrapup') },
  },
  created () {
    this.a = this.$agent.getData()
  },
  components: {
    inqueue: Inqueue,
    dialer: Dialer,
    release: Release,
    override: Override,
    'agent-skills': AgentSkills,
    'agent-count': AgentCount,
    'agent-stats': AgentStats,
    'agent-ciq': AgentCIQ
  },
}
</script>
