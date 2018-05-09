<template>
<div>
  <div class="row">
    <div class="col"><h3>Agents Releases</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:agents:agent_groups" require-range></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields">
    <template slot="details" slot-scope="data">
        <b-link @click.stop="events(data)">events</b-link>
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
        release: { label: 'Release name', formatter: this.nameFormatter  },
        count: { label: 'Count' },
        time: { label: 'Time', formatter: this.durationFormatter },
        time_avg: { label: 'Time Avg', formatter: this.durationFormatter },
        details: { label: 'Details' },
      }
    }
  },
  methods: {
    query (Query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_releases', 'summary', Query])
    },
    events ({item}) {
      let params = this.maybe_copy_params({ standalone: false, release: item.release.id }, this.query_params, ['date_start', 'date_end'])
      this.$router.push({ path: '/reports/agents/events', query: params })
    }
  },
}
</script>

