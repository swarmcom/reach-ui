<template>
<div>
  <div class="row">
    <div class="col"><h3>Outbound traffic summary</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:group_by" group-by="outbound"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields">
    <template slot="detail" slot-scope="data">
      <b-link @click="detail(data.item)">details</b-link>
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
        placed: { label: 'Calls' },
        answered: { label: 'Answered' },
        answered_percent: { label: 'Answered [%]', formatter: (v, name, item) => this.percentageFormatter(item.answered, item.placed)},
        avg_talk_time: { label: 'Average Talk Time', formatter: this.durationFormatter },
        total_talk_time: { label: 'Total Talk Time', formatter: this.durationFormatter },
        detail: { label: 'Detail' }
      },
    }
  },
  methods: {
    query: async function (query) {
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_outbound', 'summary', query])
    },
    detail (data) {
      let params = this.maybe_copy_params({ entity_id: data.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by', 'sla'])
      this.$router.push({ path: '/reports/legacy/outbound/details', query: params })
    }

  },
}
</script>
