<template>
<div>
<div class="row">
  <div class="col">
    <h1>Agent UI</h1>
  </div>
</div>
<div class="row">
  <div class="col">
    <div class="alert alert-primary" role="alert">state: {{a.state}}, {{a.hangup_state}}</div>
  </div>
  <div class="col">
    <template v-if="a.state === 'ringing'">
      <button @click="hangup" class="btn">Hangup</button>
    </template>

    <template v-if="a.state === 'oncall'">
      <button @click="hangup" class="btn">Hangup</button>
    </template>

    <template v-if="a.hangup_state === 'available'">
      <button @click="release" class="btn">Release</button>
    </template>

    <template v-if="a.hangup_state === 'release'">
      <button @click="available" class="btn">Available</button>
    </template>
    
    <button @click="logout" class="btn">Logout</button>
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
    logout () { this.agent.logout() },
    release () { this.agent.release() },
    available () { this.agent.available() },
    answer () { this.agent.answer() },
    hangup () { this.agent.hangup() }
  },
  created () {
    this.agent = this.$parent.agent
    this.a = this.agent.getData()
  }
}
</script>