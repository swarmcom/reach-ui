<template>
  <div>
    <div
      class="row"
      style="margin-top:5px;"
    >
      <div class="col-5 btn-group-vertical">
        <button
          v-if="a.hangup_state == 'available'"
          class="btn agent-state-button pointer buttons-border"
          @click="release"
        >
          <icon
            name="stop"
            scale="3"
          />
        </button>
        <button
          v-if="a.hangup_state == 'release'"
          class="btn agent-state-button pointer buttons-border"
          @click="available"
        >
          <icon
            name="play"
            scale="3"
          />
        </button>
        <release v-if="this.$agent.is_active()" />
      </div>
      <div class="col-7">
        <div
          v-if="a.state == 'available'"
          class="agent-state-available"
        >
          <icon
            name="circle-o"
            scale="4"
          />
          <div>Available</div>
        </div>
        <div
          v-if="a.state == 'release'"
          class="agent-state-released"
        >
          <icon
            name="stop"
            scale="4"
          />
          <div>Released</div>
        </div>
        <div
          v-if="a.state == 'ringing'"
          class="agent-state-ringing"
        >
          <icon
            name="wifi"
            scale="4"
            style="transform: rotate(270deg);"
          />
          <div style="margin-left:5px">
            Ringing
          </div>
        </div>
        <div
          v-if="a.state == 'outgoing'"
          class="agent-state-outgoing"
        >
          <icon
            name="wifi"
            scale="4"
            style="transform: rotate(90deg);"
          />
          <div style="margin-left:7px">
            {{ a.state }}
          </div>
        </div>
        <div
          v-if="a.state == 'test'"
          class="agent-state-oncall"
        >
          <icon
            name="phone"
            scale="4"
          />
          <div style="margin-left:11px">
            Test
          </div>
        </div>
        <div
          v-if="a.state == 'barge'"
          class="agent-state-oncall"
        >
          <icon
            name="phone"
            scale="4"
          />
          <div style="margin-left:9px">
            Barge
          </div>
        </div>
        <div
          v-if="a.state == 'suspended'"
          class="agent-state-suspend"
        >
          <icon
            name="hourglass-start"
            scale="4"
          />
          <div style="margin-left:1px">
            Suspend
          </div>
        </div>
        <div
          v-if="this.$agent.is_onsession()"
          class="agent-state-oncall"
        >
          <icon
            name="phone"
            scale="4"
          />
          <div style="margin-left:3px">
            On Call
          </div>
        </div>
        <div
          v-if="this.$agent.is_hold()"
          class="agent-state-hold"
        >
          <icon
            name="pause"
            scale="4"
          />
          <div style="margin-left:11px">
            Hold
          </div>
        </div>
        <div
          v-if="this.$agent.is_wrapup()"
          class="agent-state-wrap-up"
        >
          <icon
            name="pause"
            scale="4"
          />
          <div>Wrap Up</div>
        </div>
      </div>
    </div>
    <div
      class="row"
      style="margin-top: 10px;"
    />
    <div
      v-if="a.state === 'release'"
      class="row"
    >
      <div class="col-5 agent-state-text">
        Release reason:
      </div>
      <div class="col-7 agent-state-text">
        {{ release_reason }}
      </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">
        State:
      </div>
      <div v-if="a.state != 'release'">
        <div class="col-7 agent-state-text">
          Active
        </div>
      </div>
      <div v-else>
        <div class="col-7 agent-state-text">
          Release
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">
        Since:
      </div>
      <div class="col-7 agent-state-text">
        {{ date }}
      </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">
        Activity Time:
      </div>
      <div class="col-7 agent-state-text">
        {{ msToHms(time_activity) }}
      </div>
    </div>
    <div
      v-access:agent-feature-my-phone
      class="row"
    >
      <div class="col-5 agent-state-text myPhone">
        My Phone:
      </div>
    </div>
    <div
      v-access:agent-feature-my-phone
      class="row"
    >
      <my-phone-uri v-if="this.$agent.is_idle()" />
    </div>
  </div>
</template>
<script>
import Release from '@/Agent/Widget/Release'
import moment from 'moment'
import Common from '@/Admin/Common'
import MyPhoneUri from '@/Agent/MyPhoneUri'
export default {
  name: 'AgentState',
  components: {
    release: Release,
    'my-phone-uri': MyPhoneUri
  },
  mixins: [Common],
  data () {
    return {
      a: {},
      releases: [],
      updater: undefined,
      time_activity: null
    }
  },
  computed: {
    date: function () {
      return moment(this.a.activity_time).format('Do MMM YYYY[,] HH:mm')
    },
    release_reason: function () {
      let name = this.releases.find(I => I.id == this.a.release_id)
      return name ? name.name : ''
    }
  },
  beforeDestroy () {
    clearInterval(this.updater),
    this.$bus.$off('agent_state', this.getState)
  },
  created () {
    this.query()
    this.$agent.p_mfa('ws_agent', 'request_state', [])
    this.$bus.$on('agent_state', this.getState)
    this.updater = setInterval(this.onTimer, 1000)
  },
  methods: {
    available () { this.$agent.available() },
    release () {
      //if (this.a.release_id === 'undefined') {
      this.$agent.default_release()
        //this.$notify({ title: 'Notify:', text: 'Please the select release reason', type: 'warning' })
        //this.$agent.showNotification('Please select the release reason', 'https://viewme.ezuce.com/media/themes/seevogh/favicon.png', 'Release Reason')
      /*}
      else {
        this.$agent.release(this.a.release_id)
      }*/
    },
    onTimer() {
      this.time_activity = Date.now() - this.a.activity_time
    },
    getState (S) {
      if(S.tag == 'request' && (S.state.state == 'release' || S.state.state == 'available')){
        this.a.activity_time = new Date() - S.state.time
      }
      else if(S.tag == 'change') {
        if( (S.state.state == 'release') && (S.state.state_from == 'available') ) {
          this.a.activity_time = new Date()
        }
        else if( (S.state.state == 'available') && (S.state.state_from == 'release') ){
          this.a.activity_time = new Date()
        }
        else if( (S.state.state_from == 'ringing') ){
          this.a.wait_time = S.state.time
        }
        else if( (S.state.state_from == 'outgoing') ){
          this.a.wait_time = this.a.wait_time + S.state.time
        }
      }
    },
    query: async function () {
      this.a = this.$agent.getData()
      this.releases = await this.$agent.p_mfa('ws_agent', 'get_releases')
    },
  }
}
</script>
