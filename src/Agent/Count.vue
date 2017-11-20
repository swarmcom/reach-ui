<template>
<div>
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
    },
    handleSkillsUpdate (ev) {
      this.query()
    },
    percent (value, total) {
      if (value > 0 && total > 0) {
        return `${(value/total*100).toFixed(2)}%`
      } else {
        return "0%"
      }
    },
  },
  created () {
    this.$bus.$on('agent_skills', this.handleSkillsUpdate)
    this.$bus.$on('agent_group_state', this.handleUpdate)
    this.query()
  },
  beforeDestroy () {
    this.$bus.$off('agent_skills', this.handleSkillsUpdate)
    this.$bus.$off('agent_group_state', this.handleUpdate)
  }
}
</script>
