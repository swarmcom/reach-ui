<template>
<b-row>
  <b-col class="table-body-blue">
    My CPT<br>
    <span class="stats-value">{{cpt}}</span>
  </b-col>
  <b-col class="table-body-blue">
    My Occup.<br>
    <span class="stats-value">{{oncall}}</span>
  </b-col>
  <b-col class="table-body-blue">
    My ASA<br>
    <span class="stats-value">{{asa}}</span>
  </b-col>
  <b-col class="table-body-blue">
    My Longest<br>
    <span class="stats-value">{{longest}}</span>
  </b-col>
</b-row>
</template>

<script>
export default {
  name: 'agent-stats-agent',
  props: ['period'],
  data () {
    return {
      cpt: undefined,
      oncall: undefined,
      asa: undefined,
      longest: undefined
    }
  },
  methods: {
    query: async function () {
      await this.$agent.p_mfa('ws_live_agent', 'agent', [this.period])
    },
    handleUpdate ({count}) {
      this.ciq = count
    }
  },
  created: async function () {
    this.query()
    await this.$agent.p_mfa('ws_live_agent', 'subscribe', ['agent', this.period])
    this.$bus.$on('live_agent_stats', this.handleUpdate)
  },
  beforeDestroy: async function () {
    await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['agent'])
    this.$bus.$off('live_agent_stats', this.handleUpdate)
  },
  watch: {
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['agent'])
      this.query()
    }
  }
}
</script>
