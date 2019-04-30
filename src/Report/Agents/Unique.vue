<template>
  <div>
    <b-row>
      <b-col><h2>Unique agents per state</h2></b-col>
    </b-row>
    <widget-query
      v-model="query_params"
      style="margin-bottom: 10px"
      @reset="reset"
    />
    <widget-chart v-model="report" />
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
  watch: {
    query_params (value) {
      this.query(value)
      return value
    }
  },
  created () {
    this.query(this.query_params)
  },
  methods: {
    query: async function(params) {
      this.report = await this.$agent.p_mfa('ws_report', 'agents_unique', [params])
    }
  }
}
</script>
