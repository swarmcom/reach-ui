<template>
  <div>
    <b-row>
      <b-col>
        <h3>Outbound session events</h3>
      </b-col>
    </b-row>
    <b-row style="margin-top: 10px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_outbound_events"
          :labels="json_outbound_events_labels"
          name="outbound_events.csv"
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
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      query_params: {},
      data: [],
      fields: {
        ts_ms: {
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
        }
      },
      json_outbound_events_labels: {
        ts_ms: "Time",
        state_from: "From",
        state: "To",
        time: "Duration"
      },
    }
  },
  computed: {
    comp_outbound_events: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_ms'] = this.tsMsFormatter(item['ts_start_ms'])
        object['state_from'] = item['state_from']
        object['state'] = item['state']
        object['time'] = this.durationFormatter(item['time'])
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
      params.uuid = this.id
      return this.$agent.p_mfa('ws_report', 'query', ['report_events', 'outgoing', params])
    },
  },
}
</script>
