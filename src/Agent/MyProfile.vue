<template>
<div>
  <toggle-bar style="background: #fff; border-bottom: 1px solid #fff;"></toggle-bar>
  <b-collapse v-model="showCollapse" id="collapseAgentInfo" class="mt-2">
    <b-row>
      <b-col cols="4">
        <b-img v-if="agent.avatar !== 'undefined'" :src="this.$agent.avatar_uri(agent.avatar)" style="width:64px;"/>
        <b-img v-else src='src/assets/default_agent.png' style="width:100%" alt="avatar image" />
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
      <b-col cols="7" class="agent-state-text"> {{agent.uri}} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Role:</b-col>
      <b-col cols="7" class="agent-state-text"> {{agent.role.name || '&nbsp'}} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Caller Id:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.caller_id_number || '&nbsp' }} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Caller Uri:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.uri || '&nbsp' }} </b-col>
    </b-row>
    <b-row>
      <b-col cols="5" class="agent-state-text">Persistent:</b-col>
      <b-col cols="7" class="agent-state-text"> {{ agent.persistent  }} </b-col>
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
        <button type="button" class="btn btn-sm pointer" @click="showCollapsePerm">
          <icon v-if="showPermCollapse" name="minus" scale="0.5"></icon>
          <icon v-if="!showPermCollapse" name="plus" scale="0.5"></icon>
        </button>
      </b-col>
      <b-col cols="5" class="title" style="margin-top:2px; color:#8c8c8c">Permissions:</b-col>
    </b-row>
    <b-row v-if="showPermCollapse" v-for="(v, index) in perms_check" :key="index">
      <b-col class="agent-state-text" cols="12" v-if="index===0"><b>Displayed Tabs:</b></b-col>
      <b-col class="agent-state-text" cols="12" v-if="index===5"><b>Accessible Widgets:</b></b-col>
      <b-col class="agent-state-text" cols="12" v-if="index===8"><b>Features:</b></b-col>
      <b-col class="agent-state-text" cols="12" v-if="index===18"><b>Supervisor Privileges:</b></b-col>
      <b-col class="agent-state-text" cols="8" >{{v.displayName}}:</b-col>
      <b-col class="agent-state-text" cols="4" >{{v.value}}</b-col>
    </b-row>
  </b-collapse>
</div>
</template>

<script>
export default {
  widgetName: 'My Profile',
  storageName: 'myProfile',
  data () {
    return {
      agent: this.$agent.vm.agent,
      showCollapse: true,
      showPermCollapse: false,
      perms_check: [{displayName: "Admin", name: "admin-ui", value: false},
                    {displayName: "Profile", name: "profile-ui", value: false},
                    {displayName: "Monitor", name: "monitor-ui", value: false},
                    {displayName: "Recordings", name: "recordings-ui", value: false},
                    {displayName: "Reports", name: "reports-ui", value: false},
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
      ]
    }
  },
  methods: {
    showCollapsePerm () {
      this.showPermCollapse = !this.showPermCollapse
      this.$agent.vm.storage_data['myProfilePermissionsCollapsed'] = this.showPermCollapse
      localStorage.setItem("reach-ui", JSON.stringify(this.$agent.vm.storage_data))
    }
  },
  created () {
    let perm = this.agent.permissions
    this.perms_check.forEach( function(key) {
      if(perm[key.name]) {
        key.value =  perm[key.name]
      }
    })
    if (this.$agent.vm.storage_data.myProfileCollapsed !== undefined)
      this.showCollapse = this.$agent.vm.storage_data.myProfileCollapsed
    if (this.$agent.vm.storage_data.myProfilePermissionsCollapsed !== undefined)
      this.showPermCollapse = this.$agent.vm.storage_data.myProfilePermissionsCollapsed
  }
}
</script>