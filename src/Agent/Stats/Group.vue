<template>
  <b-row>
    <b-col class="table-body-green">
      Team CPT<br>
      <span class="stats-value">{{ durationFormatter(stats.cpt) }}</span>
    </b-col>
    <b-col class="table-body-green">
      Occup.<br>
      <span class="stats-value">{{ stats.occupancy }}</span>
    </b-col>
    <b-col class="table-body-green">
      ASA<br>
      <span class="stats-value">{{ durationFormatter(stats.asa) }}</span>
    </b-col>
    <b-col class="table-body-green">
      Longest<br>
      <span class="stats-value">{{ durationFormatter(stats.longest) }}</span>
    </b-col>
    <b-col class="table-body-green">
      Calls<br>
      <span class="stats-value">{{ stats.calls }}</span>
    </b-col>
  </b-row>
</template>

<script>
import moment from 'moment'
import momentDurationFormat from 'moment-duration-format'

export default {
  name: 'AgentStatsGroup',
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
      await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['agent_group'])
      this.query()
    }
  },
  created: async function () {
    this.query()
    await this.$agent.p_mfa('ws_live_agent', 'subscribe', ['agent_group', this.period])
    this.$bus.$on('live_agent_group_stats', this.handleUpdate)
  },
  beforeDestroy: async function () {
    this.$bus.$off('live_agent_group_stats', this.handleUpdate)
    this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['agent_group'])
  },
  methods: {
    query: async function () {
      this.stats = await this.$agent.p_mfa('ws_live_agent', 'group',[this.period])
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
