<template>
<div>
  <toggle-bar></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseSessionManager" class="mt-2">
    <div class="row">
      <div class="col-12 col-md-3">
        <agent-state></agent-state>
        <agent-info></agent-info>
      </div>
      <div class="col-md-9 col-12">
        <div class="row">
          <b-row class="col-9">
            <b-col cols="8">
              <dialer v-if="this.$agent.is_idle()"></dialer>
              <!--<override v-if="this.$agent.is_idle()"></override>-->
            </b-col>
            <b-col cols="12">
              <inqueue></inqueue>
            </b-col>
          </b-row>
          <div class="col-3 pull-right text-right">
            <div class="row">
            <div v-if="this.$agent.can_hangup()" class="state-time">{{msToHms( this.state_time )}}</div>
            <wrap-timer  v-if="this.wrapVisible" :inqueue="inqueue" :state_time="state_time" class="state-time"></wrap-timer>
            <button v-if="this.$agent.is_hold()" @click="unhold" class="btn btn-outline-secondary pointer">
              <icon name="pause" scale="2"></icon>
            </button>
            <button v-if="this.$agent.is_oncall()" @click="hold" class="btn btn-outline-success pointer">
              <icon name="pause" scale="2"></icon>
            </button>
            <button v-if="this.$agent.can_hangup()" @click="hangup" class="btn btn-outline-danger pointer">
              <icon name="close" scale="2"></icon></button>
            <button v-if="this.$agent.is_wrapup()" @click="wrapup" class="btn btn-outline-danger pointer">
              <icon name="close" scale="2"></icon></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-collapse>
</div>
</template>

<script>
import Inqueue from '@/Agent/Inqueue'
import Dialer from '@/Agent/Dialer'
import Override from '@/Agent/Override'
import Release from '@/Agent/Widget/Release'
import AgentState from '@/Agent/AgentState'
import AgentInfo from '@/Agent/Info'
import Common from '@/Admin/Common'
import Wrap from '@/Agent/Widget/Wrap'
export default {
  widgetName: 'SESSION MANAGER',
  storageName: 'sessionManager',
  mixins: [Common],
  data () {
    return {
      updater: undefined,
      state_time: 0,
      inqueue: undefined,
      showCollapse: true,
      wrapVisible: false
    }
  },
  methods: {
    logout () { this.$agent.logout() },
    hold () { this.$agent.hold() },
    unhold () { this.$agent.unhold() },
    answer () { this.$agent.answer() },
    hangup () { this.$agent.hangup() },
    wrapup () { this.$agent.p_mfa('ws_agent', 'end_wrapup') },
    onTimer() {
      this.state_time += 1000
    },
    getInqueue: async function(uuid) {
      this.inqueue = await this.$agent.p_mfa('ws_agent', 'inqueue_state', ['inqueue_call', uuid])
      if(this.inqueue.queue != undefined)
        this.wrapVisible = true
    },
    getState (S) {
      if(S.tag == 'request')
        this.state_time = S.state.time
      else
        this.state_time = 0

      if (S.state.state != 'wrapup')
        this.wrapVisible = false
      else if (S.state.inqueue.inqueue_call)
        this.getInqueue(S.state.inqueue.inqueue_call)
    }
  },
  created () {
    this.$agent.p_mfa('ws_agent', 'request_state', [])
    this.$bus.$on('agent_state', this.getState)
    this.updater = setInterval(this.onTimer, 1000)
    if (this.$agent.vm.storage_data.sessionManagerCollapsed != undefined)
      this.showCollapse = this.$agent.vm.storage_data.sessionManagerCollapsed
  },
  beforeDestroy () {
    clearInterval(this.updater)
    this.$bus.$off('agent_state', this.getState)
  },
  components: {
    inqueue: Inqueue,
    dialer: Dialer,
    release: Release,
    'agent-state': AgentState,
    'agent-info': AgentInfo,
    override: Override,
    'wrap-timer': Wrap
  },
}
</script>