<template>
  <div>
    CIQ<br>
    <span class="stats-value">{{ ciq }}</span>
  </div>
</template>

<script>
export default {
  name: 'AgentStatsCiq',
  data () {
    return {
      ciq: undefined
    }
  },
  created: async function () {
    this.query()
    await this.$agent.p_mfa('ws_live_agent', 'subscribe', ['ciq'])
    this.$bus.$on('live_inqueue_ciq', this.handleUpdate)
  },
  beforeDestroy: async function () {
    this.$bus.$off('live_inqueue_ciq', this.handleUpdate)
    this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['ciq'])
  },
  methods: {
    query: async function () {
      this.ciq = await this.$agent.p_mfa('ws_live_agent', 'ciq')
    },
    handleUpdate ({count}) {
      this.ciq = count
    }
  }
}
</script>
