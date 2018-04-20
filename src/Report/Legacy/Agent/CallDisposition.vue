<template>
<div>
  <div class="row">
    <div class="col"><h3>Agent Call Disposition</h3></div>
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
      data: [],
      fields: {
        agent_name: { label: 'Name' },
        agent_group_name: { label: 'Group' },
        calls: { label: 'Calls' },
        dispositions: { label: 'Dispositions', formatter: (v) => JSON.stringify(v) },
      }
    }
  },
  methods: {
    query: async function (Query) {
      try {
        this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_agent', 'dispositions', Query])
      }
      catch (e) {
        this.$notify({ title: 'Report Error:', text: e, type: 'error' })
      }
    },
  },
  watch: {
    query_params (value) {
      this.query(value)
      return value
    }
  }
}
</script>

