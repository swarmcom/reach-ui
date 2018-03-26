<template>
<div>
  <b-row style="margin-bottom: 10px">
    <b-col cols=2><h3>Permissions:</h3></b-col>
    <b-col>
      <b-btn variant="link" @click='selectAll()'>all</b-btn>|<b-btn variant="link" @click='unselectAll()'>none</b-btn>
    </b-col>
  </b-row>
  <b-row>
    <b-col>

      <b-row>
        <b-col cols=6>
          <h4>Available Tabs:</h4>
        </b-col>
        <b-col>
          <b-btn variant="link" @click='select(tabs)'>all</b-btn>|<b-btn variant="link" @click='unselect(tabs)'>none</b-btn>
        </b-col>
      </b-row>
      <b-row v-for="(p) of this.tabs" :key="p" v-if="tabsVisible(p)">
        <b-col cols="10">&nbsp;&nbsp;{{names[p].name}}</b-col>
        <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>

      <b-row style="margin-top: 15px">
        <b-col cols=6><h4>UI Features:</h4></b-col>
        <b-col>
          <b-btn variant="link" @click='select(features)'>all</b-btn>|<b-btn variant="link" @click='unselect(features)'>none</b-btn>
        </b-col>
      </b-row>
      <b-row v-for="(p) of this.features" :key="p">
        <b-col cols="10">&nbsp;&nbsp;{{names[p].name}}</b-col>
        <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>
    </b-col>

    <b-col>

      <b-row>
        <b-col cols=6><h4>Available Widgets:</h4></b-col>
        <b-col>
          <b-btn variant="link" @click='select(widgets)'>all</b-btn>|<b-btn variant="link" @click='unselect(widgets)'>none</b-btn>
        </b-col>
      </b-row>
      <b-row v-for="p of this.widgets" :key="p">
          <b-col cols="10">&nbsp;&nbsp;{{names[p].name}}</b-col>
          <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>

      <b-row style="margin-top: 15px">
        <b-col cols=6><h4>Call Features:</h4></b-col>
        <b-col>
          <b-btn variant="link" @click='select(call_features)'>all</b-btn>|<b-btn variant="link" @click='unselect(call_features)'>none</b-btn>
        </b-col>
      </b-row>
      <b-row v-for="(p) of this.call_features" :key="p">
        <b-col cols="10">&nbsp;&nbsp;{{names[p].name}}</b-col>
        <b-col cols="2"><b-form-checkbox v-model="effective[p]" v-on:change="onChange(p, $event)"></b-form-checkbox></b-col>
      </b-row>

      <b-row style="margin-top: 15px">
        <b-col cols=6><h4>Agent Profile:</h4></b-col>
        <b-col>
          <b-btn variant="link" @click='select(agent_features)'>all</b-btn>|<b-btn variant="link" @click='unselect(agent_features)'>none</b-btn>
        </b-col>
      </b-row>
      <b-row v-for="p of this.agent_features" :key="p">
        <b-col cols="10">&nbsp;&nbsp;{{names[p].name}}</b-col>
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
        "widget-agent-manager": false,
        "widget-queue-manager": false,
        "widget-my-statistics": false,
        "supervisor-feature-control-agent-state": false,
        "supervisor-feature-monitor": false,
        "supervisor-feature-barge": false,
        "supervisor-feature-whisper": false,
        "supervisor-feature-take-over": false,
        "supervisor-feature-take-call-queue": false,
        "supervisor-feature-hangup-call-queue": false,
        "agent-feature-my-phone": false,
        "agent-feature-outbound-calling": false,
        "agent-feature-call-recording-on-demand": false,
        "agent-feature-transfer-agent": false,
        "agent-feature-transfer-queue": false,
        "agent-feature-transfer-number": false,
        "agent-feature-conference-agent": false,
        "agent-feature-conference-queue": false,
        "agent-feature-conference-number": false,
        "agent-feature-conference-change-skills": false,
        "agent-profile-edit-name": false,
        "agent-profile-edit-password": false,
        "agent-profile-edit-line-out": false,
        "agent-profile-edit-primary-sip": false,
        "agent-profile-edit-additional-sip": false,
        "agent-profile-edit-ring-timeout": false,
        "agent-profile-edit-max-missed-calls": false,
        "agent-profile-edit-max-ring-success": false,
        "agent-profile-edit-autologout": false,
        "agent-profile-edit-avatar": false,
        "agent-profile-edit-agent-skills": false
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
        'widget-my-statistics',
        'widget-queue-manager',
        'widget-agent-manager'
      ],
      features: [
        'supervisor-feature-control-agent-state',
        'agent-feature-my-phone',
        'agent-feature-outbound-calling',
        'agent-feature-call-recording-on-demand',
        'agent-feature-transfer-agent',
        'agent-feature-transfer-queue',
        'agent-feature-transfer-number',
        'agent-feature-conference-agent',
        'agent-feature-conference-queue',
        'agent-feature-conference-number',
        'agent-feature-conference-change-skills'
      ],
      call_features: [
        'supervisor-feature-monitor',
        'supervisor-feature-whisper',
        'supervisor-feature-barge',
        'supervisor-feature-take-over',
        'supervisor-feature-take-call-queue',
        'supervisor-feature-hangup-call-queue'
      ],
      agent_features: [
        "agent-profile-edit-name",
        "agent-profile-edit-password",
        "agent-profile-edit-line-out",
        "agent-profile-edit-primary-sip",
        "agent-profile-edit-additional-sip",
        "agent-profile-edit-ring-timeout",
        "agent-profile-edit-max-missed-calls",
        "agent-profile-edit-max-ring-success",
        "agent-profile-edit-autologout",
        "agent-profile-edit-avatar",
        "agent-profile-edit-agent-skills"
      ],
      names: {
        "main-ui": { name: "Main Tab" },
        "admin-ui": { name: "Admin" },
        "profile-ui": { name: "Profile" },
        "recordings-ui": { name: "Recordings" },
        "reports-ui": { name: "Reports" },
        "monitor-ui": { name: "Monitor" },
        "widget-agent-manager": { name: "Agent Manger" },
        "widget-queue-manager": { name: "Queue Manager" },
        "widget-my-statistics": { name: "My Statistics" },
        "supervisor-feature-control-agent-state": { name: "Control Agent State" },
        "supervisor-feature-monitor": { name: "Monitor" },
        "supervisor-feature-barge": { name: "Barge" },
        "supervisor-feature-whisper": { name: "Whisper" },
        "supervisor-feature-take-over": { name: "Take Over" },
        "supervisor-feature-take-call-queue": { name: "Take call from queue" },
        "supervisor-feature-hangup-call-queue": { name: "Hangup call from queue"},
        "agent-feature-my-phone": { name: "Set My Phone" },
        "agent-feature-outbound-calling": { name: "Allow Outbound" },
        "agent-feature-call-recording-on-demand": { name: "Allow On Demand Call Recording" },
        "agent-feature-transfer-agent": { name: "Transfer to Agent" },
        "agent-feature-transfer-queue": { name: "Transfer to Queue" },
        "agent-feature-transfer-number": { name: "Transfer to Number" },
        "agent-feature-conference-agent": { name: "Conference to Agent" },
        "agent-feature-conference-queue": { name: "Conference to Queue" },
        "agent-feature-conference-number": { name: "Conference to Number" },
        "agent-feature-conference-change-skills": { name: "Change Skills on Conf/Tran" },
        "agent-profile-edit-name": { name: "Name" },
        "agent-profile-edit-password": { name: "Password" },
        "agent-profile-edit-line-out": { name: "Line Out" },
        "agent-profile-edit-primary-sip": { name: "Primary SIP Contact" },
        "agent-profile-edit-additional-sip": { name: "SIP Contacts" },
        "agent-profile-edit-ring-timeout": { name: "Ring Timeout" },
        "agent-profile-edit-max-missed-calls": { name: "Max Missed Calls" },
        "agent-profile-edit-max-ring-success": { name: "Reset Max Rings On Success" },
        "agent-profile-edit-autologout": { name: "Auto Logout" },
        "agent-profile-edit-avatar": { name: "Avatar" },
        "agent-profile-edit-agent-skills": { name: "Agent Skills" }
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
        return (perm != 'admin-ui')
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
