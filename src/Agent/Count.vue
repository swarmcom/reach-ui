<template>
<div>
<b-row>
  <b-col>
    <h3>Online:</h3>
  </b-col>
</b-row>
<table class="table table-striped table-sm">
  <caption>Agents states</caption>
  <thead>
    <tr>
      <td>State</td>
      <td class="text-right">Count</td>
      <td class="text-right">Percent</td>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(count, state) in states" :key="state">
      <td>{{state}}</td>
      <td class="text-right">{{count}}</td>
      <td class="text-right">{{percent(count, total)}}</td>
    </tr>
  </tbody>
</table>
</div>
</template>

<script>
export default {
  name: 'agent-count',
  data () {
    return {
      states: {},
      total: 0
    }
  },
  methods: {
    query: async function () {
      this.states = await this.$agent.p_mfa('ws_stats', 'agents_states', [])
      this.total = Object.entries(this.states).reduce((sum, [key, value]) => {return sum + value }, 0)
    },
    handleUpdate (ev) {
      this.states = ev.states
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
    this.$bus.$on('agent_group_state', this.handleUpdate)
    this.query()
  },
  beforeDestroy () {
    this.$bus.$off('agent_group_state', this.handleUpdate)
  }
}
</script>
