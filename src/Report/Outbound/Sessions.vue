<template>
<div>
  <div class="row">
    <div class="col"><h3>Outbound sessions {{ header }}</h3></div>
  </div>
  <widget-query v-if="is_standalone()" v-model="query_params" enable="range:agents:agent_groups:clients" @reset="reset"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields" @row-clicked="click">
    <template slot="state_total" slot-scope="data">
      {{ durationFormatter(data.item.states.total) }}
    </template>
    <template slot="state_ringing" slot-scope="data">
      {{ durationFormatter(data.item.states.states.ringing) }}
    </template>
    <template slot="state_oncall" slot-scope="data">
      {{ durationFormatter(data.item.states.states.oncall) }}
    </template>
    <template slot="line_out" slot-scope="data">
      {{ nameFormatter(data.item.line_out) }}
    </template>
    <template slot="client" slot-scope="data">
      {{ nameFormatter(data.item.client) }}
    </template>
    <template slot="agent" slot-scope="data">
      {{ nameFormatter(data.item.agent) }}
    </template>
    <template slot="calling" slot-scope="data">
      {{ data.item.target }}
    </template>
    <template slot="player" slot-scope="data">
      <player v-if="data.item.keep_record" :href="data.item.call_record_path"></player>
    </template>
  </b-table>
  <b-row>
    <b-col>
      <b-button variant="outline-primary" class="float-right" @click="more">More</b-button>
    </b-col>
  </b-row>
</div>
</template>

<script>
import Player from '@/Report/Player'
import Query from '@/Report/Query'
import Base from '@/Report/Base'

export default {
  components: { player: Player, 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: {},
      data: [],
      header: '',
      fields: {
        ts_ms: { label: 'Time', formatter: this.tsMsFormatter },
        state_total: { label: 'Total' },
        state_ringing: { label: 'Ringing' },
        state_oncall: { label: 'Oncall' },
        line_out: { label: 'Line out' },
        client: { label: 'Client' },
        agent: { label: 'Agent' },
        target: { label: 'Target' },
        player: { label: 'Play' }
      },
    }
  },
  methods: {
    query (params) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_sessions', 'outgoing', params])
    },
    click ({uuid}) {
      this.$router.push(`/reports/outbound/session/events/${uuid}`)
    },
  },
  created () {
    if (! this.is_standalone() && ! this.is_cached()) {
      this.query_params = this.set_query_params(this.query_params)
      this.safe_query(this.query_params)
      this.maybe_set_header()
    }
  },
}
</script>

<style>
tbody tr {
  cursor: pointer;
}
</style>
