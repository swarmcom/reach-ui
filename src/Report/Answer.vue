<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Answer Performance</h3>
      </div>
    </div>
    <widget-query
      v-model="query_params"
      enable="range:group_by"
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_answer"
          :labels="json_answer_labels"
          name="answer.csv"
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
    >
      <template
        slot="detail"
        slot-scope="dataSlot"
      >
        <b-link
          v-if="are_calls(dataSlot.item)"
          @click="detail(dataSlot.item)"
        >
          calls
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
        rings: { label: 'Calls', sortable: true },
        answers: {
          label: 'Answer',
          formatter: (answers, _, item) => answers + ' / ' + this.percentageFormatter(answers, item.rings),
          sortable: true
        },
        abandons: {
          label: 'Abandon',
          formatter: (abandons, _, item) => abandons + ' / ' + this.percentageFormatter(abandons, item.rings),
          sortable: true
        },
        aborts: {
          label: 'Abort',
          formatter: (aborts, _, item) => aborts + ' / ' + this.percentageFormatter(aborts, item.rings),
          sortable: true
        },
        voicemails: {
          label: 'VM',
          formatter: (voicemails, _, item) => voicemails + ' / ' + this.percentageFormatter(voicemails, item.rings),
          sortable: true
        },
        detail: { label: 'Unanswered' }
      },
      json_answer_labels: {
        name: "Name",
        rings: "Calls",
        answers: "Answer",
        abandons: "Abandon",
        aborts: "Abort",
        voicemails: "VM"
      },
    }
  },
  computed: {
    comp_answer: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['name'] = item['entity']['name']
        object['rings'] = item['rings']
        object['answers'] = item['answers'] + '/' + this.percentageFormatter(item['answers'], item['rings'])
        object['abandons'] = item['abandons'] + '/' + this.percentageFormatter(item['abandons'], item['rings'])
        object['aborts'] = item['aborts'] + '/' + this.percentageFormatter(item['aborts'], item['rings'])
        object['voicemails'] = item['voicemails'] + '/' + this.percentageFormatter(item['voicemails'], item['rings'])
        array.push(object)
      })
      return array
    }
  },
  methods: {
    are_calls (item) {
      return (item.abandons > 0 || item.voicemails > 0 || item.aborts > 0)
    },
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_answer', 'summary', query])
    },
    detail (data) {
      let params = this.maybe_copy_params({ standalone: false, entity_id: data.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by'])
      this.$router.push({ path: '/reports/inbound/unanswered', query: params })
    }
  },
}
</script>
