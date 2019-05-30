<template>
  <div>
    <b-row>
      <b-col>
        <h3>Inbound session events</h3>
      </b-col>
    </b-row>
    <b-row style="margin-top: 10px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_inbound_events"
          :labels="json_inbound_events_labels"
          name="inbound_events.csv"
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
          label: 'Duration',
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
      json_inbound_events_labels: {
        ts_start_ms: "Time",
        state_from: "From",
        state: "To",
        time: "Duration",
        queue: "Queue",
        agent: "Agent"
      }
    }
  },
  computed: {
    comp_inbound_events: function () {
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
      return this.$agent.p_mfa('ws_report', 'query', ['report_events', 'inqueue', params])
    },
  },
}
</script>
