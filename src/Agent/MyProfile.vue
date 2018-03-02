<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentInfo" class="mt-2">
    <b-row>
      <b-col cols="4">
        <b-img v-if="agent.avatar" :src="this.$agent.avatar_uri(agent.avatar)" style="width:64px;"/>
        <b-img v-else src='src/assets/default_agent.png' style="width:100%" alt="avatar image"/>
      </b-col>
      <b-col cols="8" class="agent-state-text">
        <b-row>{{agent.name}}</b-row>
        <b-row>{{agent.login}}</b-row>
        <b-row>{{agent.group.name}}</b-row>
      </b-col>
    </b-row>
    <br>
    <b-row>
      <b-col cols="5" class="agent-state-text">SIP Contact:</b-col>
      <b-col cols="7" class="agent-state-text"> {{agent.uri}}</b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Role:</b-col>
      <b-col cols="7" class="agent-state-text"> {{agent.role.name || '&nbsp'}}</b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Caller Id:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.caller_id_number || '&nbsp' }}</b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Caller Uri:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.uri || '&nbsp' }}</b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Persistent:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.persistent }}</b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Skills:</b-col>
      <b-col cols="7" class="agent-state-text">
        <b-row>
          <b-col cols="12" v-for="(v, k, index) in agent.skills" :key="index">{{k}}</b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="1">
        <button type="button" class="btn btn-sm pointer" @click="show('showPermCollapse')">
          <icon v-if="showPermCollapse" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermCollapse" name="plus" scale="0.5"></icon>
        </button>
      </b-col>
      <b-col cols="5" class="title" style="margin-top:2px; color:#8c8c8c">Permissions:</b-col>
    </b-row>
    <b-row v-if="showPermCollapse && $agent.role() === 'supervisor'" v-for="(v, index) in perms_check_supervisor"
           :key="index">
      <b-col class="agent-state-text" cols="12" v-if="index === 0">
        <div style="cursor:pointer" v-on:click="show('showPermTabs')">
          <icon v-if="showPermTabs" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermTabs" name="plus" scale="0.5"></icon>
          <b>Displayed Tabs:</b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index === 5">
        <div style="cursor:pointer" v-on:click="show('showPermWidgets')">
          <icon v-if="showPermWidgets" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermWidgets" name="plus" scale="0.5"></icon>
          <b>Accessible Widgets: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index === 8">
        <div style="cursor:pointer" v-on:click="show('showPermSupervisor')">
          <icon v-if="showPermSupervisor" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermSupervisor" name="plus" scale="0.5"></icon>
          <b>Supervisor Privileges: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index === 15">
        <div style="cursor:pointer" v-on:click="show('showPermFeatures')">
          <icon v-if="showPermFeatures" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermFeatures" name="plus" scale="0.5"></icon>
          <b>Features: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index === 18">
        <div style="cursor:pointer" v-on:click="show('showPermConfTrans')">
          <icon v-if="showPermConfTrans" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermConfTrans" name="plus" scale="0.5"></icon>
          <b>Conference/Transfer Privileges: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index === 25">
        <div style="cursor:pointer" v-on:click="show('showPermProfile')">
          <icon v-if="showPermProfile" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermProfile" name="plus" scale="0.5"></icon>
          <b>Agent Profile Privileges: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="8" v-if="isVisible(index)">{{v.displayName}}:</b-col>
      <b-col class="agent-state-text" cols="4" v-if="isVisible(index)">{{v.value}}</b-col>
    </b-row>
    <b-row v-if="showPermCollapse && $agent.role() === 'agent'" v-for="(v, index) in perms_check_agent" :key="index">
      <b-col class="agent-state-text" cols="12" v-if="index===0">
        <div style="cursor:pointer" v-on:click="show('showPermTabs')">
          <icon v-if="showPermTabs" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermTabs" name="plus" scale="0.5"></icon>
          <b>Displayed Tabs:</b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index===2">
        <div style="cursor:pointer" v-on:click="show('showPermWidgets')">
          <icon v-if="showPermWidgets" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermWidgets" name="plus" scale="0.5"></icon>
          <b>Accessible Widgets: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index===5">
        <div style="cursor:pointer" v-on:click="show('showPermFeatures')">
          <icon v-if="showPermFeatures" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermFeatures" name="plus" scale="0.5"></icon>
          <b>Features: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index===8">
        <div style="cursor:pointer" v-on:click="show('showPermConfTrans')">
          <icon v-if="showPermConfTrans" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermConfTrans" name="plus" scale="0.5"></icon>
          <b>Conference/Transfer Privileges: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index === 15">
        <div style="cursor:pointer" v-on:click="show('showPermSupervisor')">
          <icon v-if="showPermSupervisor" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermSupervisor" name="plus" scale="0.5"></icon>
          <b>Supervisor Privileges: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="12" v-if="index === 22">
        <div style="cursor:pointer" v-on:click="show('showPermProfile')">
          <icon v-if="showPermProfile" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermProfile" name="plus" scale="0.5"></icon>
          <b>Agent Profile Privileges: </b>
        </div>
      </b-col>
      <b-col class="agent-state-text" cols="8" v-if="isVisible(index)">{{v.displayName}}:</b-col>
      <b-col class="agent-state-text" cols="4" v-if="isVisible(index)">{{v.value}}</b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
