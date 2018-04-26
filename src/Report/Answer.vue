<template>
<div>
  <div class="row">
    <div class="col"><h3>Answer Performance</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:group_by"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields">
    <template slot="detail" slot-scope="data">
      <b-link v-if="data.item.abandoned" @click="detail(data.item)">calls</b-link>
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
        entity: { label: 'Name', formatter: this.nameFormatter },
        ring_count: { label: 'Offered' },
        answered_count: { label: 'Answered' },
        abandoned: { label: 'Abandoned' },
        percent_answered: { label: 'Percent Answered', formatter: (v, name, item) => this.percentageFormatter(item.answered_count, item.ring_count) },
        detail: { label: 'Details' }
      },
    }
  },
  methods: {
    query: async function (query) {
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_answer', 'summary', query])
    },
    detail (data) {
      let params = this.maybe_copy_params({ entity_id: data.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by'])
      this.$router.push({ path: '/reports/sessions/unanswered', query: params })
    }
  },
  created () {
    this.query(this.query_params)
  },
}
</script>
