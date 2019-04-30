<template>
  <div>
    <b-row>
      <b-col>
        <h6>
          Live agent group stats by {{ type }}
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
      small
      hover
      bordered
      head-variant="light"
      thead-tr-class="table-header"
      tbody-tr-class="table-body"
      :items="data"
      :fields="fields"
    >
      <template
        slot="total_time"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.total_time) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  name: 'LiveAgentGroup',
  mixins: [Base],
  data () {
    return {
      type: 'group',
      period: '15m',
      types: ['group', 'acl', 'skills'],
      periods: [
        { value:'15m', text:'Last 15 minutes' },
        { value:'30m', text:'Last 30 minutes' },
        { value:'1h', text:'Last hour' },
        { value:'1d', text:'Today' },
        { value:'1w', text:'This Week' },
        { value:'1M', text:'This Month' }
      ],
      fields: {
        total_agents: { label: 'Agents' },
        oncall: { label: 'Oncall' },
        released: { label: 'Release' },
        available: { label: 'Available' },
        suspend: { label: 'Suspended' },
        ringing: { label: 'Ringing' },
        conference: { label: 'Conf' },
        wrapup: { label: 'Wrapup' },
        occupancy: { label: 'Occup.' },
        total_time: { label: 'CPT' },
      },
    }
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', [old])
      this.query(value)
    },
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', [this.type])
      this.query(this.type)
    }
  },
  created () {
    this.$bus.$on('live_agent_group_stats', this.handleStats)
  },
  beforeDestroy () {
    this.$bus.$off('live_agent_group_stats', this.handleStats)
    this.$agent.p_mfa('ws_live_agent', 'unsubscribe', [this.type])
  },
  methods: {
    handleStats ({stats}) {
      this.data = stats
    },
    query: async function (type) {
      await this.$agent.p_mfa('ws_live_agent', 'subscribe', [type, this.period])
      this.saveCache()
    },
    onTimer () {
    },
  }
}
</script>
