<template>
<div>
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
      <button v-if="a.hangup_state == 'available'" @click="release" class="btn btn-outline-info">Release</button>
      <button v-if="a.hangup_state == 'release'" @click="available" class="btn btn-outline-success">Available</button>
    </div>
  </div>
  <div class="col">
    <div class="row justify-content-end">
      <button @click="logout" class="btn btn-outline-danger">Logout</button>
    </div>
  </div>
</div>
</div>
</template>

<script>
export default {
  data () {
    return {
      a: {}
    }
  },
  methods: {
    logout () { this.$agent.logout() },
    release () { this.$agent.release() },
    available () { this.$agent.available() },
    answer () { this.$agent.answer() },
    hangup () { this.$agent.hangup() }
  },
  created () {
    this.a = this.$agent.getData()
  }
}
</script>