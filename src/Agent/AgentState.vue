<template>
<div>
  <div class="row" style="margin-top:5px;">
    <div class="col-5">
      <button v-if="a.hangup_state == 'available'" @click="release" class="btn btn-my agent-state-button">
        <icon name="stop" scale="3"></icon>
      </button>
      <button v-if="a.hangup_state == 'release'" @click="available" class="btn btn-my agent-state-button">
          <icon name="play" scale="3"></icon>
      </button>
      <release v-if="this.$agent.is_active()"></release>
    </div>
    <div class="col-7">
      <div v-if="a.state == 'available'" class="agent-state-available">
        <icon  name="circle-o" scale="4"></icon>
        <div>{{a.state}}</div>
      </div>
      <div v-if="a.state == 'release'" class="agent-state-released">
        <icon name="stop" scale="4"></icon>
        <div>released</div>
      </div>
      <div v-if="a.state == 'ringing'" class="agent-state-ringing">
        <icon  name="wifi" scale="4" style="transform: rotate(270deg);"></icon>
        <div>{{a.state}}</div>
      </div>
      <div v-if="this.$agent.is_onsession()" class="agent-state-oncall">
        <icon  name="phone" scale="4"></icon>
        <div>{{a.state}}</div>
      </div>
      <div v-if="this.$agent.is_hold()" class="agent-state-hold">
        <icon  name="pause" scale="4"></icon>
        <div>{{a.state}}</div>
      </div>
      <div v-if="this.$agent.is_wrapup()" class="agent-state-wrap-up">
        <icon  name="pause" scale="4"></icon>
        <div>{{a.state}}</div>
      </div>
    </div>
  </div>
  <div class="row" style="margin-top: 10px;"></div>
    <div class="row" v-if="a.state === 'release'">
      <div class="col-5 agent-state-text">Release reason:</div>
      <div class="col-7 agent-state-text"> {{release_reason}} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">State:</div>
      <div v-if="a.state != 'release'">
        <div class="col-7 agent-state-text">Active</div>
      </div>
      <div v-else>
        <div class="col-7 agent-state-text">Release</div>
      </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Since:</div>
      <div class="col-7 agent-state-text"> {{date}} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text">Activity Time:</div>
      <div class="col-7 agent-state-text"> {{msToHms(time_activity) }} </div>
    </div>
    <div class="row">
      <div class="col-5 agent-state-text myPhone">My Phone:</div>
      <div class="col-7 agent-state-text">
        <myPhoneUri v-if="this.$agent.is_idle()"></myPhoneUri>
      </div>
    </div>
  </div>
</template>
<script>
import Release from './Widget/Release'
import moment from 'moment'
import Common from '../Admin/Common'
import MyPhoneUri from '../Agent/MyPhoneUri'
export default {
  name: 'agent-state',
  mixins: [Common],
  data () {
    return {
      a: {},
      releases: [],
      updater: undefined,
      time_activity: null
    }
  },
  methods: {
    available () { this.$agent.available() },
    release () {
      if (this.a.release_id === 'undefined') {
        this.$notify({ title: 'Notify:', text: 'Please the select release reason', type: 'warning' })
        this.$agent.showNotification('Please select the release reason', 'https://viewme.ezuce.com/media/themes/seevogh/favicon.png', 'Release Reason')
      }
      else {
        this.$agent.release(this.a.release_id)
      }
    },
    onTimer() {
      this.time_activity = Date.now() - this.a.activity_time
    },
    query: async function () {
      this.a = this.$agent.getData()
      this.releases = await this.$agent.p_mfa('ws_agent', 'get_releases')
    },
  },
  beforeDestroy () {
    clearInterval(this.updater)
  },
  created () {
    this.query()
    this.updater = setInterval(this.onTimer, 1000)
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
  components: {
    release: Release,
    myPhoneUri: MyPhoneUri
  }
}
</script>
