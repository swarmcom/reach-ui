<template>
  <div>
    <b-row>
      <b-col><h3>Voicemail events</h3></b-col>
    </b-row>
    <b-row style="margin-top: 10px">
      <b-col>
        <b-btn
          class="cvs-download"
          size="sm"
          variant="light"
          :disabled="data.length===0"
        >
          <download-csv
            :data="comp_voicemail_events"
            :labels="json_voicemail_events_labels"
            name="voicemail_events.csv"
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
      tbody-tr-class="default_cursor"
    />
    <b-btn @click="$router.go(-1)">
      Back
    </b-btn>
  </div>
</template>

<script>
import Base from '@/Report/Base'

export default {
  mixins: [Base],
  props: {
    uuid: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        ts_start_ms: {
          label: 'Time',
          formatter: this.tsMsFormatter,
          sortable: true
        },
        state_from: { label: 'From', sortable: true },
        state: { label: 'To', sortable: true },
        time: {
          label: 'Time',
          formatter: this.durationFormatter,
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
        }
      },
      json_voicemail_events_labels: {
        ts_start_ms: "Time",
        state_from: "From",
        state: "To",
        time: "Duration",
        queue: "Queue",
        agent: "Agent"
      },
      events: []
    }
  },
  computed: {
    comp_voicemail_events: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_start_ms'] = this.tsMsFormatter(item['ts_start_ms'])
        object['state_from'] = item['state_from']
        object['state'] = item['state']
        object['time'] = this.durationFormatter(item['time'])
        object['queue'] = this.nameFormatter(item['queue'])
        object['agent'] = this.nameFormatter(item['agent'])
        array.push(object)
      })
      return array
    }
  },
  created () {
    this.safe_query(this.query_params)
  },
  methods: {
    query (params) {
      params.uuid = this.uuid
      return this.$agent.p_mfa('ws_report', 'query', ['report_events', 'voicemail', params])
    },
  },
}
</script>
