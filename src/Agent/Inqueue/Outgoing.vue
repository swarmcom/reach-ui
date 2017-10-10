<template>
<div style="margin-top: 20px">
  <div v-if="this.state == 'target_leg'">
    <h6>Calling: {{ target }}</h6>
  </div>
  <div v-if="this.state == 'oncall'">
    <h6>Call: {{ target }}</h6>
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
