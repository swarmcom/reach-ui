<template>
  <div>
    <div class="row">
      <div class="col">
        <h3>Calls Dispositions</h3>
      </div>
    </div>
    <widget-query
      v-model="query_params"
      enable="range:agents:agent_groups:queues:queue_groups:clients"
      require-range
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_dispositions"
          :labels="json_dispositions_labels"
          name="dispositions.csv"
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
        slot="details"
        slot-scope="dataSlot"
      >
        <b-link @click.stop="sessions(dataSlot)">
          sessions
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
        disposition: {
          label: 'Disposition',
          formatter: this.nameFormatter,
          sortable: true
        },
        count: { label: 'Count', sortable: true },
        details: { label: 'Details' },
      },
      json_dispositions_labels: {
        disposition: "Disposition",
        count: "Count"
      }
    }
  },
  computed: {
    comp_dispositions: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['disposition'] = this.nameFormatter(item['disposition'])
        object['count'] = item['count']
        array.push(object)
      })
      return array
    }
  },
  methods: {
    query (Query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_dispositions', 'summary', Query])
    },
    sessions ({item}) {
      let params = this.maybe_copy_params({ standalone: true, disposition: item.disposition.id }, this.query_params, ['date_start', 'date_end'])
      this.$router.push({ path: '/reports/inbound/sessions', query: params })
    }
  },
}
</script>

