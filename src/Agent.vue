<template>
<div>
  <toggleBar></toggleBar>
  <b-collapse v-model="showCollapse" id="collapseSessionManager" class="mt-2">
    <div class="row">
      <div class="col-12 col-md-3">
        <agentState></agentState>
        <agentInfo></agentInfo>
      </div>
      <div class="col-md-9 col-12">
        <div class="row">
          <b-row class="col-10">
            <b-col cols="8">
              <dialer v-if="this.$agent.is_idle()"></dialer>
              <override v-if="this.$agent.is_idle()"></override>
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
            <button v-if="this.$agent.can_hangup()" @click="hangup" class="btn btn-outline-danger">
              <icon name="close" scale="2"></icon></button>
            <button v-if="this.$agent.is_wrapup()" @click="wrapup" class="btn btn-outline-danger">
              <icon name="close" scale="2"></icon></button>
          </div>
        </div>
      </div>
    </div>
  </b-collapse>
</div>
</template>

<script>
import ToggleBar from './Widget/ToggleBar'
import Inqueue from './Agent/Inqueue'
import Dialer from './Agent/Dialer'
import Override from './Agent/Override'
import Release from './Agent/Widget/Release'
import AgentState from './Agent/AgentState'
import AgentInfo from './Agent/Info'

export default {
  widgetName: 'SESSION MANAGER',
  storageName: 'sessionManager',
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
    hangup () { this.$agent.hangup() },
    wrapup () { this.$agent.p_mfa('ws_agent', 'end_wrapup') },
  },
  created () {
    this.a = this.$agent.getData()
    if (this.a.storage_data.sessionManagerCollapsed != undefined)
      this.showCollapse = this.a.storage_data.sessionManagerCollapsed
  },
  components: {
    inqueue: Inqueue,
    dialer: Dialer,
    release: Release,
    toggleBar: ToggleBar,
    agentState: AgentState,
    agentInfo: AgentInfo,
    override: Override
  },
}
</script>
