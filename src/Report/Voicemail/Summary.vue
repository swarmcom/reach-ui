<template>
<div>
  <div class="row">
    <div class="col"><h3>Voicemail traffic overview</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:sla:group_by"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields" tbody-tr-class="pointer" @row-clicked="details">
    <template slot="entity" slot-scope="data">
      <b-link @click.stop="sessions(data)">{{ nameFormatter(data.item.entity) }}</b-link>
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
        callback_cpt: { label: 'CPT' }
      },
    }
  },
  methods: {
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_voicemail', 'summary', query])
    },
    details (data) {
      let params = this.maybe_copy_params({ entity_id: data.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by', 'sla'])
      this.$router.push({ path: '/reports/voicemail/details', query: params })
    },
    sessions ({item}) {
      let params = this.maybe_copy_params({ entity_id: item.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by'])
      this.$router.push({ path: '/reports/voicemail/sessions', query: params })
    }
  },
}
</script>

