<template>
  <div>
    <b-row>
      <b-col><h3>Voicemail details</h3></b-col>
    </b-row>
    <widget-query
      v-model="query_params"
      enable="range:step:empty_intervals"
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
            :data="comp_voicemail_details"
            :labels="json_voicemail_details_labels"
            name="voicemail_details.csv"
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
      query_params: { step: 60, empty_intervals: false },
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
        call_count: { label: 'Calls', sortable: true },
        ring_count: { label: 'Attempts', sortable: true },
        answered_count: { label: 'Answer', sortable: true },
        cpt: {
          label: "CPT",
          formatter: this.durationFormatter,
          sortable: true
        },
        asa: {
          label: "ASA",
          formatter: this.durationFormatter,
          sortable: true
        },
        sla_count: { label: 'SLA', sortable: true },
        callback_count: { label: 'Callbacks', sortable: true },
        callback_answered_count: { label: 'Answer ', sortable: true },
        callback_abandoned_count: { label: 'Abandon', sortable: true },
        callback_cpt: {
          label: 'CPT ', 
          formatter: this.durationFormatter,
          sortable: true
        },
      },
      json_voicemail_details_labels: {
        ts_from: "From",
        ts_to: "To",
        call_count: "Calls",
        ring_count: "Attempts ",
        answered_count: "Answer ",
        cpt: "CPT ",
        asa: "ASA",
        sla_count: "SLA",
        callback_count: "Callbacks",
        callback_answered_count: "Answer",
        callback_abandoned_count: "Abandon",
        callback_cpt: "CPT"
      }
    }
  },
  computed: {
    comp_voicemail_details: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_from'] = this.tsFormatter(item['ts_from'])
        object['ts_to'] = this.tsFormatter(item['ts_to'])
        object['call_count'] = item['call_count']
        object['ring_count'] = item['ring_count']
        object['answered_count'] = item['answered_count']
        object['cpt'] = this.durationFormatter(item['cpt'])
        object['asa'] = this.durationFormatter(item['asa'])
        object['sla_count'] = item['sla_count']
        object['callback_count'] = item['callback_count']
        object['callback_answered_count'] = item['callback_answered_count']
        object['callback_abandoned_count'] = item['callback_abandoned_count']
        object['callback_cpt'] = this.durationFormatter(item['callback_cpt'])
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
      return this.$agent.p_mfa('ws_report', 'query', ['report_voicemail', 'details', query])
    },
  },
}
</script>

