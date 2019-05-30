<template>
  <div>
    <b-row>
      <b-col>
        <h3>Inbound traffic details</h3>
      </b-col>
    </b-row>
    <widget-query
      v-model="query_params"
      enable="range:step:sla:empty_intervals"
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_inbound_details"
          :labels="json_inbound_details_labels"
          name="inbound_details.csv"
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
import Query from '@/Report/Query'
import Base from '@/Report/Base'

function maybe_copy_params(Dst, Src, Params) {
  Params.forEach( k => { if (Src[k]) { Dst[k] = parseInt(Src[k]) } })
  return Dst
}

export default {
  components: { 'widget-query': Query },
  mixins: [Base],
  data () {
    return {
      query_params: { step: 60, empty_intervals: false, sla: 10 },
      data: [],
      header: '',
      fields: {
        ts_from: {
          label: "From",
          formatter: this.tsFormatter,
          sortable: true
        },
        ts_to: {
          label: "To",
          formatter: this.tsFormatter,
          sortable: true
        },
        call_count: { label: "Calls", sortable: true },
        ring_count: { label: "Attempts", sortable: true },
        answered_count: {
          label: "Answered",
          formatter: (answered_count, _, item) => answered_count + ' / ' + this.percentageFormatter(answered_count, item.ring_count),
          sortable: true
        },
        abandoned: {
          label: "Abandon",
          formatter: (abandoned, _, item) => abandoned + ' / ' + this.percentageFormatter(abandoned, item.ring_count),
          sortable: true
        },
        voicemail: { label: "VM", sortable: true  },
        sla_count: { label: "SLA", sortable: true },
        cpt: {
          label: "CPT",
          formatter: this.durationFormatter,
          sortable: true
        },
        asa: {
          label: "ASA",
          formatter: this.durationFormatter,
          sortable: true
        }
      },
      json_inbound_details_labels: {
        ts_from: "From",
        ts_to: "To",
        call_count: "Calls",
        ring_count: "Attempts ",
        answered_count: "Answered ",
        abandoned: "Abandon",
        voicemail: "VM",
        sla_count: "SLA",
        cpt: "CPT",
        asa: "ASA"
      }
    }
  },
  computed: {
    comp_inbound_details: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_from'] = this.tsFormatter(item['ts_from'])
        object['ts_to'] = this.tsFormatter(item['ts_to'])
        object['call_count'] = item['call_count']
        object['ring_count'] = item['ring_count']
        object['answered_count'] = item['answered_count'] + '/' + this.percentageFormatter(item['answered_count'], item['ring_count'])
        object['abandoned'] = item['abandoned'] + '/' + this.percentageFormatter(item['abandoned'], item['ring_count'])
        object['voicemail'] = item['voicemail']
        object['sla_count'] = item['sla_count']
        object['cpt'] = this.durationFormatter(item['cpt'])
        object['asa'] = this.durationFormatter(item['asa'])
        array.push(object)
      })
      return array
    }
  },
  created () {
    if (! this.is_standalone() && ! this.is_cached()) {
      this.query_params = this.set_query_params(this.query_params)
      this.safe_query(this.query_params)
    }
  },
  methods: {
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_inqueue', 'details', query])
    },
  },
}
</script>
