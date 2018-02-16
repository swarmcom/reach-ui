<template>
<div>
  <b-row style="margin-bottom: 10px">
    <b-col><h3>Permissions: (
      <a class="pointerLink" @click='selectAll()'>all</a> / 
      <a class="pointerLink" @click='unselectAll()'>none</a> )
    </h3></b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-row>
        <b-col><h4>Available Tabs: (
          <a class="pointerLink" @click='select(tabs)'>all</a> / 
          <a class="pointerLink" @click='unselect(tabs)'>none</a> )
        </h4></b-col
      ></b-row>
      <b-row v-for="(p) of this.tabs" :key="p" v-if="tabsVisible(p)">
        <b-col cols="10">{{names[p].name}}</b-col>
        <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
      <b-row>
        <b-col><h4>UI Features: (
          <a class="pointerLink" @click='select(features)'>all</a> / 
          <a class="pointerLink" @click='unselect(features)'>none</a> )
        </h4></b-col>
      </b-row>
      <b-row v-for="(p) of this.features" :key="p">
        <b-col cols="10">{{names[p].name}}</b-col>
        <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
    </b-col>
    <b-col>
      <b-row>
        <b-col><h4>Available Widgets: (
          <a class="pointerLink" @click='select(widgets)'>all</a> / 
          <a class="pointerLink" @click='unselect(widgets)'>none</a> )
        </h4></b-col>
      </b-row>
      <b-row v-for="p of this.widgets" :key="p">
          <b-col cols="10">{{names[p].name}}</b-col>
          <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
      <b-row>
        <b-col><h4>Call Features: (
          <a class="pointerLink" @click='select(call_features)'>all</a> / 
          <a class="pointerLink" @click='unselect(call_features)'>none</a> )
        </h4></b-col>
      </b-row>
      <b-row v-for="(p) of this.call_features" :key="p">
        <b-col cols="10">{{names[p].name}}</b-col>
        <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
      <b-row>
        <b-col><h4>Agent Profile Edit: (
          <a class="pointerLink" @click='select(agent_features)'>all</a> / 
          <a class="pointerLink" @click='unselect(agent_features)'>none</a> )
        </h4></b-col>
      </b-row>
      <b-row v-for="p of this.agent_features" :key="p">
        <b-col cols="10">{{names[p].name}}</b-col>
        <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
    </b-col>
  </b-row>
</div>
</template>

