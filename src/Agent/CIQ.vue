<template>
<h3 class="text-muted">CIQ: {{ ciq.ciq }}</h3>
</template>

<script>
export default {
  name: 'agent-ciq',
  data () {
    return {
      ciq: {}
    }
  },
  methods: {
    query: async function () {
      this.ciq = await this.$agent.p_mfa('ws_stats', 'ciq', [])
    },
    handleUpdate (ev) {
      this.query()
    }
  },
  created () {
    this.query()
    this.$bus.$on('agent_skills', this.handleUpdate)
    this.$bus.$on('inqueue_state', this.handleUpdate)
  },
  beforeDestroy () {
    this.$bus.$off('agent_skills', this.handleUpdate)
    this.$bus.$off('inqueue_state', this.handleUpdate)
  }
}
</script>
