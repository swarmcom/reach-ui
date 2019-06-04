<template>
  <div>
    <b-row>
      <b-col><h3>Inbound traffic overview</h3></b-col>
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
            :data="comp_inbound_summary"
            :labels="json_inbound_summary_labels"
            name="inbound_summary.csv"
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
        calls: { label: "Calls", sortable: true },
        rings: { label: "Attempts", sortable: true },
        answers: {
          label: "Answered",
          formatter: (answers, _, item) => answers + ' / ' + this.percentageFormatter(answers, item.rings),
          sortable: true
        },
        abandons: {
          label: "Abandon",
          formatter: (abandons, _, item) => abandons + ' / ' + this.percentageFormatter(abandons, item.rings),
          sortable: true
        },
        voicemails: { label: "VM", sortable: true },
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
      json_inbound_summary_labels: {
        entity: "Name",
        calls: "Calls",
        rings: "Attempts",
        answers: "Answered",
        abandons: "Abandon",
        voicemails: "VM",
        sla_count: "SLA",
        cpt: "CPT",
        asa: "ASA"
      }
    }
  },
  computed: {
    comp_inbound_summary: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['entity'] = this.nameFormatter(item['entity'])
        object['calls'] = item['calls']
        object['rings'] = item['rings']
        object['answers'] = item['answers'] + '/' + this.percentageFormatter(item['answers'], item['rings'])
        object['abandons'] = item['abandons'] + '/' + this.percentageFormatter(item['abandons'], item['rings'])
        object['voicemails'] = item['voicemails']
        object['sla_count'] = item['sla_count']
        object['cpt'] = this.durationFormatter(item['cpt'])
        object['asa'] = this.durationFormatter(item['asa'])
        array.push(object)
      })
      return array
    }
  },
  methods: {
    query (params) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_inqueue', 'summary', params])
    },
    details (data) {
      let params = this.maybe_copy_params({ standalone: false, entity_id: data.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by', 'sla'])
      this.$router.push({ path: '/reports/inbound/details', query: params })
    },
    sessions ({item}) {
      let params = this.maybe_copy_params({ standalone: false, entity_id: item.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by'])
      this.$router.push({ path: '/reports/inbound/sessions', query: params })
    }
  },
}
</script>
