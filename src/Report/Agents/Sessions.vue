<template>
  <div>
    <b-row>
      <b-col>
        <h3>Agents sessions {{ header }}</h3>
      </b-col>
    </b-row>
    <widget-query
      v-model="query_params"
      enable="range:agents:agent_groups"
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_agents_sessions"
          :labels="json_agents_sessions_labels"
          name="agents_sessions.csv"
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
    />
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
import Query from '@/Report/Query'
import Base from '@/Report/Base'

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: {},
      data: [],
      header: '',
      fields: {
        ts_ms: { label: 'Time', formatter: this.tsFormatter },
        state_total: { label: 'Total', formatter: (v, name, item) => this.durationFormatter(item.states.total) },
        state_release: { label: 'Release', formatter: (v, name, item) => this.durationFormatter(item.states.states.release) },
        state_available: { label: 'Available', formatter: (v, name, item) => this.durationFormatter(item.states.states.available) },
        state_oncall: { label: 'Oncall', formatter: (v, name, item) => this.durationFormatter(item.states.states.oncall) },
        agent_name: { label: 'Name', formatter: (v, name, item) => item.agent.name },
        agent_login: { label: 'Login', formatter: (v, name, item) => item.agent.login },
        agent_peer: { label: 'Peer IP', formatter: (v, name, item) => item.peer },
      },
      json_agents_sessions_labels: {
        ts_ms: "Time",
        state_total: "Total",
        state_release: "Release",
        state_available: "Available",
        state_oncall: "Oncall",
        agent_name: "Name",
        agent_login: "Login",
        agent_peer: "Peer IP"
      }
    }
  },
  computed: {
    comp_agents_sessions: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_ms'] = this.tsFormatter(item['ts_ms'])
        object['state_total'] = this.durationFormatter(item['states']['total'])
        object['state_release'] = this.durationFormatter(item['states']['states']['release'])
        object['state_available'] = this.durationFormatter(item['states']['states']['available'])
        object['state_oncall'] = this.durationFormatter(item['states']['states']['oncall'])
        object['agent_name'] = item['agent']['name']
        object['agent_login'] = item['agent']['login']
        object['agent_peer'] = item['peer']
        array.push(object)
      })
      return array
    }
  },
  created () {
    this.query_params = this.set_query_params(this.query_params)
    this.safe_query(this.query_params)
    this.maybe_set_header()
  },
  methods: {
    query (params) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_sessions', 'agent', params])
    },
    click ({uuid}) {
      this.$router.push(`/reports/agent/session/events/${uuid}`)
    },
    maybe_set_header () {
    }
  },
}
</script>
