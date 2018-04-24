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
import Base from '@/Report/Base'

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
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
      this.data = await this.$agent.p_mfa('ws_report', 'query', ['report_agent', 'dispositions', Query])
    }
  },
}
</script>

