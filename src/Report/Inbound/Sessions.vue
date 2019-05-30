<template>
  <div>
    <b-row>
      <b-col>
        <h3>Inbound sessions {{ header }}</h3>
      </b-col>
    </b-row>
    <widget-query
      v-if="is_standalone()"
      v-model="query_params"
      enable="range:agents:agent_groups:queues:queue_groups:clients"
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_inbound_sessions"
          :labels="json_inbound_sessions_labels"
          name="inbound_sessions.csv"
        >
          <icon
            style="color:#838383"
            name="download"
            scale="1"
          />
        </download-csv>
      </b-col>
    </b-row>
    <b-table
      small
      striped
      hover
      :items="data"
      :fields="fields"
      tbody-tr-class="pointer"
      @row-clicked="click"
    >
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
      <b-col v-if="!is_standalone()">
        <b-btn @click="$router.go(-1)">
          Back
        </b-btn>
      </b-col>
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
        ts_ms: { 
          label: 'Time',
          formatter: this.tsMsFormatter,
          sortable: true
        },
        state_total: {
          label: 'Total',
          key:'states.total',
          formatter: this.durationFormatter,
          sortable: true
        },
        state_inqueue: {
          label: 'Inqueue',
          key:'states.states.inqueue',
          formatter: this.durationFormatter,
          sortable: true
        },
        state_agent: {
          label: 'Agent',
          key:'states.states.agent',
          formatter: this.durationFormatter,
          sortable: true
        },
        state_oncall: {
          label: 'Oncall',
          key:'states.states.oncall',
          formatter: this.durationFormatter,
          sortable: true
        },
        line_in: {
          label: 'Line In',
          key: 'line_in.name',
          sortable: true
        },
        client: {
          label: 'Client',
          key: 'client.name',
          sortable: true
        },
        queue: {
          label: 'Queue',
          key: 'queue.name',
          sortable: true
        },
        agent: {
          label: 'Agent',
          key: 'agent.name',
          sortable: true
        },
        caller_ip: { label: 'IP', sortable: true },
        caller: { label: 'Caller', sortable: true },
        calling: { label: 'Calling', sortable: true },
        player: { label: 'Recordings' }
      },
      json_inbound_sessions_labels: {
        ts_ms: "Time",
        state_total: "Total",
        state_inqueue: "Inqueue",
        state_agent: "Agent ",
        state_oncall: "Oncall",
        line_in: "Line In",
        client: "Client",
        queue: "Queue",
        agent: "Agent",
        caller_ip: "IP",
        caller: "Caller",
        calling: "Calling"
      }
    }
  },
  computed: {
    comp_inbound_sessions: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_ms'] = this.tsMsFormatter(item['ts_ms'])
        object['state_total'] = this.durationFormatter(item['states']['total'])
        object['state_inqueue'] = this.durationFormatter(item['states']['states']['inqueue'])
        object['state_agent'] = this.durationFormatter(item['states']['states']['agent'])
        object['state_oncall'] = this.durationFormatter(item['states']['states']['oncall'])
        object['line_in'] = this.nameFormatter(item['line_in'])
        object['client'] = this.nameFormatter(item['client'])
        object['queue'] = this.nameFormatter(item['queue'])
        object['agent'] = this.nameFormatter(item['agent'])
        object['caller_ip'] = item['caller_ip']
        object['caller'] = item['caller']
        object['calling'] = item['calling']
        array.push(object)
      })
      return array
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
      return this.$agent.p_mfa('ws_report', 'query', ['report_sessions', 'inqueue', params])
    },
    click ({uuid}) {
      this.$router.push(`/reports/inbound/session/events/${uuid}`)
    }
  },
}
</script>
