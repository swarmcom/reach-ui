<template>
  <div>
    <div style="background-color: #dbeffa">
      <b-progress-bar
        :value="states.release"
        :max="states.total"
        show-progress
      >
        <div class="agent-state-texts">
          Released
        </div>
      </b-progress-bar>
    </div>
    <div style="margin-top:2px; background-color: #fbe7c3">
      <b-progress-bar
        variant="warning"
        :value="states.available"
        :max="states.total"
        show-progress
      >
        <div class="agent-state-texts">
          Available
        </div>
      </b-progress-bar>
    </div>
    <div style="margin-top:2px; background-color: #fbe7c3">
      <b-progress-bar
        variant="warning"
        :value="states.ringing"
        :max="states.total"
        show-progress
      >
        <div class="agent-state-texts">
          Ringing
        </div>
      </b-progress-bar>
    </div>
    <div style="margin-top:2px; background-color: #e2fada">
      <b-progress-bar
        variant="success"
        :value="states.oncall"
        :max="states.total"
        show-progress
      >
        <div class="agent-state-texts">
          Oncall
        </div>
      </b-progress-bar>
    </div>
    <div style="margin-top:2px; background-color: #fbe7c3">
      <b-progress-bar
        variant="warning"
        :value="states.wrapup"
        :max="states.total"
        show-progress
      >
        <div class="agent-state-texts">
          Wrapup
        </div>
      </b-progress-bar>
    </div>
  </div>
</template>

<script>
function maybe_zero (value) {
  let V = parseInt(value)
  return V > 0 ? V : 0
}

export default {
  name: 'AgentStatsStates',
  data () {
    return {
      names: ['release', 'available', 'ringing', 'oncall', 'wrapup', 'total'],
      states: {
        release: 0,
        available: 0,
        ringing: 0,
        oncall: 0,
        wrapup: 0,
        total: 0
      },
    }
  },
  created: async function () {
    this.query()
    await this.$agent.p_mfa('ws_live_agent', 'subscribe', ['states'])
    this.$bus.$on('live_agent_states', this.handleUpdate)
  },
  beforeDestroy: async function () {
    this.$bus.$off('live_agent_states', this.handleUpdate)
    this.$agent.p_mfa('ws_live_agent', 'unsubscribe', ['states'])
  },
  methods: {
    query: async function () {
      let states = await this.$agent.p_mfa('ws_live_agent', 'states')
      this.updateStates(states)
    },
    handleUpdate ({states}) {
      this.updateStates(states)
    },
    updateStates (states) {
      this.names.forEach( (state) => this.states[state] = maybe_zero(states[state]) )
    }
  }
}
</script>
