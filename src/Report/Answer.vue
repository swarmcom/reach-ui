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
      <template
        slot="voicemails"
        slot-scope="dataSlot"
      >
        {{ dataSlot.item.voicemails }} / {{ percentageFormatter(dataSlot.item.voicemails, dataSlot.item.rings) }}
      </template>
      <template
        slot="aborts"
        slot-scope="dataSlot"
      >
        {{ dataSlot.item.aborts }} / {{ percentageFormatter(dataSlot.item.aborts, dataSlot.item.rings) }}
      </template>
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
        entity: { label: 'Name', formatter: this.nameFormatter },
        rings: { label: 'Calls' },
        answers: { label: 'Answer' },
        abandons: { label: 'Abandon' },
        aborts: { label: 'Abort' },
        voicemails: { label: 'VM' },
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
