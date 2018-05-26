<template>
<div>
  <div class="row">
    <div class="col"><h3>Inbounds stats by {{type}}</h3></div>
  </div>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select v-model="type" :options="types" />
    </b-col>
    <b-col cols=3>
      <b-form-select v-model="period" :options="periods" />
    </b-col>
  </b-row>
  <b-table style="margin-top:10px" small striped hover :items="data" :fields="fields">
    <template slot="entity" slot-scope="data">
      {{ data.item.entity.name }}
    </template>
    <template slot="avg_talk_time" slot-scope="data">
      {{ durationFormatter(data.item.avg_talk_time) }}
    </template>
    <template slot="avg_hold_time" slot-scope="data">
      {{ durationFormatter(data.item.avg_hold_time) }}
    </template>
    <template slot="talk_time" slot-scope="data">
      {{ durationFormatter(data.item.talk_time) }}
    </template>
    <template slot="hold_time" slot-scope="data">
      {{ durationFormatter(data.item.hold_time) }}
    </template>
  </b-table>
</div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  mixins: [Base],
  components: {
  },
  data () {
    return {
      type: 'queue',
      types: ['queue', 'group', 'client', 'line_in'],
      period: '15m',
      periods: ['15m', '30m', '1h', '1d', '1w', '1M'],
      fields: {
        entity: { label: 'Name' },
        calls: { label: 'Calls' },
        rings: { label: 'Rings' },
        answers: { label: 'Answers' },
        transfers: { label: 'Transfers' },
        avg_talk_time: { label: 'Avg.Talk' },
        avg_hold_time: { label: 'Avg.Hold' },
        talk_time: { label: 'Talk' },
        hold_time: { label: 'Hold' },
      },
    }
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
    query: async function (type) {
      await this.$agent.p_mfa('ws_live_stats', 'subscribe', ['inbound_groups', type, this.period])
      this.saveCache()
    },
    onTimer () {
    },
  },
  created () {
    this.$bus.$on('live_stats', this.handleStats)
  },
  beforeDestroy () {
    this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['inbound_groups', this.type])
    this.$bus.$off('live_stats', this.handleStats)
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['inbound_groups', old])
      this.query(value)
    },
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['inbound_groups', this.type])
      this.query(this.type)
    }
  }
}
</script>
