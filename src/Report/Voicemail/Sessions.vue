<template>
  <div>
    <b-row>
      <b-col>
        <h3>Voicemail {{ header }}</h3>
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
          :data="comp_voicemail_sessions"
          :labels="json_voicemail_sessions_labels"
          name="voicemail_sessions.csv"
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
        slot="state_total"
        slot-scope="dataSlot"
      >
        {{ durationFormatter(dataSlot.item.states.total) }}
      </template>
      <template
        slot="state_inqueue"
        slot-scope="dataSlot"
      >
        {{ durationFormatter(dataSlot.item.states.states.inqueue) }}
      </template>
      <template
        slot="state_agent"
        slot-scope="dataSlot"
      >
        {{ durationFormatter(dataSlot.item.states.states.agent) }}
      </template>
      <template
        slot="state_oncall"
        slot-scope="dataSlot"
      >
        {{ durationFormatter(dataSlot.item.states.states.oncall) }}
      </template>
      <template
        slot="line_in"
        slot-scope="dataSlot"
      >
        {{ nameFormatter(dataSlot.item.line_in) }}
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
        slot="caller_ip"
        slot-scope="dataSlot"
      >
        {{ dataSlot.item.caller_ip }}
      </template>
      <template
        slot="caller"
        slot-scope="dataSlot"
      >
        {{ dataSlot.item.caller }}
      </template>
      <template
        slot="calling"
        slot-scope="dataSlot"
      >
        {{ dataSlot.item.calling }}
      </template>
      <template
        slot="player"
        slot-scope="dataSlot"
      >
        <player
          v-if="dataSlot.item.keep_record"
          :href="dataSlot.item.call_record_path"
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
        ts_ms: { label: 'Time', formatter: this.tsMsFormatter },
        state_total: { label: 'Total' },
        state_inqueue: { label: 'Inqueue' },
        state_agent: { label: 'Agent' },
        state_oncall: { label: 'Oncall' },
        line_in: { label: 'Line In' },
        client: { label: 'Client' },
        agent: { label: 'Agent' },
        caller_ip: { label: 'IP' },
        caller: { label: 'Caller' },
        calling: { label: 'Calling' },
        player: { label: ' ' }
      },
      json_voicemail_sessions_labels: {
        ts_ms: "Time",
        state_total: "Total",
        state_inqueue: "Inqueue",
        state_agent: "Agent ",
        state_oncall: "Oncall",
        line_in: "Line In",
        client: "Client",
        agent: "Agent",
        caller_ip: "IP",
        caller: "Caller",
        calling: "Calling"
      }
    }
  },
  computed: {
    comp_voicemail_sessions: function () {
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
      return this.$agent.p_mfa('ws_report', 'query', ['report_sessions', 'voicemail', params])
    },
    click ({uuid}) {
      this.$router.push(`/reports/voicemail/session/events/${uuid}`)
    },
  },
}
</script>
