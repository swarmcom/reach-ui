<template>
<div>
  <b-row>
    <b-col>
      <h6>
        Live agents stats by {{type}}
      </h6>
    </b-col>
  </b-row>
  <b-row style="margin-bottom: 10px">
    <b-col cols=3>
      <b-form-select
        v-model="type"
        :options="types"
        size="sm"
      />
    </b-col>
    <b-col cols=3>
      <b-form-select
        v-model="period"
        :options="periods"
        size="sm"
      />
    </b-col>
  </b-row>
  <b-table
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
  mixins: [Base],
  name: 'live-agents-stats',
  data () {
    return {
      type: 'group',
      types: ['group', 'acl'],
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
        total_agents: { label: 'Agents', sortable: true },
        oncall: { label: 'Oncall', sortable: true },
        released: { label: 'Release', sortable: true },
        available: { label: 'Available', sortable: true },
        suspend: { label: 'Suspended', sortable: true },
        ringing: { label: 'Ringing', sortable: true },
        conference: { label: 'Conference', sortable: true },
        wrapup: { label: 'Wrapup', sortable: true },
        occupancy: { label: 'Occup.', sortable: true },
        total_time: { label: 'CPT', sortable: true },
      },
    }
  },
  methods: {
    handleStats ({stats, type}) {
      switch (type) {
        case 'agent_group':
        case 'agent_acl_group':
          this.data = stats
          break
        default:
          break
      }
    },
    query: async function (type) {
      await this.$agent.p_mfa('ws_live_stats', 'subscribe', ['agent_groups', type, this.period])
      this.saveCache()
    },
    onTimer () {
    },
  },
  created () {
    this.$bus.$on('live_stats', this.handleStats)
  },
  beforeDestroy () {
    this.$bus.$off('live_stats', this.handleStats)
    this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['agent_groups', this.type])
  },
  watch: {
    type: async function (value, old) {
      if (this.skip_load) {
        this.skip_load = false
        return
      }
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['agent_groups', old])
      this.query(value)
    },
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_stats', 'unsubscribe', ['agent_groups', this.type])
      this.query(this.type)
    }
  }
}
</script>
