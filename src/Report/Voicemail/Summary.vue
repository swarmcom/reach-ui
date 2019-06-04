<template>
  <div>
    <b-row>
      <b-col><h3>Voicemail traffic overview</h3></b-col>
    </b-row>
    <widget-query
      v-model="query_params"
      enable="range:sla:group_by"
      require-range
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
            :data="comp_voicemail_summary"
            :labels="json_voicemail_summary_labels"
            name="voicemail_summary.csv"
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
      tbody-tr-class="pointer"
      @row-clicked="details"
    >
      <template
        slot="entity.name"
        slot-scope="dataSlot"
      >
        <b-link @click.stop="sessions(dataSlot)">
          {{ nameFormatter(dataSlot.item.entity) }}
        </b-link>
      </template>
    </b-table>
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
      data: [],
      fields: {
        entity: {
          label: 'Name',
          key: 'entity.name',
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
        }
      },
      json_voicemail_summary_labels: {
        entity: "Name",
        call_count: "Calls",
        ring_count: "Attempts",
        answered_count: "Answer",
        cpt: "CPT",
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
    comp_voicemail_summary: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['entity'] = this.nameFormatter(item['entity'])
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
  methods: {
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_voicemail', 'summary', query])
    },
    details (data) {
      let params = this.maybe_copy_params({ standalone: false, entity_id: data.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by', 'sla'])
      this.$router.push({ path: '/reports/voicemail/details', query: params })
    },
    sessions ({item}) {
      let params = this.maybe_copy_params({ standalone: false, entity_id: item.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by'])
      this.$router.push({ path: '/reports/voicemail/sessions', query: params })
    }
  },
}
</script>

