<template>
<div style="margin-top: 20px">
  <div v-if="this.state == 'target_leg'">
    <h2>Calling: {{ target }}</h2>
  </div>
  <div v-if="this.state == 'oncall'">
    <h2>Call: {{ target }}</h2>
  </div>
  <div class="row">
    <div class="col">
      <button v-if="this.$agent.is_hold()" @click="unhold" class="btn btn-outline-info">UnHold</button>
      <button v-if="this.$agent.is_oncall()" @click="hold" class="btn btn-outline-info">Hold</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() }
  },
}
</script>
