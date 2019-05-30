<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Availability</h3>
      </div>
    </div>
    <widget-query
      v-model="query_params"
      enable="range:agents:agent_groups:queues:queue_groups:clients:step:sla:empty_intervals"
      require-range
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_availability"
          :labels="json_availability_labels"
          name="availability.csv"
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
  </div>
</template>

<script>
import Query from '@/Report/Query'
import Base from '@/Report/Base'
import Moment from 'moment'

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: { step: 60, sla: 10, empty_intervals: false },
      data: [],
      fields: {
        ts_from: {
          label: 'From',
          formatter: this.tsFormatter,
          sortable: true
        },
        ts_to: {
          label: 'To',
          formatter: this.tsFormatter,
          sortable: true
        },
        call_count: { label: 'Calls', sortable: true },
        ring_count: { label: 'Placed', sortable: true },
        answered_count: { label: 'Answered', sortable: true },
        voicemail: { label: 'VM', sortable: true },
        transferred_out: { label: 'Trnf.', sortable: true },
        abandoned: {
          label: 'Abndn',
          formatter: (abandoned, _, item) => abandoned + ' / ' + this.percentageFormatter(abandoned, item.call_count),
          sortable: true
        },
        cpt: {
          label: 'CPT',
          formatter: this.durationFormatter,
          sortable: true
        },
        asa: {
          label: 'ASA',
          formatter: this.durationFormatter,
          sortable: true
        },
        sla_count: { label: 'SLA', sortable: true },
      },
      json_availability_labels: {
        ts_from: "From",
        ts_to: "To",
        call_count: "Calls",
        ring_count: "Placed",
        answered_count: "Answered",
        voicemail: "VM",
        transferred_out: "Trnf",
        abandoned: "Abndn",
        cpt: "CPT",
        asa: "ASA",
        sla_count: "SLA"
      }
    }
  },
  computed: {
    comp_availability: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_from'] = this.tsFormatter(item['ts_from'])
        object['ts_to'] = this.tsFormatter(item['ts_to'])
        object['call_count'] = item['call_count']
        object['ring_count'] = item['ring_count']
        object['answered_count'] = item['answered_count']
        object['voicemail'] = item['voicemail']
        object['transferred_out'] = item['transferred_out']
        object['abandoned'] = item['abandoned'] + '/' + this.percentageFormatter(item['abandoned'], item['call_count'])
        object['cpt'] = this.durationFormatter(item['cpt'])
        object['asa'] = this.durationFormatter(item['asa'])
        object['sla_count'] = item['sla_count']
        array.push(object)
      })
      return array
    }
  },
  methods: {
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['availability', 'report', query])
    }
  },
}
</script>
