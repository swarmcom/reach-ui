<template>
  <div>
    <b-row>
      <b-col>
        <h6>
          Live agent stats
        </h6>
      </b-col>
    </b-row>
    <b-row style="margin-bottom: 10px">
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
        slot="entity"
        slot-scope="data"
      >
        {{ data.item.entity.name }}
      </template>
      <template
        slot="longest"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.longest) }}
      </template>
      <template
        slot="cpt"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.cpt) }}
      </template>
      <template
        slot="asa"
        slot-scope="data"
      >
        {{ durationFormatter(data.item.asa) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import Base from '@/Live/Base'

export default {
  name: 'LiveAgentStats',
  mixins: [Base],
  data () {
    return {
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
        asa: { label: 'ASA' },
        calls: { label: 'Calls' },
        cpt: { label: 'CPT' },
        longest: { label: 'Longest' },
        occupancy: { label: 'Occup.' },
      },
    }
  },
  watch: {
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['agent'])
      this.query(this.type)
    }
  },
  created () {
    this.$bus.$on('live_agent_stats', this.handleStats)
  },
  beforeDestroy () {
    this.$bus.$off('live_agent_stats', this.handleStats)
    this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['agent'])
  },
  methods: {
    handleStats ({stats}) {
      this.data = new Array(stats)
    },
    query: async function (type) {
      await this.$agent.p_mfa('ws_live_agent', 'subscribe', ['agent', this.period])
      this.saveCache()
    },
    onTimer () {
    },
  }
}
</script>
