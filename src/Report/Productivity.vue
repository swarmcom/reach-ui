<template>
<div>
  <div class="row">
    <div class="col"><h3>Productivity</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:group_by" group-by="productivity" @reset="reset"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields"></b-table>
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
        occupancy: { label: 'Ocpncy', formatter: v => v ? v + '%' : 0 + '%' },
        cpt: { label: 'CPT', formatter: this.durationFormatter },
        total_time: { label: 'Logged In', formatter: this.durationFormatter },
        logged_out: { label: 'Logged Out', formatter: (v, _, item) => this.durationFormatter(item.range - item.total_time) },
        released: { label: 'Release', formatter: this.durationFormatter },
        suspended: { label: 'Suspend', formatter: this.durationFormatter },
        idle: { label: 'Idle', formatter: this.durationFormatter },
        ringing: { label: 'Ring', formatter: this.durationFormatter },
        talk_total: { label: 'Talk', formatter: this.durationFormatter },
        wrapup: { label: 'Wrap Up', formatter: this.durationFormatter },
      },
    }
  },
  methods: {
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['productivity', 'report', query])
    },
  },
}
</script>

