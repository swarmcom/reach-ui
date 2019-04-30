<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Outbound traffic summary</h3>
      </div>
    </div>
    <widget-query
      v-model="query_params"
      enable="range:group_by"
      group-by="outbound"
      require-range
      @reset="reset"
    />
    <b-table
      style="margin-top: 20px"
      small
      striped
      hover
      :items="data"
      :fields="fields"
      tbody-tr-class="pointer"
      @row-clicked="details"
    >
      <template
        slot="entity"
        slot-scope="dataSlot"
      >
        <b-link @click.stop="sessions(dataSlot)">
          {{ nameFormatter(dataSlot.item.entity) }}
        </b-link>
      </template>
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
        avg_talk_time: { label: 'Average Talk Time', formatter: this.durationFormatter },
        total_talk_time: { label: 'Total Talk Time', formatter: this.durationFormatter }
      },
    }
  },
  methods: {
    query (query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_outbound', 'summary', query])
    },
    details (data) {
      let params = this.maybe_copy_params({ standalone: false, entity_id: data.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by', 'sla'])
      this.$router.push({ path: '/reports/outbound/details', query: params })
    },
    sessions ({item}) {
      let params = this.maybe_copy_params({ standalone: false, entity_id: item.entity.id }, this.query_params, ['date_start', 'date_end', 'group_by'])
      this.$router.push({ path: '/reports/outbound/sessions', query: params })
    }
  },
}
</script>
