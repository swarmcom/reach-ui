<template>
<div>
  <div class="row">
    <div class="col"><h3>Inbound traffic overview</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:sla:group_by" require-range @reset="reset"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields" tbody-tr-class="pointer" @row-clicked="details">
    <template slot="entity" slot-scope="data">
      <b-link @click.stop="sessions(data)">{{ nameFormatter(data.item.entity) }}</b-link>
    </template>
    <template slot="abandoned" slot-scope="data">
      {{ data.item.abandoned }} / {{ percentageFormatter(data.item.abandoned, data.item.ring_count) }}
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
        entity: { label: 'Name' },
        calls: { label: "Calls" },
        rings: { label: "Attempts" },
        answers: { label: "Answered" },
        abandons: { label: "Abandon" },
        voicemails: { label: "VM"  },
        sla_count: { label: "SLA" },
        cpt: { label: "CPT", formatter: this.durationFormatter },
        asa: { label: "ASA", formatter: this.durationFormatter },
      },
    }
  },
  methods: {
    query (params) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_inqueue', 'summary', params])
    },
    details (data) {
      let params = this.maybe_copy_params({ standalone: false, entity_id: data.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by', 'sla'])
      this.$router.push({ path: '/reports/inbound/details', query: params })
    },
    sessions ({item}) {
      let params = this.maybe_copy_params({ standalone: false, entity_id: item.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by'])
      this.$router.push({ path: '/reports/inbound/sessions', query: params })
    }
  },
}
</script>
