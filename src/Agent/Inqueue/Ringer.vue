<template>
  <div
    v-if="visible"
    style="margin-top: 10px"
  >
    <div class="session-manager-text">
      <b>Ringer:</b>
    </div>
    <div class="row agent-state-text">
      <div class="col">
        Ringing <b>{{ ringer.uri }}</b> for <b>{{ ringer.timeout }}</b> seconds
        <b-button
          size="sm"
          class="pointer"
          variant="outline-danger"
          @click="stop_ringer"
        >
          Cancel
        </b-button>
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
  created () {
    this.query()
    this.$bus.$on('agent_state', this.handleState)
  },
  beforeDestroy () {
    this.$bus.$off('agent_state', this.handleState)
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
}
</script>
