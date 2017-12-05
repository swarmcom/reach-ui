<template>
<div v-if="visible" style="margin-top: 20px">
  <h3>Ringer:</h3>
  <div class="row">
    <div class="col">
      Calling: {{ ringer.uri }} timeout: {{ ringer.timeout }} type: {{ ringer.type }}
    </div>
    <div class="col">
      <b-button size="sm" variant="outline-danger" @click="stop_ringer">Cancel</b-button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      ringer: {}
    }
  },
  methods: {
    query: async function () {
      this.ringer = await this.$agent.p_mfa('ws_agent', 'get_ringer', [])
      this.visible = true
    },
    handleState ({ state }) {
      if (state.state !== 'ringing') {
        this.visible = false
        this.ringer = {}
      }
    },
    stop_ringer () {
      this.$agent.p_mfa('ws_agent', 'stop_ringer', [])
    },
  },
  created () {
    this.query()
    this.$bus.$on('agent_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('agent_state', this.handleState)
  },
}
</script>
