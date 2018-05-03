<template>
<div>
  <div class="row">
    <div class="col"><h3>Answer Performance</h3></div>
  </div>
  <widget-query v-model="query_params" enable="range:group_by"></widget-query>
  <b-table style="margin-top: 20px" small striped hover :items="data" :fields="fields">
    <template slot="answers" slot-scope="data">
      {{ data.item.answers }} / {{ percentageFormatter(data.item.answers, data.item.rings) }}
    </template>
    <template slot="abandons" slot-scope="data">
      {{ data.item.abandons }} / {{ percentageFormatter(data.item.abandons, data.item.rings) }}
    </template>
    <template slot="voicemails" slot-scope="data">
      {{ data.item.voicemails }} / {{ percentageFormatter(data.item.voicemails, data.item.rings) }}
    </template>
    <template slot="aborts" slot-scope="data">
      {{ data.item.aborts }} / {{ percentageFormatter(data.item.aborts, data.item.rings) }}
    </template>
    <template slot="detail" slot-scope="data">
      <b-link v-if="are_calls(data.item)" @click="detail(data.item)">calls</b-link>
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
