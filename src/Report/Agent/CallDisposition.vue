<template>
<div>
  <div class="row">
    <div class="col"><h3>Agent Call Disposition</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:group_by" require-range></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields">
    <template slot="dispositions" slot-scope="data">
      <span v-for="(value, propertyName, index) in data.item.dispositions" :key="propertyName">
        <b-link @click.stop="sessions(data, propertyName)">{{ propertyName }}</b-link>: {{ value }}{{ index < (Object.keys(data.item.dispositions).length-1) ? ', ' : '' }}
      </span>
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
        entity: { label: 'Name', formatter: (_v, _, item) => this.nameFormatter(item.entity)},
        calls: { label: 'Calls' },
        dispositions: { label: 'Dispositions', formatter: (v) => JSON.stringify(v) },
      }
    }
  },
  methods: {
    query: async function (Query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_agent', 'dispositions', Query])
    },
    sessions ({item}, disposition) {
      let params = this.maybe_copy_params({ entity_id: item.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by'])
      params.disposition = disposition
      this.$router.push({ path: '/reports/inbound/sessions', query: params })
    }
  },
}
</script>

