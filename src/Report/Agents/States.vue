<template>
<div>
  <b-row>
    <b-col><h2>Agents states man-hours</h2></b-col>
  </b-row>
  <widget-query v-model="query_params" style="margin-bottom: 10px"></widget-query>
  <widget-chart v-model="report"></widget-chart>
</div>
</template>

<script>
import Chart from '@/Report/Widget/Chart'
import Query from '@/Report/Query'

export default {
  components: {
    'widget-chart': Chart,
    'widget-query': Query
  },
  data () {
    return {
      report: {},
      query_params: {}
    }
  },
  methods: {
    query: async function(params) {
      this.report = await this.$agent.p_mfa('ws_report', 'agents_states', [params])
    }
  },
  created () {
    this.query(this.query_params)
  },
  watch: {
    query_params (value) {
      this.query(value)
      return value
    }
  }
}
</script>
