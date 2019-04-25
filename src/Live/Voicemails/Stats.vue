<template>
<div>
  <b-row>
    <b-col>
      <h6>
        Voicemail stats by {{type}}
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
    head-variant=light
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
      slot="talk_time"
      slot-scope="data"
    >
      {{ durationFormatter(data.item.talk_time) }}
    </template>
  </b-table>
</div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  mixins: [Base],
  name: 'live-voicemails-stats',
  components: {
  },
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
        offers: { label: 'Offers', sortable: true },
        answers: { label: 'Answers', sortable: true },
        abandons: { label: 'Abandons', sortable: true },
        avg_talk_time: { label: 'Avg.Talk', sortable: true },
        talk_time: { label: 'Talk', sortable: true }
      },
    }
  },
  methods: {
    handleStats ({stats, type}) {
      switch (type) {
        case 'voicemail_queue':
        case 'voicemail_client':
        case 'voicemail_line_in':
        case 'voicemail_group':
          this.data = stats
          break
        default:
          break
      }
    },
    query: async function (type) {
      await this.$agent.p_mfa('ws_live_stats', 'subscribe', ['voicemail_groups', type, this.period])
      this.saveCache()
    },
    onTimer () {
    },
  },
  created () {
    this.$bus.$on('live_stats', this.handleStats)
  },
  beforeDestroy () {
    this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['voicemail_groups', this.type])
    this.$bus.$off('live_stats', this.handleStats)
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['voicemail_groups', old])
      this.query(value)
    },
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['voicemail_groups', this.type])
      this.query(this.type)
    }
  }
}
</script>
