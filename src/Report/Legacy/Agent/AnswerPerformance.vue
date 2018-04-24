<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents Answer Performance</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields">
    <template slot="detail" slot-scope="data">
      <b-link @click="detail(data.item)">calls</b-link>
    </template>
  </b-table>
</div>
</template>

<script>
import Query from '@/Report/Legacy/Query'
import Base from '@/Report/Base'

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        agent: { label: 'Agent', formatter: this.nameFormatter },
        agent_group: { label: 'Group', formatter: this.nameFormatter },
        ring_count: { label: 'Offered' },
        answered_count: { label: 'Answered' },
        abandoned: { label: 'Failed' },
        percent_answered: { label: 'Percent Answered', formatter: (v, name, item) => this.percentageFormatter(item.answered_count, item.ring_count) },
        detail: { label: 'Detail' }
      },
    }
  },
  methods: {
    query: async function (query) {
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['answer_performance', 'agent', query])
    },
    detail (data) {
      let params = this.maybe_copy_params({ agent_id: data.agent.id }, this.query_params, ['date_start', 'date_end'])
      this.$router.push({ path: '/reports/sessions/unanswered', query: params })
    }
  },
  created () {
    this.query(this.query_params)
  },
}
</script>
