<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseSessionManager" class="mt-2">
    <div class="row">
      <div class="col-12 col-md-3">
        <agentState></agentState>
      </div>
      <div class="col-md-9 col-12">
        <div class="row">
          <b-row class="col-10">
            <b-col cols="8">
              <dialer v-if="this.$agent.is_idle()"></dialer>
            </b-col>
            <b-col cols="12">
              <inqueue></inqueue>
            </b-col>
          </b-row>
          <div class="col-2 pull-right text-right">
            <button v-if="this.$agent.is_hold()" @click="unhold" class="btn btn-outline-secondary">
              <icon name="pause" scale="2"></icon>
            </button>
            <button v-if="this.$agent.is_oncall()" @click="hold" class="btn btn-outline-success">
              <icon name="pause" scale="2"></icon>
            </button>
            <button v-if="this.$agent.is_ringing()" @click="hangup" class="btn btn-outline-danger">
              <icon name="close" scale="2"></icon></button>
            <button v-if="this.$agent.is_oncall()" @click="hangup" class="btn btn-outline-danger">
              <icon name="close" scale="2"></icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  <b-row style="margin-top: 20px">
    <b-col cols="6">
      <dialer v-if="this.$agent.is_idle()"></dialer>
    </b-col>
  </b-row>
  </b-collapse>
</div>
</template>

<script>
import ToggleBar from './Widget/ToggleBar'
import Inqueue from './Agent/Inqueue'
import Dialer from './Agent/Dialer'
import Release from './Agent/Widget/Release'
import AgentState from './Agent/AgentState'
export default {
  widgetName: 'SESSION MANAGER',
  data () {
    return {
      showCollapse: true
    }
  },
  methods: {
    logout () { this.$agent.logout() },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    answer () { this.$agent.answer() },
    hangup () { this.$agent.hangup() }
  },
  components: {
    inqueue: Inqueue,
    dialer: Dialer,
    release: Release,
    toggleBar: ToggleBar,
    agentState: AgentState
  },
}
</script>