<template>
<div>
  <h3>Agents states:</h3>
  <b-row v-for="(count, state) in states" :key="state">
    <b-col>{{state}}:</b-col><b-col>{{count}}</b-col>
  </b-row>
</div>
</template>

<script>
export default {
  name: 'agent-count',
  data () {
    return {
      states: {}
    }
  },
  methods: {
    query: async function () {
      this.states = await this.$agent.p_mfa('ws_stats', 'agents_states', [])
    },
    handleUpdate (ev) {
      this.states = ev.states
    }
  },
  created () {
    this.$bus.$on('stats_agents_states', this.handleUpdate)
    this.query()
  },
  beforeDestroy () {
    this.$bus.$off('stats_agents_states', this.handleUpdate)
  }
}
</script>
