<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents Answer Performance</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups"></widget-query>
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
        agent_name: { label: 'Agent' },
        ring_count: { label: 'Offered' },
        answered_count: { label: 'Answered' },
        abandoned: { label: 'Unanswered' },
        percent_answered: {
          label: 'Percent Answered',
          formatter: (v, _, item) => (item.ring_count != 0) ? (100 * item.answered_count / item.ring_count).toFixed(1) + '%' : 'NA'
        }
      },
      data: []
    }
  },
  methods: {
    query: async function (query) {
      try {
        this.data = await this.$agent.p_mfa('ws_report', 'query', ['answer_performance', 'agent', query])
      }
      catch (e) {
        this.$notify({ title: 'Report Error:', text: e, type: 'error' })
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
