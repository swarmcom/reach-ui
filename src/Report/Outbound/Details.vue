<template>
  <div>
    <b-row>
      <b-col>
        <h3>Outbound details</h3>
      </b-col>
    </b-row>
    <widget-query
      v-model="query_params"
      enable="range:step:empty_intervals"
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_outbound_details"
          :labels="json_outbound_details_labels"
          name="outbound_details.csv"
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
    >
      <template
        slot="answers"
        slot-scope="dataSlot"
      > 
        {{ dataSlot.item.answers }} / {{ percentageFormatter(dataSlot.item.answers, dataSlot.item.rings) }}
      </template>
      <template
        slot="abandons"
        slot-scope="dataSlot"
      >
        {{ dataSlot.item.abandons }} / {{ percentageFormatter(dataSlot.item.abandons, dataSlot.item.rings) }}
      </template>
    </b-table>
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
        ts_from: { label: 'From', formatter: this.tsFormatter  },
        ts_to: { label: 'To', formatter: this.tsFormatter },
        rings: { label: 'Calls' },
        answers: { label: 'Answered' },
        abandons: { label: 'Abandons' },
        avg_talk_time: { label: 'Average Talk Time', formatter: this.durationFormatter },
        total_talk_time: { label: 'Total Talk Time', formatter: this.durationFormatter },
      },
      json_outbound_details_labels: {
        ts_from: "From",
        ts_to: "To",
        rings: "Calls",
        answers: "Answered ",
        abandons: "Abandons",
        avg_talk_time: "Average Talk Time",
        total_talk_time: "Total Talk Time"
      }
    }
  },
  computed: {
    comp_outbound_details: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['ts_from'] = this.tsFormatter(item['ts_from'])
        object['ts_to'] = this.tsFormatter(item['ts_to'])
        object['rings'] = item['rings']
        object['answers'] = item['answers'] + '/' + this.percentageFormatter(item['answers'], item['rings'])
        object['abandons'] = item['abandons'] + '/' + this.percentageFormatter(item['abandons'], item['rings'])
        object['avg_talk_time'] = this.durationFormatter(item['avg_talk_time'])
        object['total_talk_time'] = this.durationFormatter(item['total_talk_time'])
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
      return this.$agent.p_mfa('ws_report', 'query', ['report_outbound', 'details', query])
    },
  },
}
</script>
