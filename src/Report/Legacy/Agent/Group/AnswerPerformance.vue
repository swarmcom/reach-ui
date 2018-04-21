<template>
<div>
  <div class="row">
    <div class="col"><h3>Agent Groups Answer Performance</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agent_groups"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields">
    <template slot="detail" slot-scope="data">
      <b-link @click="detail(data.item)">calls</b-link>
    </template>
  </b-table>
</div>
</template>

<script>
import Query from '@/Report/Legacy/Query'
import Moment from 'moment'

function maybe_copy_params(Dst, Src, Params) {
  Params.forEach( k => { if (Src[k]) { Dst[k] = Src[k] } })
  return Dst
}

export default {
  components: { 'widget-query': Query },
  data () {
    return {
      query_params: {},
      fields: {
        agent_group: { label: 'Group', formatter: v => v.name },
        ring_count: { label: 'Offered' },
        answered_count: { label: 'Answered' },
        abandoned: { label: 'Failed' },
        percent_answered: {
          label: 'Percent Answered',
          formatter: (v, _, item) => (item.ring_count != 0) ? (100 * item.answered_count / item.ring_count).toFixed(1) + '%' : 'NA'
        },
        detail: { label: 'Detail' }
      },
      data: []
    }
  },
  methods: {
    query: async function (query) {
      try {
        this.data = await this.$agent.p_mfa('ws_report', 'query', ['answer_performance', 'group', query])
      }
      catch (e) {
        this.$notify({ title: 'Report Error:', text: e, type: 'error' })
      }
    },
    detail (data) {
      let params = maybe_copy_params({ agent_group_id: data.agent_group.id }, this.query_params, ['date_start', 'date_end'])
      this.$router.push({ path: '/reports/sessions/unanswered', query: params })
    }
  },
  created () {
    this.query(this.query_params)
  },
  watch: {
    query_params (query) {
      this.query(query)
      return query
    }
  }
}
</script>
