<template>
  <b-row>
    <b-col class="table-body-blue">
      My CPT<br>
      <span class="stats-value">{{ durationFormatter(stats.cpt) }}</span>
    </b-col>
    <b-col class="table-body-blue">
      Occup.<br>
      <span class="stats-value">{{ stats.occupancy }}</span>
    </b-col>
    <b-col class="table-body-blue">
      ASA<br>
      <span class="stats-value">{{ durationFormatter(stats.asa) }}</span>
    </b-col>
    <b-col class="table-body-blue">
      Longest<br>
      <span class="stats-value">{{ durationFormatter(stats.longest) }}</span>
    </b-col>
    <b-col class="table-body-blue">
      Calls<br>
      <span class="stats-value">{{ stats.calls }}</span>
    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment'
import momentDurationFormat from 'moment-duration-format'

export default {
  name: 'AgentStatsAgent',
  props: {
    period: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      stats: {}
    }
  },
  watch: {
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['agent'])
      this.query()
    }
  },
  created: async function () {
    this.query()
    await this.$agent.p_mfa('ws_live_agent', 'subscribe', ['agent', this.period])
    this.$bus.$on('live_agent_stats', this.handleUpdate)
  },
  beforeDestroy: async function () {
    this.$bus.$off('live_agent_stats', this.handleUpdate)
    this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['agent'])
  },
  methods: {
    query: async function () {
      this.stats = await this.$agent.p_mfa('ws_live_agent', 'agent', [this.period])
    },
    handleUpdate ({stats}) {
      this.stats = stats
    },
    durationFormatter (value) {
      let v = parseInt(value)
      return v >= 0 ? moment.duration(v).format("d[d] hh:*mm:ss", { forceLength: true }) : ''
    },
  }
}
</script>