<script>
export default {
  name: 'admin-role-permissions',
  props: ['id', 'ui'],
  data () {
    return {
      name: undefined,
      effective: {
        "main-ui": false,
        "admin-ui": false,
        "profile-ui": false,
        "recordings-ui": false,
        "reports-ui": false,
        "monitor-ui": false,
        "agentManager-widget": false,
        "queueManager-widget": false,
        "myStatistics-widget": false,
        "controlAgentState-feature": false,
        "monitor-feature": false,
        "barge-feature": false,
        "whisper-feature": false,
        "takeOver-feature": false,
        "takeCallQueue-feature": false,
        "hangupCallQueue-feature": false,
        "myPhone-feature": false,
        "outbound-feature": false,
        "CROnDemand-feature": false,
        "transAgent-feature": false,
        "transQueue-feature": false,
        "transNumber-feature": false,
        "confAgent-feature": false,
        "confQueue-feature": false,
        "confNumber-feature": false,
        "transConfChangeSkills-feature": false,
        "sip-can-register": false,
        "agentName-edit": false,
        "agentPassword-edit": false,
        "agentLineOut-visible": false,
        "primarySip-edit": false,
        "additionalSip-visible": false,
        "ringTimeout-edit": false,
        "maxMissedCalls-edit": false,
        "maxRingsSuccess-edit": false,
        "autoLogout-visible": false,
        "avatar-visible": false,
        "agentSkills-visible": false
      },
      tabs: [
        'main-ui',
        'admin-ui',
        'profile-ui',
        'recordings-ui',
        'reports-ui',
        'monitor-ui'
      ],
      widgets: [
        'myStatistics-widget',
        'queueManager-widget',
        'agentManager-widget'
      ],
      features: [
        'controlAgentState-feature',
        'myPhone-feature',
        'outbound-feature',
        'CROnDemand-feature',
        'transAgent-feature',
        'transQueue-feature',
        'transNumber-feature',
        'confAgent-feature',
        'confQueue-feature',
        'confNumber-feature',
        'transConfChangeSkills-feature'
      ],
      call_features: [
        'sip-can-register',
        'monitor-feature',
        'whisper-feature',
        'barge-feature',
        'takeOver-feature',
        'takeCallQueue-feature',
        'hangupCallQueue-feature'
      ],
      agent_features: [
        "agentName-edit",
        "agentPassword-edit",
        "agentLineOut-visible",
        "primarySip-edit",
        "additionalSip-visible",
        "ringTimeout-edit",
        "maxMissedCalls-edit",
        "maxRingsSuccess-edit",
        "autoLogout-visible",
        "avatar-visible",
        "agentSkills-visible"
      ],
      names: {
        "main-ui": { name: "Main Tab" },
        "admin-ui": { name: "Admin" },
        "profile-ui": { name: "Profile" },
        "recordings-ui": { name: "Recordings" },
        "reports-ui": { name: "Reports" },
        "monitor-ui": { name: "Monitor" },
        "agentManager-widget": { name: "Agent Manger" },
        "queueManager-widget": { name: "Queue Manager" },
        "myStatistics-widget": { name: "My Statistics" },
        "controlAgentState-feature": { name: "Control Agent State" },
        "monitor-feature": { name: "Monitor" },
        "barge-feature": { name: "Barge" },
        "whisper-feature": { name: "Whisper" },
        "takeOver-feature": { name: "Take Over" },
        "takeCallQueue-feature": { name: "Take call from queue" },
        "hangupCallQueue-feature": { name: "Hangup call from queue"},
        "myPhone-feature": { name: "Set My Phone" },
        "outbound-feature": { name: "Allow Outbound" },
        "CROnDemand-feature": { name: "Allow On Demand Call Recording" },
        "transAgent-feature": { name: "Transfer to Agent" },
        "transQueue-feature": { name: "Transfer to Queue" },
        "transNumber-feature": { name: "Transfer to Number" },
        "confAgent-feature": { name: "Conference to Agent" },
        "confQueue-feature": { name: "Conference to Queue" },
        "confNumber-feature": { name: "Conference to Number" },
        "transConfChangeSkills-feature": { name: "Change Skills on Conf/Tran" },
        "sip-can-register": { name: "Allow to register SIP phone" },
        "agentName-edit": { name: "Name" },
        "agentPassword-edit": { name: "Password" },
        "agentLineOut-visible": { name: "Line Out" },
        "primarySip-edit": { name: "Primary SIP Contact" },
        "additionalSip-visible": { name: "SIP Contacts" },
        "ringTimeout-edit": { name: "Ring Timeout" },
        "maxMissedCalls-edit": { name: "Max Missed Calls" },
        "maxRingsSuccess-edit": { name: "Reset Max Rings On Success" },
        "autoLogout-visible": { name: "Auto Logout" },
        "avatar-visible": { name: "Avatar" },
        "agentSkills-visible": { name: "Agent Skills" }
      }
    }
  },
  methods: {
    query: async function () {
      this.effective = await this.$agent.p_mfa('ws_db_permission', 'map', [this.id])
    },
    onChange: async function(perm, checked) {
      if (checked) {
        await this.$agent.p_mfa('ws_db_permission', 'set', [this.id, perm])
        this.effective[perm] = true
      }
      else {
        await this.$agent.p_mfa('ws_db_permission', 'unset', [this.id, perm])
        this.effective[perm] = false
      }
    },
    tabsVisible: function (perm) {
      if (this.ui == 'supervisor') {
        return (perm != 'admin-ui' && perm != 'profile-ui')
      }
      else if (this.ui == 'agent') {
        return (perm == 'main-ui' || perm == 'profile-ui')
      }
      else {
        return true
      }
    },
    isAgent () {
      return this.ui == 'agent'
    },
    selectAll () {
      let self = this
      Object.keys(this.names).forEach(function (key) {
        self.onChange(key, true)
      })
    },
    unselectAll () {
      let self = this
      Object.keys(this.names).forEach(function (key) {
        self.onChange(key, false)
      })
    },
    select (group) {
      let self = this
      group.forEach(function (key) {
        self.onChange(key, true)
      })
    },
    unselect (group) {
      let self = this
      group.forEach(function (key) {
        self.onChange(key, false)
      })
    }
  },
  created () {
    this.query()
  }
}
</script>
