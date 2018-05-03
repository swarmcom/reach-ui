<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents Bounded Events</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
</div>
</template>

<script>
import Query from '@/Report/Query'
import Base from '@/Report/Base'

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: {},
      fields: {
        agent_name: { label: 'Name' },
        agent_group_name: { label: 'Group' },
        state_from: {
          label: 'From',
          formatter: (v, _, item) => (v === 'release' && item.release.name !== undefined) ? (v + ' [ ' + item.release.name + ' ]') : v
        },
        state: {
          label: 'To',
          formatter: (v, _, item) => (v === 'release' && item.release.name !== undefined) ? (v + ' [ ' + item.release.name + ' ]') : v
        },
        ts_from: { label: 'Time', formatter: this.tsFormatter },
        duration: { label: 'Duration', formatter: this.tsFormatter }
      },
      data: []
    }
  },
  methods: {
    query: async function (query) {
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_agent', 'bounded_events', query])
    },
  },
}
</script>