import Storage from '@/Storage'

export default {
  widgetName: 'My Profile',
  name: 'my-profile',
  mixins: [Storage],
  data () {
    return {
      agent: this.$agent.vm.agent,
      showCollapse: true,
      showPermCollapse: false,
      showPermTabs: false,
      showPermWidgets: false,
      showPermSupervisor: false,
      showPermFeatures: false,
      showPermConfTrans: false,
      showPermProfile: false,
      perms_check_agent: [{displayName: "Main", name: "main-ui", value: false},
        {displayName: "Profile", name: "profile-ui", value: false},
        {displayName: "Agent Manager", name: "agentManager-widget", value: false},
        {displayName: "Queue Manager", name: "queueManager-widget", value: false},
        {displayName: "My Statistics", name: "myStatistics-widget", value: false},
        {displayName: "Set My Phone", name: "myPhone-feature", value: false},
        {displayName: "Allow Outbound", name: "outbound-feature", value: false},
        {displayName: "Allow On Demand Call Recording", name: "CROnDemand-feature", value: false},
        {displayName: "Transfer to Agent", name: "transAgent-feature", value: false},
        {displayName: "Transfer to Queue", name: "transQueue-feature", value: false},
        {displayName: "Transfer to Number", name: "transNumber-feature", value: false},
        {displayName: "Conference to Agent", name: "confAgent-feature", value: false},
        {displayName: "Conference to Queue", name: "confQueue-feature", value: false},
        {displayName: "Conference to Number", name: "confNumber-feature", value: false},
        {displayName: "Change Skills on Conf/Tran", name: "transConfChangeSkills-feature", value: false},
        {displayName: "Control Agent State", name: "controlAgentState-feature", value: false},
        {displayName: "Monitor", name: "monitor-feature", value: false},
        {displayName: "Barge", name: "barge-feature", value: false},
        {displayName: "Whisper", name: "whisper-feature", value: false},
        {displayName: "Take Over", name: "takeOver-feature", value: false},
        {displayName: "Take call from queue", name: "takeCallQueue-feature", value: false},
        {displayName: "Hangup call from queue", name: "hangupCallQueue-feature", value: false},
        {displayName: "Agent Name", name: "agentName-edit", value: false},
        {displayName: "Password", name: "agentPassword-edit", value: false},
        {displayName: "Line Out", name: "agentLineOut-visible", value: false},
        {displayName: "Primary SIP Contact", name: "primarySip-edit", value: false},
        {displayName: "SIP Contacts", name: "additionalSip-visible", value: false},
        {displayName: "Ring Timeout", name: "ringTimeout-edit", value: false},
        {displayName: "Max Missed Calls", name: "maxMissedCalls-edit", value: false},
        {displayName: "Reset Max Rings On Success", name: "maxRingsSuccess-edit", value: false},
        {displayName: "Auto Logout", name: "autoLogout-visible", value: false},
        {displayName: "Avatar", name: "avatar-visible", value: false},
        {displayName: "Agent Skills", name: "agentSkills-visible", value: false},
      ],
      perms_check_supervisor: [{displayName: "Main", name: "main-ui", value: false},
        {displayName: "Profile", name: "profile-ui", value: false},
        {displayName: "Monitor", name: "monitor-ui", value: false},
        {displayName: "Recordings", name: "recordings-ui", value: false},
        {displayName: "Reports", name: "reports-ui", value: false},
        {displayName: "Agent Manager", name: "agentManager-widget", value: false},
        {displayName: "Queue Manager", name: "queueManager-widget", value: false},
        {displayName: "My Statistics", name: "myStatistics-widget", value: false},
        {displayName: "Control Agent State", name: "controlAgentState-feature", value: false},
        {displayName: "Monitor", name: "monitor-feature", value: false},
        {displayName: "Barge", name: "barge-feature", value: false},
        {displayName: "Whisper", name: "whisper-feature", value: false},
        {displayName: "Take Over", name: "takeOver-feature", value: false},
        {displayName: "Take call from queue", name: "takeCallQueue-feature", value: false},
        {displayName: "Hangup call from queue", name: "hangupCallQueue-feature", value: false},
        {displayName: "Set My Phone", name: "myPhone-feature", value: false},
        {displayName: "Allow Outbound", name: "outbound-feature", value: false},
        {displayName: "Allow On Demand Call Recording", name: "CROnDemand-feature", value: false},
        {displayName: "Transfer to Agent", name: "transAgent-feature", value: false},
        {displayName: "Transfer to Queue", name: "transQueue-feature", value: false},
        {displayName: "Transfer to Number", name: "transNumber-feature", value: false},
        {displayName: "Conference to Agent", name: "confAgent-feature", value: false},
        {displayName: "Conference to Queue", name: "confQueue-feature", value: false},
        {displayName: "Conference to Number", name: "confNumber-feature", value: false},
        {displayName: "Change Skills on Conf/Tran", name: "transConfChangeSkills-feature", value: false},
        {displayName: "Agent Name", name: "agentName-edit", value: false},
        {displayName: "Password", name: "agentPassword-edit", value: false},
        {displayName: "Line Out", name: "agentLineOut-visible", value: false},
        {displayName: "Primary SIP Contact", name: "primarySip-edit", value: false},
        {displayName: "SIP Contacts", name: "additionalSip-visible", value: false},
        {displayName: "Ring Timeout", name: "ringTimeout-edit", value: false},
        {displayName: "Max Missed Calls", name: "maxMissedCalls-edit", value: false},
        {displayName: "Reset Max Rings On Success", name: "maxRingsSuccess-edit", value: false},
        {displayName: "Auto Logout", name: "autoLogout-visible", value: false},
        {displayName: "Avatar", name: "avatar-visible", value: false},
        {displayName: "Agent Skills", name: "agentSkills-visible", value: false},
      ]
    }
  },
  methods: {
    show (perm) {
      this[perm] = !this[perm]
      this.saveLocal(perm).writeLocal()
    },
    isVisible(index) {
      if (this.$agent.role() === 'agent') {
        if (index >= 0 && index < 2) {
          return this.showPermTabs
        }
        else if (index >= 2 && index < 5) {
          return this.showPermWidgets
        }
        else if (index >= 15 && index < 22) {
          return this.showPermSupervisor
        }
        else if (index >= 5 && index < 8) {
          return this.showPermFeatures
        }
        else if (index >= 8 && index < 15) {
          return this.showPermConfTrans
        }
        else if (index >= 22) {
          return this.showPermProfile
        }
      }
      else if (this.$agent.role() === 'supervisor') {
        if (index >= 0 && index < 5) {
          return this.showPermTabs
        }
        else if (index >= 5 && index < 8) {
          return this.showPermWidgets
        }
        else if (index >= 8 && index < 15) {
          return this.showPermSupervisor
        }
        else if (index >= 15 && index < 18) {
          return this.showPermFeatures
        }
        else if (index >= 18 && index < 25) {
          return this.showPermConfTrans
        }
        else if (index >= 25) {
          return this.showPermProfile
        }
      }
    }
  },
  created () {
    let perm = this.agent.permissions
    if (this.$agent.role() === 'supervisor') {
      this.perms_check_supervisor.forEach(function (key) {
        if (perm[key.name]) {
          key.value = perm[key.name]
        }
      })
    }
    else {
      this.perms_check_agent.forEach(function (key) {
        if (perm[key.name]) {
          key.value = perm[key.name]
        }
      })
    }
    this.maybeInitLocal().loadLocal('showCollapse', 'showPermCollapse')
    this.maybeInitLocal().loadLocal('showCollapse', 'showPermTabs')
    this.maybeInitLocal().loadLocal('showCollapse', 'showPermWidgets')
    this.maybeInitLocal().loadLocal('showCollapse', 'showPermSupervisor')
    this.maybeInitLocal().loadLocal('showCollapse', 'showPermFeatures')
    this.maybeInitLocal().loadLocal('showCollapse', 'showPermConfTrans')
    this.maybeInitLocal().loadLocal('showCollapse', 'showPermProfile')
  },
  watch: {
    showCollapse: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.saveLocal('showCollapse').writeLocal()
      }
    },
  }
}
</script>