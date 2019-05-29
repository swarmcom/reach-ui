<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Activity</h3>
      </div>
    </div>
    <widget-query
      v-model="query_params"
      enable="range:group_by"
      group-by="activity"
      @reset="reset"
    />
    <div
      class="row"
      style="margin-top: 20px"
    >
      <div class="col">
        <h4>Inbound</h4>
      </div>
    </div>
    <b-row>
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_inbound"
          :labels="json_inbound_labels"
          name="inbound-activity.csv"
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
      :items="inbound"
      :fields="inbound_fields"
    />
    <div class="row">
      <div class="col">
        <h4>Outbound</h4>
      </div>
    </div>
    <b-row>
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_outbound"
          :labels="json_outbound_labels"
          name="outbound-activity.csv"
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
      :items="outbound"
      :fields="outbound_fields"
    />
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
      inbound_fields: {
        entity: { label: 'Name', formatter: this.nameFormatter },
        rings: { label: 'Calls' },
        answered: { label: 'Answer' },
        transferred: { label: 'Transfer' },
        talk_time: { label: 'Talk', formatter: this.durationFormatter },
        hold_time: { label: 'Hold', formatter: this.durationFormatter },
        avg_talk_time: { label: 'Avg. Talk', formatter: this.durationFormatter },
        avg_hold_time: { label: 'Avg. Hold', formatter: this.durationFormatter }
      },
      json_inbound_labels: {
        name: "Name",
        rings: "Calls",
        answered: "Answer",
        transferred: "Transfer",
        talk_time: "Talk",
        hold_time: "Hold",
        avg_talk_time: "Avg. Talk",
        avg_hold_time: "Avg. Hold"
      },
      outbound_fields: {
        entity: { label: 'Name', formatter: this.nameFormatter },
        calls: { label: 'Calls' },
        rings: { label: 'Placed' },
        answers: { label: 'Answer' },
        abandons: { label: 'Abandon' },
        talk_time: { label: 'Talk', formatter: this.durationFormatter },
        avg_talk_time: { label: 'Avg. Talk', formatter: this.durationFormatter },
      },
      json_outbound_labels: {
        name: "Name",
        calls: "Calls",
        rings: "Placed",
        answers: "Answer",
        abandons: "Abandon",
        talk_time: "Talk",
        avg_talk_time: "Avg. Talk"
      },
      inbound: [],
      outbound: []
    }
  },
  computed: {
    comp_outbound: function () {
      let array = []
      this.outbound.forEach( item => {
        let object = {}
        object['name'] = item['entity']['name']
        object['calls'] = item['calls']
        object['rings'] = item['rings']
        object['answers'] = item['answers']
        object['abandons'] = item['abandons']
        object['avg_talk_time'] = this.durationFormatter(item['avg_talk_time'])
        object['talk_time'] = this.durationFormatter(item['talk_time'])
        array.push(object)
      })
      return array
    },
    comp_inbound: function () {
      let array = []
      this.inbound.forEach( item => {
        let object = {}
        object['name'] = item['entity']['name']
        object['rings'] = item['rings']
        object['answered'] = item['answered']
        object['transferred'] = item['transferred']
        object['talk_time'] = this.durationFormatter(item['talk_time'])
        object['hold_time'] = this.durationFormatter(item['hold_time'])
        object['avg_talk_time'] = this.durationFormatter(item['avg_talk_time'])
        object['avg_hold_time'] = this.durationFormatter(item['avg_hold_time'])
        array.push(object)
      })
      return array
    }
  },
  methods: {
    query: async function (query) {
      this.inbound = await this.$agent.p_mfa('ws_report', 'query', ['report_activity', 'inbound', query])
      this.outbound = await this.$agent.p_mfa('ws_report', 'query', ['report_activity', 'outbound', query])
    }
  }
}
</script>
