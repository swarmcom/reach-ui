<template>
  <div>
    <b-row>
      <b-col><h3>Activity</h3></b-col>
    </b-row>
    <widget-query
      v-model="query_params"
      enable="range:group_by"
      group-by="activity"
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col><h4>Inbound</h4></b-col>
    </b-row>
    <b-row>
      <b-col>
        <download-csv
          :data="comp_inbound"
          :labels="json_inbound_labels"
          name="inbound-activity.csv"
        >
          <b-btn
            class="cvs-download"
            size="sm"
            variant="light"
            :disabled="inbound.length===0"
          >
            <icon
              style="color:#838383"
              name="download"
              scale="1"
            />
            Download as CSV
          </b-btn>
        </download-csv>
      </b-col>
    </b-row>
    <b-table
      small
      striped
      hover
      :items="inbound"
      :fields="inbound_fields"
      tbody-tr-class="default_cursor"
    />
    <b-row>
      <b-col><h4>Outbound</h4></b-col>
    </b-row>
    <b-row>
      <b-col>
        <download-csv
          :data="comp_outbound"
          :labels="json_outbound_labels"
          name="outbound-activity.csv"
        >
          <b-btn
            class="cvs-download"
            size="sm"
            variant="light"
            :disabled="outbound.length===0"
          >
            <icon
              style="color:#838383"
              name="download"
              scale="1"
            />
            Download as CSV
          </b-btn>
        </download-csv>
      </b-col>
    </b-row>
    <b-table
      small
      striped
      hover
      :items="outbound"
      :fields="outbound_fields"
      tbody-tr-class="default_cursor"
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
        entity: {
          label: 'Name',
          key: 'entity.name',
          sortable: true
        },          
        rings: { label: 'Calls', sortable: true },
        answers: { label: 'Answer', sortable: true },
        transfers: { label: 'Transfer', sortable: true },
        talk_time: {
          label: 'Talk',
          formatter: this.durationFormatter,
          sortable: true
        },
        hold_time: {
          label: 'Hold',
          formatter: this.durationFormatter,
          sortable: true
        },
        avg_talk_time: {
          label: 'Avg. Talk',
          formatter: this.durationFormatter,
          sortable: true
        },
        avg_hold_time: {
          label: 'Avg. Hold',
          formatter: this.durationFormatter,
          sortable: true
        }
      },
      json_inbound_labels: {
        name: "Name",
        rings: "Calls",
        answers: "Answer",
        transfers: "Transfer",
        talk_time: "Talk",
        hold_time: "Hold",
        avg_talk_time: "Avg. Talk",
        avg_hold_time: "Avg. Hold"
      },
      outbound_fields: {
        entity: {
          label: 'Name',
          key: 'entity.name',
          sortable: true
        },
        calls: { label: 'Calls', sortable: true },
        rings: { label: 'Placed', sortable: true },
        answers: { label: 'Answer', sortable: true },
        abandons: { label: 'Abandon', sortable: true },
        talk_time: {
          label: 'Talk',
          formatter: this.durationFormatter,
          sortable: true
        },
        avg_talk_time: {
          label: 'Avg. Talk',
          formatter: this.durationFormatter,
          sortable: true
        }
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
        object['answers'] = item['answers']
        object['transfers'] = item['transfers']
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
