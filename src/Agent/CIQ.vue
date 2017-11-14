<template>
<div>
CIQ: {{ ciq.ciq }}
</div>
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
      console.log("EVENT")
      this.query()
    }
  },
  created () {
    this.query()
    this.$bus.$on('inqueue_state', this.handleUpdate)
  },
  beforeDestroy () {
    this.$bus.$off('inqueue_state', this.handleUpdate)
  }
}
</script>
