<template>
<div>
  <b-row>
    <b-col><h3>Live agent group stats by {{type}}</h3></b-col>
  </b-row>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select v-model="type" :options="types" />
    </b-col>
    <b-col cols=3>
      <b-form-select v-model="period" :options="periods" />
    </b-col>
  </b-row>
  <b-table small striped hover :items="data" :fields="fields">
    <template slot="entity" slot-scope="data">
      {{ data.item.entity.name }}
    </template>
    <template slot="total_time" slot-scope="data">
      {{ durationFormatter(data.item.total_time) }}
    </template>
  </b-table>
</div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  mixins: [Base],
  data () {
    return {
      type: 'acl',
      period: '15m',
      types: ['acl', 'group', 'skills'],
      periods: ['15m', '30m', '1h', '1d', '1w', '1M'],
      fields: {
        entity: { label: 'Name' },
        total_agents: { label: 'Agents' },
        oncall: { label: 'Oncall' },
        released: { label: 'Release' },
        available: { label: 'Avail.' },
        suspend: { label: 'Susp.' },
        ringing: { label: 'Ring' },
        conference: { label: 'Conf' },
        wrapup: { label: 'Wrapup' },
        occupancy: { label: 'Occp' },
        total_time: { label: 'CPT' },
      },
    }
  },
  methods: {
    handleStats ({stats}) {
      this.data = stats
    },
    query: async function (type) {
      await this.$agent.p_mfa('ws_live', 'subscribe', ['agent_group', type, this.period])
      this.saveCache()
    },
    onTimer () {
    },
  },
  created () {
    this.$bus.$on('live_agent_group_stats', this.handleStats)
  },
  beforeDestroy () {
    this.$bus.$off('live_agent_group_stats', this.handleStats)
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live', 'unsubscribe', ['agent_group', old])
      this.query(value)
    },
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live', 'unsubscribe', ['agent_group', this.type])
      this.query(this.type)
    }
  }
}
</script>
