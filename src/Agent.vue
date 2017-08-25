<template>
<div>
<div class="row">
  <div class="col">
    <h1>Agent UI</h1>
  </div>
</div>
<div class="row">
  <div class="col">
    <div class="alert alert-primary" role="alert">state: {{state}}, {{hangup_state}}</div>
  </div>
  <div class="col">
    <template v-if="state === 'ringing'">
      <button @click="hangup" class="btn">Hangup</button>
    </template>

    <template v-if="state === 'oncall'">
      <button @click="hangup" class="btn">Hangup</button>
    </template>

    <template v-if="hangup_state === 'available'">
      <button @click="release" class="btn">Release</button>
    </template>

    <template v-if="hangup_state === 'release'">
      <button @click="available" class="btn">Available</button>
    </template>
    
    <button @click="logout" class="btn">Logout</button>
  </div>
</div>
</div>
</template>

<script>
import { EventBus } from './event_bus.js';

export default {
  data() {
    return {
      hangup_state: undefined,
      state: undefined
    }
  },
  methods: {
    logout() { this.agent.logout() },
    release() { this.agent.release() },
    available() { this.agent.available() },
    answer() { this.agent.answer() },
    hangup() { this.agent.hangup() },
    handleState(S) {
      this.hangup_state = S.hangup_state
      this.state = S.state
    }
  },
  created() {
    this.agent = this.$parent.agent
    this.hangup_state = this.agent.hangup_state
    this.state = this.agent.state
    EventBus.$on("agent_state", (S) => this.handleState(S.info))
  }
}
</script>