<template>
<div>
  <div style="background-color: #dbeffa">
    <b-progress-bar :value="release" :max="total" show-progress>
      <div class="agent-state-texts">Released</div>
    </b-progress-bar>
  </div>
  <div style="margin-top:2px; background-color: #fbe7c3">
    <b-progress-bar variant="warning" :value="available" :max="total" show-progress>
      <div class="agent-state-texts">Available</div>
    </b-progress-bar>
  </div>
  <div style="margin-top:2px; background-color: #fbe7c3">
    <b-progress-bar variant="warning" :value="ringing" :max="total" show-progress>
      <div class="agent-state-texts">Ringing</div>
    </b-progress-bar>
  </div>
  <div style="margin-top:2px; background-color: #e2fada">
    <b-progress-bar variant="success" :value="oncall" :max="total" show-progress>
      <div class="agent-state-texts">Oncall</div>
    </b-progress-bar>
  </div>
  <div style="margin-top:2px; background-color: #fbe7c3">
    <b-progress-bar variant="warning" :value="wrapup" :max="total" show-progress>
      <div class="agent-state-texts">Wrapup</div>
    </b-progress-bar>
  </div>
</div>
</template>

<script>
export default {
  name: 'agent-stats-states',
  props: ['period'],
  data () {
    return {
      release: 0,
      available: 0,
      ringing: 0,
      oncall: 0,
      wrapup: 0,
      total: 1
    }
  },
  methods: {
    query: async function () {
      this.ciq = await this.$agent.p_mfa('ws_live_agent', 'states', this.period)
    },
    handleUpdate ({count}) {
      this.ciq = count
    }
  },
  created: async function () {
    this.query()
    await this.$agent.p_mfa('ws_live_agent', 'subscribe', ['states', this.period])
    this.$bus.$on('live_agent_count', this.handleUpdate)
  },
  beforeDestroy: async function () {
    await this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['states'])
    this.$bus.$off('live_agent_count', this.handleUpdate)
  }
}
</script>
