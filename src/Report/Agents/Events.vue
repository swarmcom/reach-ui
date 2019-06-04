<template>
  <div>
    <b-row>
      <b-col><h3>Agents Events {{ header }}</h3></b-col>
    </b-row>
    <widget-query
      v-if="is_standalone()"
      v-model="query_params"
      enable="range:agents:agent_groups:skills"
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col>
        <b-btn
          class="cvs-download"
          size="sm"
          variant="light"
          :disabled="data.length===0"
        >
          <download-csv
            :data="comp_agents_events"
            :labels="json_agents_events_labels"
            name="agents_events.csv"
          >
            <icon
              style="color:#838383"
              name="download"
              scale="1"
            />
            Download as CSV
          </download-csv>
        </b-btn>
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
        <b-btn
          variant="outline-primary"
          class="float-right"
          @click="more"
        >
          More
        </b-btn>
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
        ts_ms: {
          label: 'Time',
          formatter: this.tsMsFormatter,
          sortable: true
        },
        agent: {
          label: 'Name',
          key: 'agent.name',
          sortable: true
        },
        agent_group: {
          label: 'Group',
          key: 'agent_group.name',
          sortable: true
        },
        state_from: { label: 'From', sortable: true },
        state: { label: 'To', sortable: true },
        time: {
          label: 'Duration',
          formatter: this.durationFormatter,
          sortable: true
        },
        release: {
          label: 'Release',
          key: 'release.name',
          sortable: true
        }
      },
      json_agents_events_labels: {
        ts_ms: "Time",
        agent: "Name",
        agent_group: "Group",
        state_from: "From",
        state: "To",
        time: "Duration",
        release: "Release"
      }
    }
  },
  computed: {
    comp_agents_events: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_ms'] = this.tsMsFormatter(item['ts_ms'])
        object['agent'] = this.nameFormatter(item['agent'])
        object['agent_group'] = this.nameFormatter(item['agent_group'])
        object['state_from'] = item['state_from']
        object['state'] = item['state']
        object['time'] = this.durationFormatter(item['time'])
        object['release'] = this.nameFormatter(item['release'])
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
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_agent', 'events', query])
    },
    click ({uuid}) {
      this.$router.push(`/reports/agent/session/events/${uuid}`)
    },
  }
}
</script>
