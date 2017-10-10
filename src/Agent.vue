<template>
<div class="container">
  <div class="row">
    <div class="col">
      <button type="button" disabled class="btn btn-outline-primary">{{a.state}}</button>
      <button type="button" disabled class="btn btn-outline-secondary">{{a.hangup_state}}</button>
    </div>
    <div class="col">
      <div class="row justify-content-end">
        <button v-if="this.$agent.can_hangup()" @click="hangup" class="btn btn-outline-warning">Hangup</button>
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
  <agent-info></agent-info>
  <inqueue></inqueue>
  <b-row style="margin-top: 20px">
    <b-col cols="6">
      <override></override>
    </b-col>
    <b-col cols="6">
      <dialer v-if="this.$agent.is_idle()"></dialer>
    </b-col>
  </b-row>
</div>
</template>

<script>
import Inqueue from './Agent/Inqueue'
import Dialer from './Agent/Dialer'
import Override from './Agent/Override'
import Release from './Agent/Widget/Release'
import AgentInfo from './Agent/Info'

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
  },
  created () {
    this.a = this.$agent.getData()
  },
  components: {
    inqueue: Inqueue,
    dialer: Dialer,
    release: Release,
    'agent-info': AgentInfo,
    override: Override
  },
}
</script>
