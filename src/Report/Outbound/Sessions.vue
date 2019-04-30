<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Outbound sessions {{ header }}</h3>
      </div>
    </div>
    <widget-query
      v-if="is_standalone()"
      v-model="query_params"
      enable="range:agents:agent_groups:clients"
      @reset="reset"
    />
    <b-table
      style="margin-top: 20px"
      small
      striped
      hover
      :items="data"
      :fields="fields"
      @row-clicked="click"
    >
      <template
        slot="state_total"
        slot-scope="dataSlot"
      >
        {{ durationFormatter(dataSlot.item.states.total) }}
      </template>
      <template
        slot="state_ringing"
        slot-scope="dataSlot"
      >
        {{ durationFormatter(dataSlot.item.states.states.ringing) }}
      </template>
      <template
        slot="state_oncall"
        slot-scope="dataSlot"
      >
        {{ durationFormatter(dataSlot.item.states.states.oncall) }}
      </template>
      <template
        slot="line_out"
        slot-scope="dataSlot"
      >
        {{ nameFormatter(dataSlot.item.line_out) }}
      </template>
      <template
        slot="client"
        slot-scope="dataSlot"
      >
        {{ nameFormatter(dataSlot.item.client) }}
      </template>
      <template
        slot="agent"
        slot-scope="dataSlot"
      >
        {{ nameFormatter(dataSlot.item.agent) }}
      </template>
      <template
        slot="calling"
        slot-scope="dataSlot"
      >
        {{ dataSlot.item.target }}
      </template>
      <template
        slot="player"
        slot-scope="dataSlot"
      >
        <b-btn
          v-if="dataSlot.item.keep_record"
          variant="dark"
          size="sm"
          @click="dataSlot.toggleDetails"
        >
          {{ dataSlot.detailsShowing ? 'Hide' : 'Show' }} Player
        </b-btn>
      </template>
      <template
        slot="row-details"
        slot-scope="dataSlot"
      >
        <player
          v-if="dataSlot.item.keep_record"
          :href="'/records/' + dataSlot.item.uuid + '.wav'"
        />
      </template>
    </b-table>
    <b-row>
      <b-col>
        <b-button
          variant="outline-primary"
          class="float-right"
          @click="more"
        >
          More
        </b-button>
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
        player: { label: 'Recordings' }
      },
    }
  },
  created () {
    if (! this.is_standalone() && ! this.is_cached()) {
      this.query_params = this.set_query_params(this.query_params)
      this.safe_query(this.query_params)
      this.maybe_set_header()
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
}
</script>

<style>
tbody tr {
  cursor: pointer;
}
</style>
