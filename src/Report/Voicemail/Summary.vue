<template>
<div>
  <div class="row">
    <div class="col"><h3>Voicemail traffic overview</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:sla:group_by"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields">
    <template slot="detail" slot-scope="data">
      <b-link @click="detail(data.item)">details</b-link>
    </template>
  </b-table>
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
      data: [],
      fields: {
        entity: { label: 'Name', formatter: this.nameFormatter },
        call_count: { label: 'Calls' },
        ring_count: { label: 'Attempts' },
        answered_count: { label: 'Answer' },
        cpt: { label: "CPT", formatter: this.durationFormatter },
        asa: { label: "ASA", formatter: this.durationFormatter },
        sla_count: { label: 'SLA' },
        callback_count: { label: 'Callbacks' },
        callback_answered_count: { label: 'Answer' },
        callback_abandoned_count: { label: 'Abandon' },
        callback_cpt: { label: 'CPT' },
        detail: { label: 'Detail' }
      },
    }
  },
  methods: {
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_voicemail', 'summary', query])
    },
    detail (data) {
      let params = this.maybe_copy_params({ entity_id: data.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by', 'sla'])
      this.$router.push({ path: '/reports/voicemail/details', query: params })
    }
  },
  created () {
    this.safe_query(this.query_params)
  },
}
</script>

