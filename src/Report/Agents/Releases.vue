<template>
  <div>
    <b-row>
      <b-col>
        <h3>Agents Releases</h3>
      </b-col>
    </b-row>
    <widget-query
      v-model="query_params"
      enable="range:agents:agent_groups"
      require-range
      @reset="reset"
    />
    <b-row style="margin-top: 20px">
      <b-col
        class="cvs-download"
        title="export to csv"
      >
        <download-csv
          :data="comp_agents_releases"
          :labels="json_agents_releases_labels"
          name="agents_releases.csv"
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
        <b-link @click.stop="events(dataSlot)">
          events
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
        release: {
          label: 'Release name',
          key: 'release.name',
          sortable: true
        },
        count: { label: 'Count', sortable: true },
        time: {
          label: 'Time',
          formatter: this.durationFormatter,
          sortable: true
        },
        time_avg: {
          label: 'Time Avg',
          formatter: this.durationFormatter,
          sortable: true
        },
        details: { label: 'Details' }
      },
      json_agents_releases_labels: {
        release: "Release name",
        state: "To",
        time: "Time",
        time_avg: "Time Avg"
      }
    }
  },
  computed: {
    comp_agents_releases: function () {
      let array = []
      this.data.forEach( item => {
        let object = {}
        object['release'] = this.nameFormatter(item['release'])
        object['count'] = item['count']
        object['time'] = this.durationFormatter(item['time'])
        object['time_avg'] = this.durationFormatter(item['time_avg'])
        array.push(object)
      })
      return array
    }
  },
  methods: {
    query (Query) {
      return this.$agent.p_mfa('ws_report', 'query', ['report_releases', 'summary', Query])
    },
    events ({item}) {
      let params = this.maybe_copy_params({ standalone: false, release: item.release.id }, this.query_params, ['date_start', 'date_end'])
      this.$router.push({ path: '/reports/agents/events', query: params })
    }
  },
}
</script>

