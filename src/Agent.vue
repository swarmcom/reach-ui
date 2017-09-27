<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseSessionManager" class="mt-2">
    <div class="row">
      <div class="col">
        <button type="button" disabled class="btn btn-outline-primary">{{a.state}}</button>
        <button type="button" disabled class="btn btn-outline-secondary">{{a.hangup_state}}</button>
      </div>
      <div class="col">
        <div class="row justify-content-end">
          <button v-if="a.state == 'ringing'" @click="hangup" class="btn btn-outline-warning">Hangup</button>
          <button v-if="a.state == 'oncall'" @click="hangup" class="btn btn-outline-warning">Hangup</button>
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
    <inqueue></inqueue>
    <outgoing></outgoing>
    <b-row style="margin-top: 20px">
      <b-col cols="6">
        <dialer v-if="this.$agent.is_idle()"></dialer>
      </b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import ToggleBar from './Widget/ToggleBar'
import Inqueue from './Agent/Inqueue'
import Dialer from './Agent/Dialer'
import Release from './Agent/Release'
import Outgoing from './Agent/Outgoing'

export default {
  widgetName: 'SESSION MANAGER',
  data () {
    return {
      a: {},
      releases: [],
      showCollapse: true
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
    outgoing: Outgoing,
    toggleBar: ToggleBar
  },
}
</script>