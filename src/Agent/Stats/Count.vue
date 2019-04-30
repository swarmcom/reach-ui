<template>
  <div>
    Agents<br>
    <span class="stats-value">{{ count }}</span>
  </div>
</template>

<script>
export default {
  name: 'AgentStatsCount',
  data () {
    return {
      count: undefined
    }
  },
  created: async function () {
    this.query()
    await this.$agent.p_mfa('ws_live_agent', 'subscribe', ['count'])
    this.$bus.$on('live_agent_count', this.handleUpdate)
  },
  beforeDestroy: async function () {
    this.$bus.$off('live_agent_count', this.handleUpdate)
    this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['count'])
  },
  methods: {
    query: async function () {
      this.count = await this.$agent.p_mfa('ws_live_agent', 'count')
    },
    handleUpdate ({count}) {
      this.count = count
    }
  }
}
</script>
