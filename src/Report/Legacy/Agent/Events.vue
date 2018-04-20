<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents Events</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups:skills"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
</div>
</template>

<script>
import Query from '@/Report/Legacy/Query'
import Moment from 'moment'

export default {
  components: { 'widget-query': Query },
  data () {
    return {
      query_params: {},
      fields: {
        agent_name: { label: 'Name' },
        agent_group_name: { label: 'Group' },
        ts_from: { label: 'Time', formatter: v => Moment(v, "x").format("YYYY-MM-DD HH:mm:ss") },
        state_from: {
          label: 'From',
          formatter: (v, _, item) => (v === 'release' && item.release.name !== undefined) ? (v + ' [ ' + item.release.name + ' ]') : v
        },
        state: {
          label: 'To',
          formatter: (v, _, item) => (v === 'release' && item.release.name !== undefined) ? (v + ' [ ' + item.release.name + ' ]') : v
        }
      },
      data: []
    }
  },
  methods: {
    query: async function (query) {
      try {
        this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_agent', 'events', query])
      }
      catch (e) {
        console.log(e)
      }
    },
    durationFormatter (v) {
      return Moment.duration(parseInt(v)).format("d[d] hh:*mm:ss", { forceLength: true })
    }
  },
  watch: {
    query_params (query) {
      this.query(query)
      return query
    }
  }
}
</script>
