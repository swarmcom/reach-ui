<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Calls Dispositions</h3>
      </div>
    </div>
    <widget-query
      v-model="query_params"
      enable="range:agents:agent_groups:queues:queue_groups:clients"
      require-range
      @reset="reset"
    />
    <b-table
      style="margin-top: 20px"
      small
      striped
      hover
      :items="data"
      :fields="fields"
    >
      <template
        slot="details"
        slot-scope="dataSlot"
      >
        <b-link @click.stop="sessions(dataSlot)">
          sessions
        </b-link>
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
        disposition: { label: 'Disposition', formatter: this.nameFormatter },
        count: { label: 'Count' },
        details: { label: 'Details' },
      }
    }
  },
  methods: {
    query (Query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_dispositions', 'summary', Query])
    },
    sessions ({item}) {
      let params = this.maybe_copy_params({ standalone: true, disposition: item.disposition.id }, this.query_params, ['date_start', 'date_end'])
      this.$router.push({ path: '/reports/inbound/sessions', query: params })
    }
  },
}
</script>

