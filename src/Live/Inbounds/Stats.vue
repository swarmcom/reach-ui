<template>
  <div>
    <b-row>
      <b-col>
        <h6>
          Inbounds stats by {{ type }}
        </h6>
      </b-col>
    </b-row>
    <b-row style="margin-bottom: 10px">
      <b-col cols="3">
        <b-form-select
          v-model="type"
          :options="types"
          size="sm"
        />
      </b-col>
      <b-col cols="3">
        <b-form-select
          v-model="period"
          :options="periods"
          size="sm"
        />
      </b-col>
    </b-row>
    <b-table
      style="margin-top:10px"
      small
      bordered
      hover
      head-variant="light"
      thead-tr-class="table-header"
      tbody-tr-class="table-body"
      sort-by="entity"
      :items="data"
      :fields="fields"
    >
      <template
        slot="entity"
        slot-scope="data"
      >
        {{ data.item.entity.name }}
      </template>
      <template
        slot="avg_talk_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.avg_talk_time) }}
      </template>
      <template
        slot="avg_hold_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.avg_hold_time) }}
      </template>
      <template
        slot="talk_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.talk_time) }}
      </template>
      <template
        slot="hold_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.hold_time) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  name: 'LiveInboundsStats',
  components: {
  },
  mixins: [Base],
  data () {
    return {
      type: 'queue',
      types: ['queue', 'group', 'client', 'line_in'],
      period: '15m',
      periods: [
        { value:'15m', text:'Last 15 minutes' },
        { value:'30m', text:'Last 30 minutes' },
        { value:'1h', text:'Last hour' },
        { value:'1d', text:'Today' },
        { value:'1w', text:'This Week' },
        { value:'1M', text:'This Month' }
      ],
      fields: {
        entity: { label: 'Name', sortable: true },
        calls: { label: 'Calls', sortable: true },
        rings: { label: 'Rings', sortable: true },
        answers: { label: 'Answers', sortable: true },
        transfers: { label: 'Transfers', sortable: true },
        avg_talk_time: { label: 'Avg.Talk', sortable: true },
        avg_hold_time: { label: 'Avg.Hold', sortable: true },
        talk_time: { label: 'Talk', sortable: true },
        hold_time: { label: 'Hold', sortable: true },
      },
    }
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['inbound_groups', old])
      this.query(value, this.period)
    },
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['inbound_groups', this.type])
      this.query(this.type, value)
    }
  },
  created () {
    this.loadCache()
    this.$bus.$on('live_stats', this.handleStats)
  },
  beforeDestroy () {
    this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['inbound_groups', this.type])
    this.$bus.$off('live_stats', this.handleStats)
  },
  methods: {
    handleStats ({stats, type}) {
      switch (type) {
        case 'inqueue_queue':
        case 'inqueue_client':
        case 'inqueue_line_in':
        case 'inqueue_group':
          this.data = stats
          break
        default:
          break
      }
    },
    query: async function (type, period) {
      await this.$agent.p_mfa('ws_live_stats', 'subscribe', ['inbound_groups', type, period])
      this.saveCache()
    },
    onTimer () {
    },
  }
}
</script>
