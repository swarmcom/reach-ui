<template>
  <div>
    <b-row>
      <b-col>
        <h3>Agent session events</h3>
      </b-col>
    </b-row>
    <b-row style="margin-top: 20px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_agents_session_events"
          :labels="json_agents_session_events_labels"
          name="agents_session_events.csv"
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
    />
    <b-btn @click="$router.go(-1)">
      Back
    </b-btn>
  </div>
</template>

<script>
import Base from '@/Report/Base'
export default {
  name: 'ReportEventsAgent',
  mixins: [Base],
  props: {
    uuid: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      data: [],
      fields: {
        ts_ms: { label: 'Time', sortable: true, formatter: this.tsMsFormatter },
        state_from: { label: 'From' },
        state: { label: 'To' },
        time: { label: 'Duration', formatter: this.durationFormatter }
      },
      json_agents_session_events_labels: {
        ts_ms: "Time",
        state_from: "From",
        state: "To",
        time: "Duration"
      }
    }
  },
  computed: {
    comp_agents_session_events: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_ms'] = this.tsMsFormatter(item['ts_ms'])
        object['state_from'] = item['state_from']
        object['state'] = item['state']
        object['time'] = this.durationFormatter(item['time'])
        array.push(object)
      })
      return array
    }
  },
  created () {
    this.safe_query()
  },
  methods: {
    query () {
      return this.$agent.p_mfa('ws_report', 'query', ['report_events', 'agent', { uuid: this.uuid }])
    },
  },
}
</script>
