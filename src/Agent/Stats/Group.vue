<template>
<b-row>
  <b-col class="table-body-green">
    Team CPT<br>
    <span class="stats-value">{{cpt}}</span>
  </b-col>
  <b-col class="table-body-green">
    Team Occup.<br>
    <span class="stats-value">{{oncall}}</span>
  </b-col>
  <b-col class="table-body-green">
    Team ASA<br>
    <span class="stats-value">{{asa}}</span>
  </b-col>
  <b-col class="table-body-green">
    Team Longest<br>
    <span class="stats-value">{{longest}}</span>
  </b-col>
</b-row>
</template>

<script>
export default {
  name: 'agent-stats-group',
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
      await this.$agent.p_mfa('ws_live_agent', 'group',[this.period])
    },
    handleUpdate ({count}) {
      this.ciq = count
    }
  },
  created: async function () {
    this.query()
    await this.$agent.p_mfa('ws_live_agent', 'subscribe', ['group', this.period])
    this.$bus.$on('live_agent_count', this.handleUpdate)
  },
  beforeDestroy: async function () {
    await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['group'])
    this.$bus.$off('live_agent_count', this.handleUpdate)
  },
  watch: {
    period: async function (value, old) {
      await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['group'])
      this.query()
    }
  }
}
</script>
