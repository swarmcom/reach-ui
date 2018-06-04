<template>
<div>
  <div class="row">
    <div class="col"><h3>Outbounds stats by {{type}}</h3></div>
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
    <template slot="agent_time" slot-scope="data">
      {{ durationFormatter(data.item.agent_time) }}
    </template>
    <template slot="avg_agent_time" slot-scope="data">
      {{ durationFormatter(data.item.avg_agent_time) }}
    </template>
    <template slot="calling_time" slot-scope="data">
      {{ durationFormatter(data.item.calling_time) }}
    </template>
    <template slot="avg_calling_time" slot-scope="data">
      {{ durationFormatter(data.item.avg_calling_time) }}
    </template>
    <template slot="talk_time" slot-scope="data">
      {{ durationFormatter(data.item.talk_time) }}
    </template>
    <template slot="avg_talk_time" slot-scope="data">
      {{ durationFormatter(data.item.avg_talk_time) }}
    </template>
  </b-table>
</div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  mixins: [Base],
  name: 'live-outbounds-stats',
  components: {
  },
  data () {
    return {
      type: 'group',
      types: ['group', 'acl', 'client', 'line'],
      period: '15m',
      periods: ['15m', '30m', '1h', '1d', '1w', '1M'],
      fields: {
        entity: { label: 'Name' },
        calls: { label: 'Calls' },
        rings: { label: 'Rings' },
        answers: { label: 'Answers' },
        calling_abandons: { label: 'Calling fail' },
        agent_abandons: { label: 'Agents fail' },
        calling_time: { label: 'Calling' },
        avg_calling_time: { label: 'Avg.Calling' },
        agent_time: { label: 'Agent' },
        avg_agent_time: { label: 'Avg.Agent' },
        talk_time: { label: 'Talk' },
        avg_talk_time: { label: 'Avg.Talk' }
      },
    }
  },
  methods: {
    handleStats ({stats}) {
      this.data = stats
    },
    query: async function (type) {
      await this.$agent.p_mfa('ws_live_stats', 'subscribe', ['outbound_groups', type, this.period])
      this.saveCache()
    },
    onTimer () {
    },
  },
  created () {
    this.$bus.$on('live_stats', this.handleStats)
  },
  beforeDestroy () {
    this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['outbound_groups', this.type])
    this.$bus.$off('live_stats', this.handleStats)
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['outbound_groups', old])
      this.query(value)
    },
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['outbound_groups', this.type])
      this.query(this.type)
    }
  }
}
</script>
